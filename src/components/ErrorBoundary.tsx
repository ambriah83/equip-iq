import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    // Clear all state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Clear storage to prevent persistent errors
    try {
      sessionStorage.clear();
      // Navigate to home
      window.location.href = '/';
    } catch (e) {
      // Force reload as last resort
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We encountered an unexpected error. The error has been logged and we'll look into it.
              </p>
              
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm font-semibold text-red-800">Error Details:</p>
                  <p className="text-sm text-red-700 mt-1 font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Show technical details (development only)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-4">
                <Button onClick={this.handleReset}>
                  Reload Page
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}