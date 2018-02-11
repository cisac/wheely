import React, { Component } from 'react';

class Slide extends Component {
  render() {
    const {
      children,
      className,
      slideStyle,
      addRef,
      slides,
      idx,
      dataIndex
    } = this.props;

    return (
      <div
        tabIndex={-1}
        className={className}
        style={slideStyle}
        data-index={dataIndex}
        ref={comp => (addRef ? (slides[idx] = comp) : null)}
      >
        {children}
      </div>
    );
  }
}

export default Slide;
