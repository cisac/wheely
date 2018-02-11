import React from 'react';
import Carousel, { CarouselStateHOC } from '../../src';

class CarouselControls extends React.Component {
  handleKeyPress = event => {
    const { previous, next, vertical } = this.props;
    if (vertical) {
      switch (event.key) {
        case 'ArrowUp':
          previous();
          event.preventDefault();
          break;
        case 'ArrowDown':
          next();
          event.preventDefault();
          break;
        default:
      }
    } else {
      switch (event.key) {
        case 'ArrowLeft':
          previous();
          event.preventDefault();
          break;
        case 'ArrowRight':
          next();
          event.preventDefault();
          break;
        default:
      }
    }
  };

  render() {
    const { previous, next, vertical, children } = this.props;

    const btnClasses = {
      previous: vertical ? 'slider-up' : 'slider-prev',
      next: vertical ? 'slider-down' : 'slider-next'
    };

    return (
      <div
        className="carouselWrapper"
        tabIndex="0"
        onKeyDown={e => {
          this.handleKeyPress(e);
        }}
      >
        {children}
        <div className={`slider-btn ${btnClasses.previous}`} onClick={previous}>
          <i className={btnClasses.previous} />
        </div>
        <div className={`slider-btn ${btnClasses.next}`} onClick={next}>
          <i className={btnClasses.next} />
        </div>
      </div>
    );
  }
}

const CarouselWithKeys = CarouselStateHOC(CarouselControls);

export { CarouselWithKeys };
export default Carousel;
