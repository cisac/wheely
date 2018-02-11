import React from 'react';
import PropTypes from 'prop-types';
import Slider from './slider';
import CarouselControls from './carousel-controls';

function CarouselStateHOC(Controls) {
  class Carousel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        index: 0
      };
      this.animating = false;
    }

    componentDidMount() {
      const { autoplay, autoplayTimeout } = this.props;
      if (autoplay) {
        this.autoplayTimer = setInterval(() => this.next(), autoplayTimeout);
      }
      this.setState({ index: 0, speed: 0 });
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
        this.setState({ index: index % length, speed: 0 });
      }
    };

    updateIndex = newIndex => {
      const { infinite, speed } = this.props;
      const { children } = this.props;
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

      this.setState({ index, speed });
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
      const { children, vertical } = this.props;
      const { index, speed } = this.state;

      return (
        <Controls vertical={vertical} previous={this.previous} next={this.next}>
          <Slider
            index={index}
            speed={speed}
            handleTransitionEnd={this.handleTransitionEnd}
            {...this.props}
          >
            {children}
          </Slider>
        </Controls>
      );
    }
  }

  Carousel.propTypes = {
    slidesToScroll: PropTypes.number,
    infinite: PropTypes.bool,
    variableSize: PropTypes.bool.isRequired,
    speed: PropTypes.number.isRequired,
    autoplay: PropTypes.bool,
    autoplayTimeout: PropTypes.number,
    vertical: PropTypes.bool
  };

  Carousel.defaultProps = {
    slidesToScroll: 1,
    infinite: true,
    variableSize: false,
    speed: 300,
    autoplayTimeout: 3000,
    vertical: false
  };

  return Carousel;
}

export default CarouselStateHOC;
