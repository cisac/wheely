import React from 'react';
import Carousel from './Carousel';

const widths = [250, 300, 150, 400];

const VariableWidth = ({ name, ...props }) => {
  return (
    <div>
      {name ? <h4>{name}</h4> : null}
      <Carousel {...props} variableSize={true}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div
            key={idx}
            className="tile"
            style={{
              width: widths[idx % widths.length]
            }}
          >
            {widths[idx % widths.length]}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default VariableWidth;
