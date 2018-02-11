# Wheely

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

React carousel component.

Install
-
`npm install`

Usage
-
`npm start`

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

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
