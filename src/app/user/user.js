angular.module("user",[])
.controller("UserCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  $scope.languages = $window.BiLanguage.available();

  $scope.validatePersonalization = function(installationData) {
    $rootScope.personalizationError = false;
    if (
      installationData.hostname &&
      installationData.fullname &&
      installationData.username &&
      installationData.password &&
      (installationData.password === installationData.passwordRepeat)) {
        $rootScope.next();
      } else {
        $rootScope.personalizationError = true;
      }
  }
}])
