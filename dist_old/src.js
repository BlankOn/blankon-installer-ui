angular.module("done",[])
.controller("DoneCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])

angular.module("hello",[])
.controller("HelloCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    $scope.selectedLang = lang.title;
    console.log(lang);
  }
}])

angular.module("install",[])
.controller("InstallCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])

angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.drives = ["10 TB Seagate","320 GB WD"];

  $scope.setDrive = function(drive) {
    $scope.selectedDrive = drive;
    console.log(lang);
  }
}])

angular.module("summary",[])
.controller("SummaryCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])

angular.module("user",[])
.controller("UserCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])

'use strict';
angular.module('Biui', [
  "ui.router", 
  "ngAnimate",

  "html",
  "mm.foundation",

  "hello",
  "partition",
  "user",
  "summary",
  "install",
  "done"
])
.config(function($stateProvider) {
  $stateProvider
  .state("hello", {
      url: "/hello",
      controller: "HelloCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("hello/hello.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("partition", {
      url: "/partition",
      controller: "PartitionCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("partition/partition.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("user", {
      url: "/user",
      controller: "UserCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("user/user.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("summary", {
      url: "/summary",
      controller: "SummaryCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("summary/summary.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("install", {
      url: "/install",
      controller: "InstallCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("install/install.html");
      }
    }
  )
})
.config(function($stateProvider) {
  $stateProvider
  .state("done", {
      url: "/done",
      controller: "DoneCtrl",
      templateProvider: function($templateCache) {
        return $templateCache.get("done/done.html");
      }
    }
  )
})

.run([ "$rootScope", "$state", "$stateParams", "$timeout", 
  function ($rootScope, $state, $stateParams, $timeout) {
    $rootScope.forward = true;
    $rootScope.back = false;
    $rootScope.states = [
      "hello",
      "partition",
      "user",
      "summary",
      "install",
      "done"
      
      ];
    $rootScope.currentState = 0;
    $rootScope.simplePartitioning = true;

    $rootScope.advancedMode = function() {
      $rootScope.simplePartitioning = false;
    }
    $rootScope.simpleMode = function() {
      $rootScope.simplePartitioning = true;
    }
    $rootScope.next = function() {
      $rootScope.back = false;
      $rootScope.forward = true;
        console.log("x", $rootScope.currentState, $rootScope.states.length);
      if ($rootScope.currentState + 1 < $rootScope.states.length) {
        $rootScope.currentState ++;

        var state = $rootScope.states[$rootScope.currentState];
        console.log(state);
        $state.go(state);
      }
    }

    $rootScope.previous = function() {
      $rootScope.back = true;
      $rootScope.forward = false;
      console.log($rootScope.back);
      $timeout(function(){
        if ($rootScope.currentState - 1 >= 0) {
          $rootScope.currentState --;
          $state.go($rootScope.states[$rootScope.currentState], function(){

        });
          $timeout(function(){
            $rootScope.back = false;
            $rootScope.forward = true;
            console.log($rootScope.back);
          }, 1100);
        }
      }, 100);
    }
    /* $rootScope.$on('$stateChangeSuccess', function(){ */
    /*   $rootScope.back = false; */
    /*   $rootScope.forward = true; */
    /* }); */
    $state.go($rootScope.states[$rootScope.currentState]);
    $rootScope.started = true;
  }
])


