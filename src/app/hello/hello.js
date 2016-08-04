angular.module("hello",[])
.controller("HelloCtrl", ["$scope", "$window", "$rootScope", "$translate",
  function ($scope, $window, $rootScope, $translate){
    
    $rootScope.contentHeight = $rootScope.contentHeight || ($(window).height()*(87/100)).toString() + "px"; 
    $(".content").css("height", $rootScope.contentHeight);

    $scope.languages = [
      { id: "en_US.utf8", title: "English US" },
      { id: "id_ID.utf8", title: "Bahasa Indonesia" },
    ];
    $scope.setLanguage = function(lang) {
      console.log(lang);
      $rootScope.installationData.lang = lang.id;
      $rootScope.selectedLang = lang.title;
      $translate.use(lang.id);
      if (window.Installation) {
        Installation.setLocale(lang.id);
      }
    }
    if (window.Installation) {
      $rootScope.isEfi = parseInt(Installation.isEfi())==1 ? true : false;
      $rootScope.isESPExists = Installation.isESPExists()=='true' ? true : false ;
      $rootScope.isBiosBootExists = Installation.isBiosBootExists()=='true' ? true : false;
      $rootScope.debug = Installation.debug()=='true' ? true : false;
      $rootScope.autofill = Installation.autofill()=='true' ? true : false;
    }

    if ($rootScope.autofill) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
    }

    $scope.setLanguage($scope.languages[0]);
}])
