import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "#000000",
            color: "#ffffff",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "48px" }}>🐾</div>
          <h2
            style={{
              fontFamily: "Space Grotesk",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#9a9a9a",
              fontSize: "14px",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => (window.location.href = "/app")}
            style={{
              background: "#8052ff",
              color: "#ffffff",
              border: "none",
              borderRadius: "24px",
              padding: "12px 24px",
              fontFamily: "Space Grotesk",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
