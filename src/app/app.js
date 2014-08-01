(function(){
	'use strict';
	angular.module('Biui', [
    "ui.router", 
    "hello"
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
  .run([ "$rootScope", "$state", "$stateParams", 
    function ($rootScope, $state, $stateParams) {
      $state.go("hello");
      $rootScope.started = true;
    }
  ])


})()
