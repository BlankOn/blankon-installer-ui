angular.module("timezone",[])
.controller("TimezoneCtrl", ["$scope", "$window", "$rootScope", 
  function ($scope, $window, $rootScope, $watch){
    
    $(".content").css("height", $rootScope.contentHeight);

    $("area, timezone-next").click(function(){
      $rootScope.installationData.timezone = $("select").val();
      console.log($rootScope.installationData);
    });
}])
