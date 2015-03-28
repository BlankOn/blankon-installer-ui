angular.module("user",[])
.controller("UserCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  $scope.languages = $window.BiLanguage.available();
  $scope.$watch("installationData.hostname", function(value){
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value)
      $scope.installationData.hostname = value.replace(/[^a-z0-9-]/g, "");
    }
  });
  $scope.$watch("installationData.fullname", function(value){
    $rootScope.personalizationError = false;
  });
  $scope.$watch("installationData.username", function(value){
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value)
      $scope.installationData.username = value.replace(/[^a-z0-9-]/g, "");
    }
  });
  $scope.$watch("installationData.password", function(value){
    $scope.isSamePassword = false;
    $rootScope.personalizationError = false;
    if (value) {
      console.log(value);
      if (value.length >= 8) {
        $scope.validPassword = true;
      } else {
        $scope.passwordStrength = "weak"; 
        $scope.validPassword = false;
      }
      if (value.length >= 8) {
        $scope.passwordStrength = "strong"; 
      }
      if (value.match(/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g) && value.length >= 8) {
        $scope.passwordStrength = "veryStrong"; 
      }
      console.log($scope.passwordStrength);
    }
  });
  $scope.$watch("installationData.passwordRepeat", function(value){
    $rootScope.personalizationError = false;
    if (value && value == $scope.installationData.password) {
      $scope.isSamePassword = true;
    } else {
      $scope.isSamePassword = false;
    }
  });
  $scope.validatePersonalization = function(installationData, validPassword, isSamePassword) {
    $rootScope.personalizationError = false;
    if (installationData.hostname && installationData.username && installationData.fullname && validPassword && isSamePassword) {
      $rootScope.next();
    } else {
      $rootScope.personalizationError = true;
    }
  }
}])
