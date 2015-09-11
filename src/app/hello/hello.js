angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", "$rootScope", "$translate", 
    function ($scope, $window, $rootScope, $translate){
      $scope.languages = $window.BiLanguage.available();
    
      $scope.setLanguage = function(lang) {
        console.log(lang);
        $rootScope.installationData.lang = lang.id;
        $rootScope.selectedLang = lang.title;
        $translate.use(lang.id);
      }
      // TODO : language selection
      /* Installation.setLocale("C.UTF-8"); */

}])
