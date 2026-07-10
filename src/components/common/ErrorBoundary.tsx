import { Component, type ReactNode } from "react";
import { PremiumErrorState } from "@/components/common/PremiumErrorState";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="py-20">
          <PremiumErrorState
            title="Something unexpected happened"
            description={this.state.error.message ?? "An unhandled error occurred. Please reload the page."}
            action={
              <button
                onClick={() => {
                  this.setState({ error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Reload page
              </button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
