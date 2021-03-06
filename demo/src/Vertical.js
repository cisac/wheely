import React from 'react';
import Carousel from './Carousel';

const Vertical = ({ name, ...props }) => {
  return (
    <div>
      {name ? <h4>{name}</h4> : null}
      <Carousel {...props} vertical={true}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className="tile">
            {item}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Vertical;
