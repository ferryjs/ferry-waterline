'use strict';

import Storage from 'ferry/lib/Storage';

class Waterline extends Storage {

  constructor(adapter) {

    if (typeof adapter === 'undefined') {
      adapter = require('./diskAdapter');
    }

    console.log(adapter)

  }

};

export default Waterline;
