import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>Something went wrong.</Alert.Heading>
                <p>
                    {this.state.error && this.state.error.toString()}
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={this.handleReload} variant="outline-danger">
                        Reload Page
                    </Button>
                </div>
            </Alert>
            <details className="error-details">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
