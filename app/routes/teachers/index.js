import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let data = { postType: 'teacher' };
    return this.store.query('blog-post', data);
  }
});
