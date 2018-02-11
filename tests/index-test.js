import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Carousel from 'src/';

const CarouselTest = () => {
  const settings = {
    pageLength: 1,
    infinite: true,
  };

  return (
    <Carousel {...settings}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </Carousel>
  );
};

describe('Carousel', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('render without crashing', () => {
    // TODO: fix warning - using React.Fragment prints warning
    render(<CarouselTest />, node);
  });
});
