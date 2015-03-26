angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){

  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = (60/100) * $window.innerWidth;
  $scope.selectInstallationTarget = function(deviceId, partition) {
    $rootScope.installationData.device = deviceId;
    $rootScope.installationData.partition = partition.id;
    $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
    for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
      if ($rootScope.selectedDrive.partitions[j].id === partition.id) {
        $rootScope.selectedDrive.partitions[j].selected = true;
        $rootScope.validInstallationTarget = true;
      } else {
        $rootScope.selectedDrive.partitions[j].selected = false;
      }
    }
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      $rootScope.devices = Parted.getDevices();
      $scope.scanning = true;
    }, 1000);
  }
  $scope.setDrive = function(path) {
    $rootScope.validInstallationTarget = false;
    /* $rootScope.devices.forEach(function(drive){ */
    for (i = 0; i < $rootScope.devices.length; i++)
      if ($rootScope.devices[i].path === path) {
        $rootScope.selectedDrive = $rootScope.devices[i];
        $rootScope.selectedDrive.id = i;
        $rootScope.selectedDrive.qualifiedPartitions = [];
        $rootScope.selectedDrive.driveWidth = 16;
        $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
        /* $rootScope.selectedDrive.partitions.forEach(function(p){ */
        for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
          var p = $rootScope.selectedDrive.partitions[j];
          if (p.size <= (0.01*gbSize) ) {
            continue;
          }
          // p.id = j;
          // filter partition to fit requirements
          if ( p.size > minimumPartitionSize
            && (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0)) {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            $rootScope.selectedDrive.qualifiedPartitions.push(p);
          } else {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            p.disabled = true;
            $rootScope.selectedDrive.qualifiedPartitions.push(p);
          }
          if (p.id > 0) {
            
          } else if (p.type.indexOf("FREESPACE") > 0) {
            p.freespace = true;
          }
        }
      }
    } 
  }
])
