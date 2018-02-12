import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import Slide from './slide';
import { cssSlider } from './utils';

const makeIndexes = n => Array.from(Array(Math.abs(n)), (v, i) => i);

const getSize = (vertical, element) => {
  return element == null
    ? 0
    : vertical ? element.clientHeight : element.clientWidth;
};

const makeSlides = ({
  children,
  key,
  slideStyle,
  addRef,
  slides,
  index,
  updateSize,
}) => {
  return children.map((child, i) => (
    <Slide
      key={key(i)}
      className={`slide ${index === key(i) ? 'slide-active' : ''}`}
      slideStyle={slideStyle}
      addRef={addRef}
      slides={slides}
      idx={i}
      dataIndex={`${key(i)}`}
      updateSize={updateSize}
    >
      {React.cloneElement(child, { 'data-active': index === key(i) })}
    </Slide>
  ));
};

const getSliderChildren = ({
  childrenElements,
  infinite,
  sx,
  length,
  added,
  addRef,
  slides,
  index,
  updateSize,
}) => {
  const view = makeSlides({
    children: childrenElements,
    key: val => val,
    slideStyle: sx.slide,
    addRef: addRef,
    slides: slides,
    index,
    updateSize,
  });
  const prefix = !infinite
    ? null
    : makeSlides({
        children: childrenElements.slice(-added),
        key: val => val - added,
        slideStyle: sx.slide,
        index,
      });
  const sufix = !infinite
    ? null
    : makeSlides({
        children: childrenElements.slice(0, added),
        key: val => length + val,
        slideStyle: sx.slide,
        index,
      });

  return (
    <Fragment>
      {prefix}
      {view}
      {sufix}
    </Fragment>
  );
};

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.slides = [];
  }

  componentDidMount() {
    if (this.slider) {
      this.slider.addEventListener(
        'transitionend',
        this.handleTransitionEnd,
        false
      );
    }

    this.ro = new ResizeObserver(this.resizeObserverCb);

    this.ro.observe(this.slider);
    this.slides.forEach(slide => this.ro.observe(slide));
  }

  componentWillUnmount() {
    if (this.slider) {
      this.slider.removeEventListener(
        'transitionend',
        this.handleTransitionEnd,
        false
      );
    }

    this.ro.disconnect();
  }

  resizeObserverCb = (entries, observer) => {
    this.forceUpdate();
  };

  handleTransitionEnd = e => {
    const { handleTransitionEnd } = this.props;
    if (handleTransitionEnd) {
      handleTransitionEnd(e);
    }
  };

  getVariableSizes() {
    const { children, index, infinite, vertical } = this.props;
    const length = children.length;
    const added = length; // TODO: should depend on slide size (width, height)

    const totalSize = this.slides.reduce(
      (currentSum, slide) => currentSum + getSize(vertical, slide),
      0
    );

    const prefixSize = !infinite
      ? 0
      : this.slides
          .slice(-added)
          .reduce(
            (currentSum, slide) => currentSum - getSize(vertical, slide),
            0
          );

    const indexes =
      index >= 0
        ? makeIndexes(length).slice(0, index) // [0,1,... index]
        : makeIndexes(length).slice(index); // [index, index+1, ...length-1]

    let offset = indexes
      .map(idx => getSize(vertical, this.slides[idx]))
      .reduce((acc, current) => acc + current, 0);

    offset = index < 0 ? prefixSize + offset : prefixSize - offset;

    return {
      offset,
      trackSize: totalSize ? `${totalSize}px` : '100%',
      sliderSize: '100%',
      slideSize: null,
    };
  }

  getFixedSizes() {
    const {
      children,
      index,
      pageLength,
      infinite,
      vertical,
      selectedSlideOffset,
    } = this.props;

    const length = children.length;
    const added = length; // TODO: should depend on slide size (width || height)

    const sliderSize = (infinite ? 300 : 100) * length / pageLength;

    const slideSize = 100 / (infinite ? length + 2 * added : length);

    const startOffset =
      infinite && pageLength > 1 && selectedSlideOffset
        ? slideSize * pageLength * selectedSlideOffset - slideSize / 2
        : 0;

    const offset =
      -index * slideSize - (infinite ? slideSize * length : 0) + startOffset;

    const slideHeight = getSize(vertical, this.slides[0]);
    const trackHeight = slideHeight ? slideHeight * pageLength + 'px' : '100%';

    return {
      offset,
      trackSize: vertical ? trackHeight : '100%',
      sliderSize: sliderSize + '%',
      slideSize,
    };
  }

  getStyles() {
    const { speed, variableSize, vertical } = this.props;

    const { offset, trackSize, sliderSize, slideSize } = variableSize
      ? this.getVariableSizes()
      : this.getFixedSizes();

    const sx = cssSlider({
      speed,
      offset: offset + (variableSize ? 'px' : '%'),
      trackSize,
      sliderSize,
      slideSize,
      flexItemStyle: variableSize ? 'none' : 'auto',
      vertical,
    });
    return sx;
  }

  getChildren(sx) {
    const { children, index, infinite } = this.props;
    const length = children.length;
    const added = length; // TODO: should depend on slide size (width || height)

    const childrenElements = React.Children.toArray(children);

    return getSliderChildren({
      childrenElements,
      infinite,
      sx,
      length,
      added,
      index,
      addRef: true,
      slides: this.slides,
    });
  }

  render() {
    const sx = this.getStyles();

    return (
      <div className="carousel-track" style={sx.track}>
        <div
          className="carousel-slider"
          style={sx.slider}
          ref={comp => (this.slider = comp)}
        >
          {this.getChildren(sx)}
        </div>
      </div>
    );
  }
}

Slider.propTypes = {
  index: PropTypes.number.isRequired,
  selectedSlideOffset: PropTypes.number,
  infinite: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  vertical: PropTypes.bool,
  handleTransitionEnd: PropTypes.func.isRequired,
};

Slider.defaultProps = {
  index: 0,
  selectedSlideOffset: 0,
  infinite: true,
  speed: 300,
  vertical: false,
};

export default Slider;
