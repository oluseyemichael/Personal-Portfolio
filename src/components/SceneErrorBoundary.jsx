import { Component } from 'react';
import { MobileFallback } from './MobileFallback.jsx';

/**
 * WebGL/R3F rendering is inconsistent across browsers and GPU drivers.
 * If the 3D scene throws, fall back to the 2D experience instead of
 * leaving the visitor with a blank screen.
 */
export class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('3D scene crashed, falling back to 2D experience:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <MobileFallback />;
    }
    return this.props.children;
  }
}
