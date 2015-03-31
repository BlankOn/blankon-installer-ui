angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){

  $scope.advancedPartition = false;
  $scope.title = "Installation Target";
  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = 600;
  $scope.switchToAdvancedPartition = function(){
    $scope.advancedPartition = true;
    $scope.title = "PartoEdi";
  }
  $scope.switchToSimplePartition = function(){
    $scope.advancedPartition = false;
    $scope.title = "Installation Target";
  }
  $scope.selectInstallationTarget = function(deviceId, partition) {
    $rootScope.installationData.device = deviceId;
    $rootScope.installationData.partition = partition.id;
    $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
    for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
      if ($rootScope.selectedDrive.partitions[j].id === partition.id) {
        if (!$rootScope.selectedDrive.partitions[j].disallow) {
          $rootScope.selectedDrive.partitions[j].selected = true;
          $rootScope.validInstallationTarget = true;
        }
      } else {
        $rootScope.selectedDrive.partitions[j].selected = false;
      }
    }
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      /* $rootScope.devices = Parted.getDevices(); */
      $rootScope.devices = [{"path":"/dev/sda","size":53687091200,"model":"ATA VBOX HARDDISK","label":"msdos","partitions":[{"id":-1,"parent":-1,"start":32256,"end":1048064,"size":1016320,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":15570304512,"size":15569256448,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":2,"parent":-1,"start":15570305024,"end":17780702720,"size":2210398208,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":17780703232,"end":27044871680,"size":9264168960,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":3,"parent":-1,"start":27044872192,"end":53687090688,"size":26642219008,"type":"DEVICE_PARTITION_TYPE_EXTENDED","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872192,"end":27044872192,"size":512,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872704,"end":27045920256,"size":1048064,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":5,"parent":-1,"start":27045920768,"end":50703891968,"size":23657971712,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":50703892480,"end":50704940544,"size":1048576,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":6,"parent":-1,"start":50704941056,"end":53687090688,"size":2982150144,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""}],"$$hashKey":"00T"}];
      $scope.scanning = true;
    }, 1000);
  }
  $scope.setDrive = function(path) {
    console.log(JSON.stringify($rootScope.devices));
    $rootScope.validInstallationTarget = false;
    /* $rootScope.devices.forEach(function(drive){ */
    for (i = 0; i < $rootScope.devices.length; i++)
      if ($rootScope.devices[i].path === path) {
        $rootScope.selectedDrive = $rootScope.devices[i];
        $rootScope.selectedDrive.id = i;
        $rootScope.selectedDrive.qualifiedPartitions = [];
        $rootScope.selectedDrive.driveWidth = 8;
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
            console.log(p.id + "_" + (p.size/gbSize));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            p.normal = true;
            $rootScope.selectedDrive.qualifiedPartitions.push(p);
          } else {
            if (p.type.indexOf("EXTENDED") < 1) {
              console.log(p.id + "_" + (p.size/gbSize));
              p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
              $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
              p.sizeGb = (p.size/gbSize).toFixed(2);
              p.selected = false;
              p.disallow = true;
              $rootScope.selectedDrive.qualifiedPartitions.push(p);
            }
          }
          if (p.id < 1 && p.type.indexOf("FREESPACE") > 0) {
            p.freespace = true;
          }
        }
      }
    } 
  }
])
