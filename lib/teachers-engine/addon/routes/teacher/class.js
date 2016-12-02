import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  store: service(),

  model({ class_group_id }) {
    return this.get('store').findRecord('class-group', class_group_id);
  }
});
