angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", 
    function ($scope, $window){
  $scope.languages = $window.BiLanguage.available();

  $scope.setLanguage = function(lang) {
    console.log(lang);
  }
}])
