angular.module("install",[])
.controller("InstallCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
  console.log(JSON.stringify($rootScope.installationData));
}])
