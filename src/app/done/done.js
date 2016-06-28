angular.module("done",[])
.controller("DoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope){
    
    $(".content").css("height", $rootScope.contentHeight);

    $scope.reboot = function(){
      console.log("reboot");
      Installation.reboot();
    };
}])
