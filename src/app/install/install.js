angular.module("install",[])
.controller("InstallCtrl", ["$scope", "$window", "$rootScope","$timeout","$interval",
  function ($scope, $window, $rootScope, $timeout, $interval){
    
    $(".content").css("height", $rootScope.contentHeight);

    console.log(JSON.stringify($rootScope.installationData));
    Installation.setTimezone($rootScope.installationData.timezone);

    var showError = function(){
      console.log("error");
      $scope.error = true;
    }
    var updateStatus = function(){
      var status = $rootScope.installation.getStatus();
      console.log(status.status + ":" + status.description);
      $scope.currentStep = status.description;
      $scope.progressBarWidth = status.progress;
      if (status.status > 1) {
        $interval.cancel(statusUpdater);
        if (status.status == 2) {
          showError();
        } else {
          $rootScope.next();
        }
      }
    }
    $scope.loadingDot = "";
    $interval(function(){
      if ($scope.loadingDot.length === 8) {
        $scope.loadingDot = "";
      } else {
        $scope.loadingDot += " .";
      }
    }, 500);
   
    // password value got reset after next(). Refill it.
    if ($rootScope.autofill) {
      $rootScope.installationData.password = 'test';
    }

    var params = "";
    params += "&partition=" + $rootScope.installationData.partition;
    params += "&device=" + $rootScope.installationData.device;
    params += "&device_path=" + $rootScope.installationData.device_path;
    params += "&hostname=" + $rootScope.installationData.hostname;
    params += "&username=" + $rootScope.installationData.username;
    params += "&fullname=" + $rootScope.installationData.fullname;
    params += "&password=" + $rootScope.installationData.password;
    params += "&language=" + $rootScope.installationData.language;
    params += "&timezone=" + $rootScope.installationData.timezone;
    params += "&keyboard=" + $rootScope.installationData.keyboard;
    params += "&autologin=" + $rootScope.installationData.autologin;
    params += "&advancedMode=" + $rootScope.advancedPartition;
    if ($rootScope.advancedPartition) {
      params += "&steps=" + $rootScope.partitionSteps;
    }
    if (
      (!$rootScope.isEfi && $rootScope.currentPartitionTable === 'gpt' && !$rootScope.isBiosBootExists) ||
      ($rootScope.isEfi && $rootScope.currentPartitionTable === 'gpt' && !$rootScope.isESPExists)
    ) {
      // The installer will create one.
      params += "&createESPPartition=true";
    }
    if ($rootScope.cleanInstall) {
      params += "&cleanInstall=true";
      // There is no EFI partition. Instaler will create one;
      params += "&efiPartition=false";
    }

    // give time for view transition
    $timeout(function(){
      console.log(params);
      $rootScope.installation = new Installation(params);
      $rootScope.installation.start();
      $scope.currentStep = "";
      statusUpdater = $interval(updateStatus, 1000);
    }, 1000);

}])
