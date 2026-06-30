#!/usr/bin/env python3
"""
Visual regression for Chronicle's premium interaction primitives.

Captures element-level screenshots of PosterCard and PremiumButton in three
interaction states (default, hover, active) against the local dev server and
diffs them against baselines stored in tests/visual/baselines/.

Run with:
    python3 tests/visual/run.py            # check (fails on drift)
    python3 tests/visual/run.py --update   # write new baselines

The harness route is src/routes/visual.tsx — DO NOT link from the app.
"""
from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright, Page, ElementHandle

HERE = Path(__file__).parent
BASELINES = HERE / "baselines"
DIFFS = HERE / "diffs"
ACTUALS = HERE / "actuals"
URL = "http://localhost:8080/visual?ready=1"

# (test-id, friendly slug, padding-px around the element capture)
TARGETS: list[tuple[str, str, int]] = [
    ("poster-card", "poster-card", 24),
    ("btn-primary", "btn-primary", 16),
    ("btn-secondary", "btn-secondary", 16),
    ("btn-ghost", "btn-ghost", 16),
]
STATES = ("default", "hover", "active")

# Mean per-channel diff threshold (0-255). Anti-aliasing and subpixel rendering
# create tiny noise even between identical runs; 1.5 is empirically tight enough
# to catch a shadow/radius change while ignoring AA jitter.
DIFF_THRESHOLD = 1.5


async def capture_state(page: Page, el: ElementHandle, state: str, out: Path, pad: int) -> None:
    box = await el.bounding_box()
    if not box:
        raise AssertionError(f"element [{state}] has no bounding box")
    clip = {
        "x": max(0, box["x"] - pad),
        "y": max(0, box["y"] - pad),
        "width": box["width"] + pad * 2,
        "height": box["height"] + pad * 2,
    }

    if state == "default":
        await page.mouse.move(0, 0)
    elif state == "hover":
        await el.hover()
    elif state == "active":
        await el.hover()
        cx = box["x"] + box["width"] / 2
        cy = box["y"] + box["height"] / 2
        await page.mouse.move(cx, cy)
        await page.mouse.down()

    # Let the transition fully settle. --dur-large is 360ms; double it.
    await page.wait_for_timeout(800)

    out.parent.mkdir(parents=True, exist_ok=True)
    await page.screenshot(path=str(out), clip=clip, animations="disabled")

    if state == "active":
        # Release outside the element so PosterCard's <a> doesn't navigate.
        await page.mouse.move(0, 0)
        await page.mouse.up()


def mean_diff(a: Path, b: Path) -> float:
    img_a = Image.open(a).convert("RGB")
    img_b = Image.open(b).convert("RGB")
    if img_a.size != img_b.size:
        return float("inf")
    diff = ImageChops.difference(img_a, img_b)
    pixels = diff.getdata()
    total = sum(sum(p) for p in pixels)
    return total / (img_a.size[0] * img_a.size[1] * 3)


def write_diff(baseline: Path, actual: Path, dest: Path) -> None:
    img_a = Image.open(baseline).convert("RGB")
    img_b = Image.open(actual).convert("RGB")
    if img_a.size != img_b.size:
        return
    diff = ImageChops.difference(img_a, img_b)
    # Amplify so a human can see what changed.
    bright = diff.point(lambda v: min(255, v * 8))
    dest.parent.mkdir(parents=True, exist_ok=True)
    bright.save(dest)


async def run(update: bool) -> int:
    failures: list[tuple[str, float]] = []
    written: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            device_scale_factor=1,
            reduced_motion="no-preference",  # we want to see transitions
            color_scheme="dark",
        )
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await page.wait_for_selector("[data-vr-ready='1']")
        # Ensure web fonts and the SVG poster fully decode before snapshots.
        await page.evaluate("document.fonts ? document.fonts.ready : null")
        await page.wait_for_timeout(300)

        for tid, slug, pad in TARGETS:
            for state in STATES:
                # Re-query each state — motion-driven transforms can detach
                # cached handles between captures.
                el = await page.query_selector(f"[data-vr-id='{tid}']")
                assert el, f"missing fixture [data-vr-id='{tid}']"
                await el.scroll_into_view_if_needed()
                name = f"{slug}.{state}.png"
                actual = ACTUALS / name
                baseline = BASELINES / name
                await capture_state(page, el, state, actual, pad)

                if update or not baseline.exists():
                    baseline.parent.mkdir(parents=True, exist_ok=True)
                    Image.open(actual).save(baseline)
                    written.append(name)
                    continue

                d = mean_diff(baseline, actual)
                if d > DIFF_THRESHOLD:
                    write_diff(baseline, actual, DIFFS / name)
                    failures.append((name, d))
                    print(f"  ✗ {name}  mean Δ={d:.3f}  > {DIFF_THRESHOLD}")
                else:
                    print(f"  ✓ {name}  mean Δ={d:.3f}")

        await browser.close()

    if written:
        print(f"\n  wrote {len(written)} baseline(s): {', '.join(written)}")
    if failures:
        print(f"\n  {len(failures)} regression(s). Diffs in {DIFFS.relative_to(Path.cwd())}/")
        return 1
    print("\n  all visual snapshots match baselines.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true", help="overwrite baselines")
    args = ap.parse_args()
    return asyncio.run(run(args.update))


if __name__ == "__main__":
    sys.exit(main())
