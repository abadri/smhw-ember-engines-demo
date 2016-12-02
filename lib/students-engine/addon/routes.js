import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('student', { path: '/:student_id' });
});
