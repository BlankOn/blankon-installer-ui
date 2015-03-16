angular.module("install",[])
.controller("InstallCtrl", [
    "$scope", "$window", "$rootScope","$timeout","$interval", 
    function ($scope, $window, $rootScope, $timeout, $interval){
  console.log(JSON.stringify($rootScope.installationData));
    var showError = function(){
      $scope.errorLog = "Error!";
    }
    var updateStatus = function(){
      var status = installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      $scope.progressBarWidth = status.progress;
      if (status.status > 1) {
        console.log("stopped");
        $interval.cancel(statusUpdater);
        if (status.status == 2) {
          console.log("error");
          showError();
        } else {
          console.log("installation finished");
          $rootScope.next();
        }
      }
    }

    var params = "";
    params += "&partition=" + $rootScope.installationData.partition;
    params += "&device=" + $rootScope.installationData.device;
    params += "&hostname=" + $rootScope.installationData.hostname;
    params += "&username=" + $rootScope.installationData.username;
    params += "&fullname=" + $rootScope.installationData.fullname;
    params += "&password=" + $rootScope.installationData.password;
    params += "&language=" + $rootScope.installationData.language;
    params += "&timezone=" + $rootScope.installationData.timezone;
    params += "&keyboard=" + $rootScope.installationData.keyboard;
    params += "&autologin=" + false;
    installation = new Installation(params);
    installation.start();
    $scope.currentStep = "";
    statusUpdater = $interval(updateStatus, 1000);



}])
