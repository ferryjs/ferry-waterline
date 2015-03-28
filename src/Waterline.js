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

  find(model, query, callback) {
    this.getModel(model).find(query).exec(function(error, resources) {
      if (error) throw error;
      callback(resources);
    });
  }

  // @todo Does this method serve any real purpose?
  findOne(model, query, callback) {
    this.getModel(model).findOne(query).exec(function(error, resource) {
      if (error) throw error;
      callback(resource);
    });
  }

  // @todo Allow customizing ID parameter name.
  findById(model, id, callback) {
    this.getModel(model).findOne({ id: id }).exec(function(error, resource) {
      if (error) throw error;
      callback(resource);
    });
  }

  create(model, properties, callback) {
    this.getModel(model).create(properties).exec(function(error, resource) {
      if (error) throw error;
      callback(resource);
    });
  }

  update(model, id, properties, callback) {
    // Don't pass ID in updated properties.
    delete properties.id;
    this.getModel(model).update({ id: id }, properties).exec(function(error, resource) {
      if (error) throw error;
      callback(resource);
    });
  }

  destroy(model, id, callback) {
    this.getModel(model).destroy({ id: id }).exec(function(error) {
      if (error) throw error;
      callback();
    });
  }

}

export default WaterlineAdapter;
