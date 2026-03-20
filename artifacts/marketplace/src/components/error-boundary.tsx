import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>Something went wrong</h1>
              <p style={{ color: "#666", marginBottom: "24px", fontSize: "14px" }}>
                {this.state.error?.message || "An unexpected error occurred. Please try refreshing the page."}
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <a 
                  href="/"
                  style={{ flex: 1, padding: "10px 16px", backgroundColor: "#f5f5f5", color: "#333", textDecoration: "none", borderRadius: "4px", border: "1px solid #ddd", fontWeight: "500", cursor: "pointer", textAlign: "center" }}
                >
                  Go Home
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  style={{ flex: 1, padding: "10px 16px", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "4px", fontWeight: "500", cursor: "pointer" }}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
