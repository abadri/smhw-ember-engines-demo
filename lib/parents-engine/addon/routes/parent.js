import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  store: service(),

  model({ parent_id }) {
    return this.get('store').findRecord('parent', parent_id);
  },

  afterModel(parent) {
    return parent.get('meetings');
  }
});
