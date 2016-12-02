# Ember Engines Migration Tutorial
Follow the steps below to complete this tutorial about migrating your app into some engines.  
Checkout the **[live coding session](https://www.youtube.com/watch?v=JsbtTk-rMRU&t=13m20s)** on **17 November 2016** @ ShowMyHomework headquarters.

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)

### Installation

* clone this repository: `git clone https://github.com/mysencare/smhw-ember-engines-demo.git`
* `cd smhw-ember-engines-demo`
* `npm install`
* `bower install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

**Now you are all set to start this tutorial** 🎉

### Preparations
[Install latest Ember-engines](https://github.com/dgeb/ember-engines) ([Beta version](https://github.com/dgeb/ember-engines/releases) to allow lazy loading) `$ ember install ember-engines@0.4.0-beta.4`

## Tutorial steps:
Lets start with running the app: `$ ember s` and have a browse through the small 'Blog' app.
We will start with the teachers engine.

- Generate the parents engine: `$ ember g in-repo-engine teachers-engine`
- Restart your server: `$ ember s`
- Rewrite `app/router.js`:
  - Copy line 11 to line 13 and paste it in `lib/teachers-engine/addon/routes.js`.
  ```js
    this.route('teacher', { path: '/:teacher_id' }, function() {
      this.route('class', { path: '/class/:class_group_id' });
    });
  ```
  - Now remove line 10 to 14.
  - You will notice a line added `this.mount('teachers-engine');` if not, add it.
  - We will alias the mounted route like this `this.mount('teachers-engine', { as: 'teachers'});`.
- Copy the content of `app/templates/teachers.hbs` and paste it in `lib/teachers-engine/addon/templates/application.hbs`, overriding the current content.
- Delete `app/templates/teachers.hbs`.
- Move all files in `app/templates/teachers` to `lib/teachers-engine/addon/templates`.
- Delete this folder `app/templates/teachers`.
- Move the routes folder `app/routes/teachers` to the new engine's `addon` folder and rename the folder from `teachers` to `routes` and delete the original folder.
- Now when you try to go into the teachers section of the 'blog', you will see an error, something like:
  `Error while processing route: teachers.index this.store.findAll is not a function TypeError: this.store.findAll is not a function`
- This error appears because we are using the `store` in the engine and it has no notice of this. To resolve this, we need to pass the service to the engine.
  - The engine should expect the service, in `engine.js`, add the following inside `Engine.extend({})`

    `lib/teachers-engine/addon/engine.js`
    ```js
    dependencies: {
      services: ['store']
    }
    ```
  - The application should explicitly fulfil these dependencies, in `app.js`, add the following inside `Ember.Application.extend({})`

    `app/app.js`
    ```js
    engines: {
      teachersEngine: {
        dependencies: {
          services: ['store']
        }
      }
    }
    ```
- Restart the server.
- Now the service is available, but there is still an error, because we need to inject the store in places where we need to use it:

  `lib/teachers-engine/addon/routes/teacher/index.js`
  ```js
  import Ember from 'ember';

  const { inject: { service } } = Ember;

  export default Ember.Route.extend({
    store: service(),

    model() {
      // use store as this.get('store')
      return this.get('store').findAll('teacher');
    }
  });
  ```
  - Do the same for `lib/teachers-engine/addon/routes/teachers/teacher.js` and `lib/teachers-engine/addon/routes/teachers/teacher/class.js`
- Now you will receive an error, because the addon `ember-power-select` is used in the engine but not specified
- Copy the addon dependency to the `lib/parents/package.json` from the engine and restart the server:

  `lib/teachers-engine/package.json`
  ```json
    {
      "name": "teachers-engine",
      "keywords": [
        "ember-addon",
        "ember-engine"
      ],
      "dependencies": {
        "ember-cli-htmlbars": "*",
        "ember-power-select": "1.0.0-beta.29"
      }
    }
  ```
- The next error will be regarding links, as the routes have changed, we need to replace the links pointing to those as well, replace `{{#link-to 'teachers.teacher' ...` with `{{#link-to 'teacher' ...` as `teachers` is now the route of the engine.
- Now the errors are resolved, you should notice that the dropdown is there, but its empty.
- Move the controllers folder `app/controllers/teachers` to the new engine's `addon` folder and rename the folder from `teachers` to `controllers` and delete the original folder.
- Now the teachers page should fully working and the dropdown is filled.
- Repeat these steps for Students and Parents sections.

- When all your engines are setup, you will notice that when you go to [/parents](http://localhost:4200/parents) and try to click **Show meetings**, you will have an error (http://localhost:4200/parents/1).
- We are linking from the engine to the route outside the engine. `You attempted to define a `{{link-to "parents.teacher"}}` but did not pass the parameters...`
  - We need to make the main `app.js` know what routes are available for each engine. We do that by aliasing the `externalRoutes` per engine:

    `app.js`
    ```js
      parentsEngine: {
        dependencies: {
          services: ['store'],
          externalRoutes: {
            'teacher-details': 'teachers.teacher',
            'teacher-details.class': 'teachers.teacher.class'
          }
        }
      }
    ```
  - We need to make the engines aware of the routes as well:

    `lib/parents-engine/addon/engine.js`
    ```js
      dependencies: {
        services: ['store'],
        externalRoutes: [
          'teacher-details',
          'teacher-details.class'
        ]
      }
    ```
  - We need to replace the `{{link-to}}` helper with `{{link-to-external}}` whenever you will link to an external route.

    `lib/parents-engine/addon/templates/parent.hbs`
    ```hbs
      <div class="boxes-list">
        {{#each model.meetings as |meeting|}}
          <div class="boxes-list-item red-box">
            <strong>{{meeting.name}}</strong> with
            <strong>
              {{#link-to-extrenal 'teacher' meeting.teacher}}{{meeting.teacher.name}}{{/link-to-extrenal}}
            </strong>
            at
            <strong>
              {{#link-to-extrenal 'teacher.class' meeting.teacher meeting.classGroup}}{{meeting.classGroup.name}}{{/link-to-extrenal}}
            </strong>
          </div>
        {{/each}}
      </div>
    ```
  - Now the page should load fine and you can navigate to the teacher or the class from the parents engine.
- Last step, make the engines load lazy.
- Per engine we will need to enable the **lazy** flag `lazyEnabled: true` in the engines `index.js`:

  `lib/parents-engine/index.js`
  ```js
    /*jshint node:true*/
    var EngineAddon = require('ember-engines/lib/engine-addon');
    module.exports = EngineAddon.extend({
      name: 'parents-engine',
      lazyLoading: true,

      isDevelopingAddon: function() {
        return true;
      }
    });
  ```
- Go in the browser to the index page [http://localhost:4200](http://localhost:4200).
- Restart the server
- Open the inspector and on network, filter by `JS` and now, when you navigate to the teacher, parents or students part of the site, you will see that you load those parts on demand.
- That's it folks!
