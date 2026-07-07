// Generic single-field prompt dialog — replaces window.prompt() call sites
// with an in-app dialog matching the rest of the design system.
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placeholder?: string;
  confirmLabel?: string;
  multiline?: boolean;
  onConfirm: (value: string) => void;
}

export function QuickPromptDialog({
  open,
  onOpenChange,
  title,
  description,
  placeholder,
  confirmLabel = "Save",
  multiline = false,
  onConfirm,
}: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  function confirm() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-background/95">
        <DialogTitle className="font-display text-xl tracking-tight">{title}</DialogTitle>
        {description && (
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        )}

        <div className="mt-2">
          {multiline ? (
            <textarea
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              placeholder={placeholder}
              className="w-full resize-none rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
          ) : (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirm()}
              placeholder={placeholder}
              className="w-full rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="press-scale rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
