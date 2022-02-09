import React, { Component } from 'react';

// This will only work when not in development mode!
// Try to use this only on suspicious components , not on whole app
export default class ErrorBoundary extends Component {
    state = {
      hasError: false,
      errorMessage: ''
    };

    componentDidCatch (error: Error, errorInfo: React.ErrorInfo): void {
      this.setState({
        errorMessage: error.message,
        hasError: true
      });
    }

    render (): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return this.state.hasError ? <h1>Some thing went wrong!</h1> : this.props.children;
    }
}
