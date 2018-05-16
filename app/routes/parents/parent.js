import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service('store'),

  model({ parent_id }) {
    return this.store.findRecord('parent', parent_id);
  },

  afterModel(parent) {
    return parent.get('meetings');
  }
});
