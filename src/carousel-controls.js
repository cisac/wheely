import React from 'react';

const sxCarouselWrapper = {
  position: 'relative',
  overflow: 'hidden',
  outline: 'none',
  width: '100%',
  // height: '100%',
};

const sxNav = {
  position: 'absolute',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: '40px',

  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: '#00558B',
  opacity: '.3',
};

const sliderPrev = {
  left: 0,
  top: 0,
  bottom: 0,
};

const sliderNext = {
  right: 0,
  top: 0,
  bottom: 0,
};

const sliderUp = {
  top: '0px',
  height: '20px',
  width: '100%',
};

const sliderDown = {
  bottom: '0px',
  height: '20px',
  width: '100%',
};

const sliderBtnI = {
  border: 'solid black',
  borderWidth: '0 3px 3px 0',
  padding: '3px',
};

const sliderBtnIprev = {
  transform: 'rotate(135deg)',
  // -webkit-transform: rotate(135deg),
};

const sliderBtnInext = {
  transform: 'rotate(-45deg)',
  // -webkit-transform: rotate(-45deg),
};

const sliderBtnIup = {
  transform: 'rotate(-135deg)',
  // -webkit-transform: rotate(-135deg),
};

const sliderBtnIdown = {
  transform: 'rotate(45deg)',
  // -webkit-transform: rotate(45deg),
};

const NavButton = ({ onClickHandler, classes }) => {
  let divStyle = sxNav;
  let iStyle = sliderBtnI;

  if (classes === 'slider-up') {
    divStyle = { ...{ ...sxNav }, ...{ ...sliderUp } };
    iStyle = { ...{ ...sliderBtnI }, ...{ ...sliderBtnIup } };
  } else if (classes === 'slider-prev') {
    divStyle = { ...{ ...sxNav }, ...{ ...sliderPrev } };
    iStyle = { ...{ ...sliderBtnI }, ...{ ...sliderBtnIprev } };
  } else if (classes === 'slider-next') {
    divStyle = { ...{ ...sxNav }, ...{ ...sliderNext } };
    iStyle = { ...{ ...sliderBtnI }, ...{ ...sliderBtnInext } };
  } else if (classes === 'slider-down') {
    divStyle = { ...{ ...sxNav }, ...{ ...sliderDown } };
    iStyle = { ...{ ...sliderBtnI }, ...{ ...sliderBtnIdown } };
  }

  return (
    <div style={divStyle} onClick={onClickHandler}>
      <i style={iStyle} />
    </div>
  );
};

class CarouselControls extends React.Component {
  handleKeyPress = event => {
    const { previous, next } = this.props;
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
  };

  componentWillReceiveProps(nextProps) {
    const { setfocus } = nextProps;
    if (setfocus) {
      this.comp.focus();
    }
  }

  render() {
    const { previous, next, vertical, children } = this.props;

    const btnClasses = {
      previous: vertical ? 'slider-up' : 'slider-prev',
      next: vertical ? 'slider-down' : 'slider-next',
    };

    return (
      <div
        className="carouselWrapper"
        style={sxCarouselWrapper}
        // tabIndex="0"
        onKeyDown={e => {
          this.handleKeyPress(e);
        }}
        ref={comp => (this.comp = comp)}
      >
        {children}
        <NavButton onClickHandler={previous} classes={btnClasses.previous} />
        <NavButton onClickHandler={next} classes={btnClasses.next} />
      </div>
    );
  }
}

export default CarouselControls;
