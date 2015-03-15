angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", "$rootScope", "$timeout", "$interval", 
    function ($scope, $window, $rootScope, $timeout, $interval){

  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    $rootScope.installationData.lang = lang.id;
    $rootScope.selectedLang = lang.title;
  }
  /* var tes = $interval(function(){ */
  /*   console.log("yo"); */
  /* }, 1000); */
  /* $timeout(function(){ */
  /*   $interval.cancel(tes); */
  /* }, 5000); */
}])
