angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", 
    function ($scope, $window, $timeout){

  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = (60/100) * $window.innerWidth;
  // give time for transition
  $scope.devices = [];
  $scope.selectedDrive = null;
  
  $timeout(function(){
    $scope.devices = Parted.getDevices();
    $scope.devices_ = [
    {
        "path": "/dev/sda",
        "size": 1000204886016,
        "model": "ATA TOSHIBA MQ01ABD1",
        "label": "msdos",
        "partitions": [
            {
                "id": -1,
                "parent": -1,
                "start": 32256,
                "end": 1048064,
                "size": 1016320,
                "type": "DEVICE_PARTITION_TYPE_FREESPACE",
                "filesystem": "",
                "description": ""
            },
            {
                "id": 1,
                "parent": -1,
                "start": 1048576,
                "end": 20972568064,
                "size": 20971520000,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext3",
                "description": "Ubuntu 14.04.1 LTS (14.04)"
            },
            {
                "id": 2,
                "parent": -1,
                "start": 20972568576,
                "end": 41944088064,
                "size": 20971520000,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext4",
                "description": ""
            },
            {
                "id": 3,
                "parent": -1,
                "start": 41944088576,
                "end": 62915608064,
                "size": 20971520000,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext4",
                "description": "BlankOn Tambora (Development Branch) (10.0)"
            },
            {
                "id": 4,
                "parent": -1,
                "start": 62915608576,
                "end": 1000204140032,
                "size": 937288531968,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext3",
                "description": ""
            },
            {
                "id": -1,
                "parent": -1,
                "start": 1000204140544,
                "end": 1000204885504,
                "size": 745472,
                "type": "DEVICE_PARTITION_TYPE_METADATA",
                "filesystem": "",
                "description": ""
            }
        ]
    }
];
    console.log(JSON.stringify($scope.devices));
    $scope.scanning = true;
  }, 1000);
  $scope.setDrive = function(path) {
    $scope.devices.forEach(function(drive){
      if (drive.path === path) {
        $scope.selectedDrive = drive;
        $scope.selectedDrive.qualifiedPartitions = [];
        $scope.selectedDrive.sizeGb = $scope.selectedDrive.size * gbSize;
        $scope.selectedDrive.partitions.forEach(function(p){
          // filter partition to fit requirements
          if ( p.size > minimumPartitionSize
            && (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0)) {
            p.blockWidth = parseInt(((p.size/$scope.selectedDrive.size)*driveBlockWidth));
            p.sizeGb = (p.size/gbSize).toFixed(2);
            $scope.selectedDrive.qualifiedPartitions.push(p);
                
          } 
        });
      }
    });
  }
}])
