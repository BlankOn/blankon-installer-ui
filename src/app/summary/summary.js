angular.module("summary",[])
.controller("SummaryCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);
    
    if ($rootScope.autofill) {
      setTimeout(function(){
        $rootScope.next();
      }, 1000)
    }

}])
