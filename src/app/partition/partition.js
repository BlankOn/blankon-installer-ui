angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){

  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = 600;
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
      $rootScope.devices = Parted.getDevices();
      $rootScope.devices_ = [
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
    $rootScope.devices__ = [
    {
        "path": "/dev/sda",
        "size": 53687091200,
        "model": "ATA VBOX HARDDISK",
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
                "end": 11060379136,
                "size": 11059331072,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext4",
                "description": ""
            },
            {
                "id": 2,
                "parent": -1,
                "start": 11060379648,
                "end": 12253658624,
                "size": 1193279488,
                "type": "DEVICE_PARTITION_TYPE_NORMAL",
                "filesystem": "ext4",
                "description": ""
            },
            {
                "id": 3,
                "parent": -1,
                "start": 12253659136,
                "end": 53687090688,
                "size": 41433432064,
                "type": "DEVICE_PARTITION_TYPE_EXTENDED",
                "filesystem": "",
                "description": ""
            },
            {
                "id": -1,
                "parent": -1,
                "start": 12253659136,
                "end": 12253659136,
                "size": 512,
                "type": "DEVICE_PARTITION_TYPE_FREESPACE",
                "filesystem": "",
                "description": ""
            },
            {
                "id": -1,
                "parent": -1,
                "start": 12253659648,
                "end": 12254707200,
                "size": 1048064,
                "type": "DEVICE_PARTITION_TYPE_FREESPACE",
                "filesystem": "",
                "description": ""
            },
            {
                "id": 5,
                "parent": -1,
                "start": 12254707712,
                "end": 51533315584,
                "size": 39278608384,
                "type": "DEVICE_PARTITION_TYPE_LOGICAL",
                "filesystem": "ext4",
                "description": ""
            },
            {
                "id": -1,
                "parent": -1,
                "start": 51533316096,
                "end": 51534364160,
                "size": 1048576,
                "type": "DEVICE_PARTITION_TYPE_FREESPACE",
                "filesystem": "",
                "description": ""
            },
            {
                "id": 6,
                "parent": -1,
                "start": 51534364672,
                "end": 53687090688,
                "size": 2152726528,
                "type": "DEVICE_PARTITION_TYPE_LOGICAL",
                "filesystem": "ext4",
                "description": ""
            }
        ],
        "$$hashKey": "00S"
    }
]; 
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
