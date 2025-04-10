import React, { Component, ErrorInfo } from 'react';
import cssClasses from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: React.ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className={cssClasses['wrapper']}>
          <p>К сожалению произошла непредвиденная ошибка.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
