const cssSlider = ({
  speed,
  offset,
  trackSize,
  sliderSize,
  infinite,
  flexItemStyle,
  styleSelected,
  vertical,
}) => {
  const track = { overflow: 'hidden' };

  const slider = {
    display: 'flex',
    // alignItems: 'center',
    flexDirection: vertical ? 'column' : 'row',

    transition: `transform ${speed}ms ease-out`,
    transform: `translate3D(${vertical ? 0 : offset},${
      vertical ? offset : 0
    },0)`,
  };

  if (!vertical) {
    track.width = `${trackSize}`;
    slider.width = `${sliderSize}`;
  } else {
    track.height = `${trackSize}`;
    slider.height = `${sliderSize}`;
  }

  const slide = {
    ...styleSelected,
    ...{ flex: `${flexItemStyle}`, outline: 'none' },
  };

  return {
    track,
    slider,
    slide,
  };
};

export { cssSlider };
