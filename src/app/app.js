'use strict';
angular.module('Biui', [
  "ui.router", 
  "ngAnimate",
  "html",
  "mm.foundation",
  "hello",
  "timezone",
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
  .state("timezone", {
      url: "/timezone",
      controller: "TimezoneCtrl",
      templateUrl: "timezone.html"
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

.run([ "$rootScope", "$state", "$stateParams", "$timeout", "$location", 
  function ($rootScope, $state, $stateParams, $timeout, $location) {
    $rootScope.steps = [
      {
        seq : 0,
        step : 1,
        name : "Introduction",
        path : "hello"
      },
      {
        seq : 1,
        step : 2,
        name : "Timezone",
        path : "timezone"
      },
      {
        seq : 2,
        step : 3,
        name : "Installation Target",
        path : "partition"
      },
      {
        seq : 3,
        step : 4,
        name : "Personalization",
        path : "user"
      },
      {
        seq : 4,
        step : 5,
        name : "Installation Summary",
        path : "summary"
      },
      {
        seq : 5,
        step : 6,
        name : "Installing...",
        path : ""
      },
      {
        seq : 6,
        step : 7,
        name : "Finish`",
        path : ""
      },
    ]

    $rootScope.goStep = function (seq) {
      if (seq < 4) {
        $rootScope.currentState = seq;
        $location.path($rootScope.steps[seq].path);
      }
    }

$rootScope.installationData = {};
    $rootScope.states = [
      "hello",
      "timezone",
      "partition",
      "user",
      "summary",
      "install",
      "done"
      ];
    $rootScope.advancedMode = function() {
      $rootScope.simplePartitioning = false;
    }
    $rootScope.simpleMode = function() {
      $rootScope.simplePartitioning = true;
    }
    $rootScope.currentState = 0;
    $rootScope.simplePartitioning = true;
    $rootScope.back = false;
    $rootScope.forward = true;
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
          $rootScope.currentState--;
          $state.go($rootScope.states[$rootScope.currentState]);
          $timeout(function(){
            $rootScope.back = false;
            $rootScope.forward = true;
            console.log($rootScope.back);
          }, 1300);
        }
      }, 100);
    }
    $rootScope.exit = function(){
      Installation.shutdown();
    }
    $timeout(function(){
      console.log($(window).width());
      // Fix layout according to screen size
      $(".page").css("width", ($(window).width()*(70/100)).toString() + "px");
      $(".content").css("height", ($(window).height()*(70/100)).toString() + "px !important");
      $(".page").css("margin-left", ($(window).width()*(7/100)).toString() + "px");
      $(".line").css("height", ($(window).height()*(72/100)).toString() + "px");
      $(".line").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step-container").css("margin-top", ($(window).height()*(10/100)).toString() + "px");
      $(".step").css("margin-bottom", (($(window).height()*(12/100))-10).toString() + "px");
      $(".step-big").css("margin-bottom", (($(window).height()*(12/100))-30).toString() + "px");
      $state.go($rootScope.states[$rootScope.currentState]);
      $rootScope.started = true;
    }, 500);
    $timeout(function(){
      $rootScope.showStepLine = true;
    }, 1000);
  }
])


