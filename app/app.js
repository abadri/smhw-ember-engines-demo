import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  engines: {
    teachersEngine: {
      dependencies: {
        services: ['store']
      }
    },
    parentsEngine: {
      dependencies: {
        services: ['store'],
        externalRoutes: {
          'teacher-details': 'teachers.teacher',
          'teacher-details.class': 'teachers.teacher.class'
        }
      }
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
