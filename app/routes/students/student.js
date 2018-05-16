import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service('store'),

  model({ student_id }) {
    return this.get('store').findRecord('student', student_id);
  },

  afterModel(student) {
    return student.get('homeworks');
  }
});
