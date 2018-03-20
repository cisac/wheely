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
  highlightSelection,
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
  highlightSelection,
}) => {
  const view = makeSlides({
    children: childrenElements,
    key: val => val,
    slideStyle: sx.slide,
    addRef: addRef,
    slides: slides,
    index,
    updateSize,
    highlightSelection,
  });
  const prefix = !infinite
    ? null
    : makeSlides({
        children: childrenElements.slice(-added),
        key: val => val - added,
        slideStyle: sx.slide,
        index,
        highlightSelection,
      });
  const sufix = !infinite
    ? null
    : makeSlides({
        children: childrenElements.slice(0, added),
        key: val => length + val,
        slideStyle: sx.slide,
        index,
        highlightSelection,
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

    if (this.slider) {
      this.trackParent = this.track.parentNode;

      this.ro.observe(this.slider);
      this.ro.observe(this.trackParent);
    }

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
    const { resizeObserver = w => {} } = this.props;

    let sliderWidth = 0;
    for (const entry of entries) {
      const { width } = entry.contentRect;

      if (entry.target === this.slider) {
        sliderWidth = width;
      }
    }

    if (sliderWidth) {
      this.forceUpdate(() => resizeObserver(sliderWidth));
    } else {
      this.forceUpdate();
    }
  };

  handleTransitionEnd = e => {
    const { handleTransitionEnd } = this.props;
    if (handleTransitionEnd instanceof Function) {
      handleTransitionEnd(e);
    }
  };

  getVariableSizes() {
    const {
      children,
      index,
      infinite,
      vertical,
      selectedSlideOffset,
    } = this.props;
    const length = children.length;
    const added = length; // TODO: should depend on slide size (width, height)

    let prefixSize = 0;
    if (infinite) {
      prefixSize = this.slides
        .slice(-added)
        .reduce(
          (currentSum, slide) => currentSum - getSize(vertical, slide),
          0
        );
    }

    const trackOffset =
      getSize(vertical, this.trackParent) * selectedSlideOffset;

    const totalSize = this.slides.reduce(
      (currentSum, slide) => currentSum + getSize(vertical, slide),
      0
    );

    prefixSize = prefixSize + trackOffset;

    const indexes =
      index >= 0
        ? makeIndexes(length).slice(0, index) // [0,1,... index]
        : makeIndexes(length).slice(index); // [index, index+1, ...length-1]

    let offset = indexes
      .map(idx => getSize(vertical, this.slides[idx]))
      .reduce((acc, current) => acc + current, 0);

    offset = index < 0 ? prefixSize + offset : prefixSize - offset;

    const slideSize = this.slides ? getSize(vertical, this.slides[index]) : 0;
    return {
      offset,
      trackSize: totalSize ? `${totalSize + trackOffset}px` : '100%',
      sliderSize: '100%',
      slideSize,
      trackOffset,
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

    const trackOffset =
      pageLength > 1 && selectedSlideOffset
        ? slideSize * pageLength * selectedSlideOffset //- slideSize / 2
        : 0;

    const offset =
      -index * slideSize - (infinite ? slideSize * length : 0) + trackOffset;

    const slideHeight = getSize(vertical, this.slides[0]);
    const trackHeight = slideHeight ? slideHeight * pageLength + 'px' : '100%';

    return {
      offset,
      trackSize: vertical ? trackHeight : '100%',
      sliderSize: sliderSize + '%',
      slideSize,
      trackOffset,
    };
  }

  getStyles() {
    const { speed, variableSize, vertical, styleSelected } = this.props;

    const {
      offset,
      trackSize,
      sliderSize,
      slideSize,
      trackOffset,
    } = variableSize ? this.getVariableSizes() : this.getFixedSizes();

    const sx = cssSlider({
      speed,
      offset: offset + (variableSize ? 'px' : '%'),
      trackSize,
      sliderSize,
      flexItemStyle: variableSize ? 'none' : '1',
      styleSelected,
      vertical,
    });
    return { sx, offset, slideSize, trackOffset };
  }

  getChildren(sx) {
    const { children, index, infinite, highlightSelection } = this.props;
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
      highlightSelection,
    });
  }

  getHighlighter({ slideSize, trackOffset }) {
    const {
      vertical,
      variableSize,
      highlightSelection,
      selectedSlideOffset,
      pageLength,
    } = this.props;

    if (!highlightSelection) {
      return null;
    }

    const fixedWidth = 100 / pageLength;
    const varWidth = slideSize;

    const parentSize = getSize(vertical, this.trackParent);

    const right =
      parentSize * selectedSlideOffset +
      (variableSize ? varWidth : parentSize / pageLength);

    const style = {
      position: 'absolute',
      border: '2px solid',
      width: variableSize ? varWidth + 'px' : fixedWidth + '%',
      height: '100%',
      left: 100 * selectedSlideOffset + '%',
      zIndex: 100,
    };

    return (
      <Fragment>
        <div
          className="slide-selector-top"
          style={{ ...style, ...{ height: 0 } }}
        />
        <div
          className="slide-selector-bottom"
          style={{ ...style, ...{ height: 0, bottom: 0 } }}
        />
        <div
          className="slide-selector-left"
          style={{ ...style, ...{ width: 0 } }}
        />
        <div
          className="slide-selector-right"
          style={{ ...style, ...{ width: 0, left: right + 'px' } }}
        />
      </Fragment>
    );
  }

  render() {
    const { sx, slideSize, trackOffset } = this.getStyles();
    return (
      <Fragment>
        <div
          className="carousel-track"
          style={sx.track}
          ref={comp => (this.track = comp)}
        >
          {this.getHighlighter({ slideSize, trackOffset })}
          <div
            className="carousel-slider"
            style={sx.slider}
            ref={comp => (this.slider = comp)}
          >
            {this.getChildren(sx)}
          </div>
        </div>
      </Fragment>
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
  highlightSelection: PropTypes.bool,
};

Slider.defaultProps = {
  index: 0,
  selectedSlideOffset: 0,
  infinite: true,
  speed: 300,
  vertical: false,
  highlightSelection: false,
};

export default Slider;
