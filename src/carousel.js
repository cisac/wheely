import React from 'react';
import PropTypes from 'prop-types';
import Slider from './slider';

function CarouselStateHOC(Controls) {
  class Carousel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        index: 0,
      };
      this.animating = false;
    }

    updateState({ index, speed }) {
      const { updateIndexCb } = this.props;
      const { children } = this.props;
      const length = children.length;

      this.setState(
        { index, speed },
        updateIndexCb(index >= 0 ? index : length + index)
      );
    }

    componentDidMount() {
      const { startIndex, autoplay, autoplayTimeout } = this.props;
      if (autoplay) {
        this.autoplayTimer = setInterval(() => this.next(), autoplayTimeout);
      }
      this.updateState({ index: startIndex, speed: 0 });
    }

    componentWillUnmount() {
      const { autoplay } = this.props;
      if (autoplay) {
        clearInterval(this.autoplayTimer);
      }
    }

    handleTransitionEnd = () => {
      const { index } = this.state;
      const { children } = this.props;
      const length = children.length;

      this.animating = false;
      if (Math.abs(index) >= length) {
        this.updateState({ index: index % length, speed: 0 });
      }
    };

    updateIndex = newIndex => {
      const { infinite, speed, children } = this.props;
      const length = children.length;

      if (this.animating) {
        return;
      }

      let index = newIndex;
      if (!infinite) {
        if (index >= length || index < 0) {
          return;
        }
      }

      this.updateState({ index, speed });
      this.animating = true;
    };

    previous = () => {
      const { slidesToScroll } = this.props;
      this.updateIndex(this.state.index - slidesToScroll);
    };

    next = () => {
      const { slidesToScroll } = this.props;
      this.updateIndex(this.state.index + slidesToScroll);
    };

    render() {
      const { children, vertical, setfocus } = this.props;
      const { index, speed } = this.state;

      return (
        <Controls
          vertical={vertical}
          previous={this.previous}
          next={this.next}
          setfocus={setfocus}
        >
          <Slider
            {...this.props}
            index={index}
            speed={speed}
            handleTransitionEnd={this.handleTransitionEnd}
          >
            {children}
          </Slider>
        </Controls>
      );
    }
  }

  Carousel.propTypes = {
    startIndex: PropTypes.number,
    slidesToScroll: PropTypes.number,
    infinite: PropTypes.bool,
    variableSize: PropTypes.bool.isRequired,
    speed: PropTypes.number.isRequired,
    autoplay: PropTypes.bool,
    autoplayTimeout: PropTypes.number,
    vertical: PropTypes.bool,
    updateIndexCb: PropTypes.func,
  };

  Carousel.defaultProps = {
    startIndex: 0,
    slidesToScroll: 1,
    infinite: true,
    variableSize: false,
    speed: 300,
    autoplayTimeout: 3000,
    vertical: false,
    updateIndexCb: () => null,
  };

  return Carousel;
}

export default CarouselStateHOC;
