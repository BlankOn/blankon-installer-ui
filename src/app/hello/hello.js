angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    $rootScope.installationData.lang = lang.id;
    $rootScope.selectedLang = lang.title;
  }
}])
