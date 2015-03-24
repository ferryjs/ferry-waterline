'use strict';

import {Storage} from 'ferry';

import Waterline from 'waterline';

class WaterlineAdapter extends Storage {

  constructor(config) {

    if (typeof config === 'undefined') {
      config = require('./diskAdapter');
    }

    this.config = config;

    this.engine = new Waterline();

  }

  initialize(resources, callback) {

    let self = this;

    for (let resource in resources) {

      // @todo Copy from resource object? Probably need converters.
      let schema = resources[resource].schema || {};

      schema.identity = resource.toLowerCase();

      // @todo This should be customisable.
      schema.connection = 'default';

      // Load the resource into Waterline.
      this.engine.loadCollection(Waterline.Collection.extend(schema));

    }

    this.engine.initialize(this.config, function(error, details) {

      // Store the initialized Waterline models.
      self.models = details.collections;

      // Store the Waterline connections.
      self.connections = details.connections;

      if (typeof callback === 'function') {
        callback(error);
      }

    });

  }

};

export default WaterlineAdapter;
