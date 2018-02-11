import React from 'react';
import { CarouselWithKeys } from './Carousel';

const SingleItem = ({ name }) => {
  const settings = {
    pageLength: 1,
    infinite: true
  };

  return (
    <div>
      {name ? <h4>{name}</h4> : null}
      <CarouselWithKeys {...settings}>
        <div className="tile">1</div>
        <div className="tile">2</div>
        <div className="tile">3</div>
      </CarouselWithKeys>
    </div>
  );
};

export default SingleItem;
