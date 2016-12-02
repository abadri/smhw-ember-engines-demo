import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  this.route('teacher', { path: '/:teacher_id' }, function() {
    this.route('class', { path: '/class/:class_group_id' });
  });
});
