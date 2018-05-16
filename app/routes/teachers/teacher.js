import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service('store'),

  model({ teacher_id }) {
    return this.get('store').findRecord('teacher', teacher_id);
  },

  afterModel(teacher) {
    return teacher.get('classGroups');
  }
});
