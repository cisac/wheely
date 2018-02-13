# Wheely

[![Build Status](https://travis-ci.org/cisac/wheely.svg?branch=master)](https://travis-ci.org/cisac/wheely)
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

React carousel component.

Install
-
`npm install wheely --save`

Example usage
-------------

```js
import React from 'react';
import Carousel from 'wheely';

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
```

Contributing
-
Thank you for considering contributing!
Please use GitHub issues and Pull Requests for Contributing.

License
-
The MIT License (MIT). Please see License File for more information.

Todo
-
- [ ] Write tests

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/wheely

[coveralls-badge]: https://img.shields.io/coveralls/cisac/wheely/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/cisac/wheely
