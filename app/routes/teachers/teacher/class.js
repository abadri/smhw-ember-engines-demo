import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service('store'),

  model({ class_group_id }) {
    return this.get('store').findRecord('class-group', class_group_id);
  }
});
