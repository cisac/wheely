import React, { Component } from 'react';
import { render } from 'react-dom';

import Carousel from './Carousel';
import SingleItem from './SingleItem';
import MultipleItems from './MultipleItems';
import VariableWidth from './VariableWidth';
import Vertical from './Vertical';
import './index.css';

class Demo extends Component {
  render() {
    return (
      <div style={{ margin: '20px' }}>
        <h2>Carousel demo</h2>
        <div
          style={{
            width: '90%',
            margin: '5px 5%',
          }}
        >
          <SingleItem name={'Single item'} />
          <MultipleItems name={'Multiple items infinite'} pageLength={3} />
          <MultipleItems
            name={'Multiple items'}
            infinite={false}
            pageLength={4}
          />
          <MultipleItems name={'Autoplay'} autoplay={true} pageLength={4} />
          <VariableWidth
            name={'Variable width'}
            pageLength={4}
            infinite={false}
          />
          <VariableWidth name={'Variable width infinite'} pageLength={4} />
          <Vertical name={'Vertical'} pageLength={4} />

          <h4>Vertical variable size</h4>
          <div style={{ border: '1px solid #00558B' }}>
            <Carousel vertical={true} variableWidth={true} pageLength={4}>
              <SingleItem />
              <MultipleItems pageLength={3} />
              <MultipleItems infinite={false} pageLength={4} />
              <MultipleItems autoplay={true} pageLength={4} />
              <VariableWidth pageLength={4} infinite={false} />
              <VariableWidth pageLength={4} />
              <Vertical pageLength={4} />
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
