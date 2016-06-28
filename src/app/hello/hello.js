angular.module("hello",[])
.controller("HelloCtrl", ["$scope", "$window", "$rootScope", "$translate",
  function ($scope, $window, $rootScope, $translate){

    $scope.languages = [
      { id: "en_US.utf8", title: "English US" },
      { id: "id_ID.utf8", title: "Bahasa Indonesia" },
    ];
    $scope.setLanguage = function(lang) {
      console.log(lang);
      $rootScope.installationData.lang = lang.id;
      $rootScope.selectedLang = lang.title;
      $translate.use(lang.id);
      Installation.setLocale(lang.id);
    }
    $scope.setLanguage($scope.languages[0]);
}])
