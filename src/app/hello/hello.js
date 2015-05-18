angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
      $scope.languages = $window.BiLanguage.available();
    
      $scope.setLanguage = function(lang) {
        console.log(lang);
        $rootScope.installationData.lang = lang.id;
        $rootScope.selectedLang = lang.title;
      }
      // TODO : language selection
      /* Installation.setLocale("C.UTF-8"); */
}])
