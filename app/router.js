import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.mount('teachers-engine', { as: 'teachers' });
  this.mount('parents-engine', { as: 'parents' });
  this.mount('students-engine', { as: 'students' });
});

export default Router;
