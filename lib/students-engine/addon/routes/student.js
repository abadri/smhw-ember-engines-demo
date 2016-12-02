import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  store: service(),

  model({ student_id }) {
    return this.get('store').findRecord('student', student_id);
  },

  afterModel(student) {
    return student.get('homeworks');
  }
});
