import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('parent', { path: '/:parent_id' });
});
