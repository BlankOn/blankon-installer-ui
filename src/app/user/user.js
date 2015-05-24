angular.module("user",[])
.controller("UserCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  $scope.enforceStrongPassword = false;
  $rootScope.installationData.autologin = false;
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
  $scope.$watch("enforceStrongPassword", function(value){
    $scope.isSamePassword = false;
    $rootScope.installationData.password = "";
    $rootScope.installationData.passwordRepeat = "";
    $scope.passwordStrength = false;
  })
  $scope.$watch("installationData.password", function(value){
    $scope.isSamePassword = false;
    $rootScope.installationData.passwordRepeat = "";
    $rootScope.personalizationError = false;
    if (value && $scope.enforceStrongPassword) {
      console.log(value);
      if (value.length >= 8) {
        $scope.validPassword = true;
      } else {
        $scope.passwordStrength = "weak";
        if ($scope.enforceStrongPassword) {
          $scope.validPassword = false;
        }
      }
      if (value.length >= 8) {
        $scope.passwordStrength = "strong"; 
        if ($scope.enforceStrongPassword) {
          $scope.validPassword = false;
        }
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
    if (installationData.hostname && installationData.username && installationData.fullname && isSamePassword) {
      if ($scope.enforceStrongPassword) {
        if (validPassword) {
          $rootScope.next();
        } else {
          $rootScope.personalizationError = true;
        }
      } else {
        $rootScope.next();
      }
    } else {
      $rootScope.personalizationError = true;
    }
  }
}])
