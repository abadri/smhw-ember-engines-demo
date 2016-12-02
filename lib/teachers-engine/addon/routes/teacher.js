import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  store: service(),

  model({ teacher_id }) {
    return this.get('store').findRecord('teacher', teacher_id);
  },

  afterModel(teacher) {
    return teacher.get('classGroups');
  }
});
