var myApp = angular.module('socialEventPlanner');

myApp.directive('fileUpload', function () {
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, el) {
      el.bind('change', function (event) {
        var files = event.target.files;
        for (var i = 0; i < files.length; i++) {
          scope.$emit('fileSelected', { file: files[i] });
        }
      });
    }
  };
});
