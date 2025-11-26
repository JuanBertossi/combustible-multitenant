// Declarations for JSX modules
declare module "./components/common/ErrorBoundary/ErrorBoundary" {
  import React from "react";
  interface ErrorBoundaryProps {
    children: React.ReactNode;
  }
  const ErrorBoundary: React.ComponentType<ErrorBoundaryProps>;
  export default ErrorBoundary;
}

declare module "./components/common/SkeletonLoading/SkeletonLoading" {
  import React from "react";
  interface SkeletonLoadingProps {
    variant?: "text" | "rectangular" | "circular";
    height?: number;
    width?: string | number;
    count?: number;
  }
  const SkeletonLoading: React.ComponentType<SkeletonLoadingProps>;
  export default SkeletonLoading;
}

declare module "../common/ProgressBar/ProgressBar" {
  import React from "react";
  interface ProgressBarProps {
    visible?: boolean;
  }
  const ProgressBar: React.ComponentType<ProgressBarProps>;
  export default ProgressBar;
}
