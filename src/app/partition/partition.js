angular.module("partition",[])
.controller("PartitionCtrl", [
    "$scope", "$window", "$timeout", "$rootScope", 
    function ($scope, $window, $timeout, $rootScope){


  /* function ctrl($scope) { */
  /* } */
  
  $scope.advancedPartition = false;
  $scope.actionDialog = false;
  $scope.title = "Installation Target";
  var gbSize = 1073741824;
  var minimumPartitionSize = 4 * gbSize;
  var driveBlockWidth = 600;

  // this partitionState is responsible for partoedi layout
  // and has nothing to do with libparted.
  $scope.partitionState = {
    mountPoint: {},
    stateIndex : 0,
    history : [],
      /* action : "", */
      /* prevState : [], */
      /* currentState : [] */
  }

  // there are 4 legal action for current partoedi :
  // - delete
  // - create
  // - format
  // - mountpoint
  // those action(s)  will be stored in steps and send to libparted through params
  var steps = {};

  $scope.switchToAdvancedPartition = function(){
    // reset selected target
    for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
      $rootScope.selectedDrive.partitions[j].selected = false;
      console.log("false!");
    }
    $rootScope.installationData.partition = null;

    $scope.advancedPartition = true;
    $scope.title = "PartoEdi";
    console.log($scope.selectedDrive.partitionList);
    // avoid two way binding
    $scope.partitionState.history.push({action:"initial", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    console.log($scope.partitionState);
  }
  $scope.undo = function(){
    if ($scope.partitionState.stateIndex > 0) {
      $scope.partitionState.currentState = angular.copy($scope.partitionState.history[($scope.partitionState.stateIndex-1)].state);
      $scope.selectedDrive.partitionList = angular.copy($scope.partitionState.history[($scope.partitionState.stateIndex-1)].state);
      console.log($scope.selectedDrive.partitionList);
      $scope.partitionState.stateIndex--;
      console.log($scope.partitionState);
      $scope.undoHistory = true;
    }
    // check mountpoint
    if ($scope.partitionState.mountPoint.root &&
    $scope.partitionState.mountPoint.home &&
    $scope.partitionState.mountPoint.swap) {
      $scope.partitionState.mountPoint.root = false;
      $scope.partitionState.mountPoint.home = false;
      $scope.partitionState.mountPoint.swap = false;
      for (var i = 0;i < $rootScope.selectedDrive.partitionList.length;i++) {
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/") {
          $scope.partitionState.mountPoint.root = true;
        }
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/home") {
          $scope.partitionState.mountPoint.home = true;
        }
      }

    }
  }
  $scope.redo = function(){
    if ($scope.undoHistory && $scope.partitionState.history[($scope.partitionState.stateIndex+1)]) {
      $scope.partitionState.currentState = angular.copy($scope.partitionState.history[($scope.partitionState.stateIndex+1)].state);
      $scope.selectedDrive.partitionList = angular.copy($scope.partitionState.history[($scope.partitionState.stateIndex+1)].state);
      console.log($scope.selectedDrive.partitionList);
      $scope.partitionState.stateIndex++;
      console.log($scope.partitionState);
    }
    // check mountpoint
    if ($scope.partitionState.mountPoint.root &&
    $scope.partitionState.mountPoint.home &&
    $scope.partitionState.mountPoint.swap) {
      $scope.partitionState.mountPoint.root = false;
      $scope.partitionState.mountPoint.home = false;
      $scope.partitionState.mountPoint.swap = false;
      for (var i = 0;i < $rootScope.selectedDrive.partitionList.length;i++) {
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/") {
          $scope.partitionState.mountPoint.root = true;
        }
        if ($rootScope.selectedDrive.partitionList[i].mountPoint === "/home") {
          $scope.partitionState.mountPoint.home = true;
        }
      }

    }
  }
  $scope.switchToSimplePartition = function(){
    $scope.advancedPartition = false;
    $scope.title = "Installation Target";
  }
  $scope.selectInstallationTarget = function(deviceId, partition) {
    console.log(partition.id)
    if (partition.id < 0) {
      partition.id = 0;
      console.log(partition.id)
    }
    $rootScope.installationData.device = deviceId;
    $rootScope.installationData.partition = partition.id;
    if (partition.id > 0) {
      $rootScope.selectedInstallationTarget = $rootScope.selectedDrive.path + partition.id + " ("+partition.sizeGb+" GB)";
    } else {
      $rootScope.selectedInstallationTarget = "a freespace partition";
    }
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
  $scope.createSliderValue = "0;100";
  $scope.createSliderOptions = {       
    from: 0,
    to: 100,
    step: 1,
  };
  $scope.highlight = function(partition) {
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].highlighted = true;
  }
  $scope.unhighlight = function(partition) {
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].highlighted = false;
  }
  $scope.createDialogSelected = {};
  $scope.partitionCreate = function(partition) {
    // if primary/extended has reach the limit (4), abort this function.
    var primExt = 0;
    for (var i = 0; i < $scope.selectedDrive.partitionList.length;i++) {
      if ($scope.selectedDrive.partitionList[i].type === "DEVICE_PARTITION_TYPE_NORMAL" || 
      $scope.selectedDrive.partitionList[i].type === "DEVICE_PARTITION_TYPE_EXTENDED") {
        primExt++;
      }
    }
    console.log("primext " + primExt);
    if (primExt < 4 || partition.logicalFreespace) {
      $scope.createSliderValue = "0;100";
      console.log("dialog");
      console.log(partition);
      $scope.createDialog = true;
      $scope.actionDialog = true;
      $scope.createDialogSelected = angular.copy(partition);
      $scope.createDialogSelected.index = $scope.selectedDrive.partitionList.indexOf(partition);
      $scope.createDialogSelected.sizeOrigin = angular.copy($scope.createDialogSelected.size);
      $scope.createDialogSelected.startOrigin = angular.copy($scope.createDialogSelected.start);
      $scope.createDialogSelected.endOrigin = angular.copy($scope.createDialogSelected.end);
      $scope.createDialogSelected.sizeGbOrigin = angular.copy($scope.createDialogSelected.sizeGb);
      $scope.createDialogSelected.blockWidthOrigin = angular.copy($scope.createDialogSelected.blockWidth);
    }
  }
  $scope.$watch("createSliderValue", function(value){
    console.log(value);
    var val = value.split(";");
    var offset = val[0];
    var percentage = val[1]-val[0];
    console.log(percentage);
    var start = $scope.createDialogSelected.startOrigin; 
    var end = $scope.createDialogSelected.endOrigin; 
    var size = $scope.createDialogSelected.size;
    var sizeOrigin = $scope.createDialogSelected.sizeOrigin;
    $scope.createDialogSelected.start = start + Math.round(sizeOrigin*(val[0]/100));
    $scope.createDialogSelected.end = end - Math.round(sizeOrigin*((100-val[1])/100));
    $scope.createDialogSelected.size = $scope.createDialogSelected.end - $scope.createDialogSelected.start;

    $scope.createDialogSelected.sizeGb = ($scope.createDialogSelected.size/gbSize).toFixed(2);
    $scope.createDialogSelected.percentage = percentage;

  });
  $scope.partitionCreateApply = function(partition){
    //disabled class doesnt work well click event, validate again
    if ((partition.type === "DEVICE_PARTITION_TYPE_NORMAL" && partition.mountPoint) || partition.type === "DEVICE_PARTITION_TYPE_EXTENDED" || (partition.logicalFreespace && partition.mountPoint)) {
      if (partition.logicalFreespace) var logical = true;
      console.log("apply");
      console.log(partition);
      if (partition.mountPoint === "/") {
        $scope.partitionState.mountPoint.root = true;
      } else if (partition.mountPoint === "/home") {
        $scope.partitionState.mountPoint.home = true;
      } else if (partition.mountPoint === "swap") {
        $scope.partitionState.mountPoint.swap = true;
      } 
      $scope.selectedDrive.partitionList[partition.index] = angular.copy(partition);
      $scope.selectedDrive.partitionList[partition.index].new = true;
      // if it created from logicalFreespace, flag them as logical
      if (partition.logicalFreespace) {
        $scope.selectedDrive.partitionList[partition.index].logical = true;
        // and tell the parent that they has a child
        if ($rootScope.selectedDrive.hasExtended) {
          for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
            if ($rootScope.selectedDrive.partitionList[k].extended &&
            partition.start >= $rootScope.selectedDrive.partitionList[k].start &&
            partition.end <= $rootScope.selectedDrive.partitionList[k].end &&
            $rootScope.selectedDrive.partitionList[k].type != "DEVICE_PARTITION_TYPE_FREESPACE"
            ) {
              $rootScope.selectedDrive.partitionList[k].hasChild = true;
            }
          }
        }
      }
      if (partition.type != "DEVICE_PARTITION_TYPE_EXTENDED") {
        $scope.selectedDrive.partitionList[partition.index].filesystem = "ext4";
        $scope.selectedDrive.partitionList[partition.index].normal = true;
        $scope.selectedDrive.partitionList[partition.index].freespace = false;
        $scope.selectedDrive.partitionList[partition.index].format = true;
        $scope.selectedDrive.partitionList[partition.index].blockWidth = parseInt(((partition.size/partition.sizeOrigin)*partition.blockWidth));
      } else {
        $scope.selectedDrive.partitionList[partition.index].freespace = false;
        $scope.selectedDrive.partitionList[partition.index].extended = true;
        $scope.selectedDrive.partitionList[partition.index].normal = false;
        // create freespace under this extended partition range
        var extendedFreespace = {
          type : "DEVICE_PARTITION_TYPE_FREESPACE",
          freespace : true,
          normal : true,
          logicalFreespace : true,
          hidden : false,
          start : partition.start,
          end : partition.end,
          size : partition.end - partition.start,
          sizeGb : ((partition.end - partition.start)/gbSize).toFixed(2),
          id : -1,
          blockWidth : partition.blockWidth,
        }
        $scope.selectedDrive.partitionList.splice((partition.index+1),0, extendedFreespace);
        $scope.selectedDrive.partitionList[partition.index].blockWidth = 0;
      }
  
      // if there is a freespace before newly created partition, then set it as valid freespace
      if (parseInt($scope.createSliderValue.split(";")[0]) > 0 ) {
        before = {
          type : "DEVICE_PARTITION_TYPE_FREESPACE",
          freespace : true,
          normal : false,
          hidden : false,
          start : partition.startOrigin,
          end : partition.start - 1,
          size : ($scope.selectedDrive.partitionList[partition.index].start - 1) - $scope.selectedDrive.partitionList[partition.index].startOrigin,
          sizeGb : ((($scope.selectedDrive.partitionList[partition.index].start - 1) - $scope.selectedDrive.partitionList[partition.index].startOrigin)/gbSize).toFixed(2),
          id : -1,
          blockWidth : (($scope.createSliderValue.split(";")[0]/100)*partition.blockWidthOrigin) - 4,
        }
        if (logical) before.logicalFreespace = true;
        $scope.selectedDrive.partitionList[partition.index].blockWidth -= 4; 
        $scope.selectedDrive.partitionList.splice((partition.index),0, before)
      }
      // or, after...
      if ((100 - parseInt($scope.createSliderValue.split(";")[1])) > 0 ) {
        after = {
          type : "DEVICE_PARTITION_TYPE_FREESPACE",
          freespace : true,
          normal : false,
          hidden : false,
          end : partition.endOrigin,
          start : partition.end + 1,
          size : partition.endOrigin - (partition.end + 1),
          sizeGb : ((partition.endOrigin - (partition.end + 1))/gbSize).toFixed(2),
          id : -1,
          blockWidth : (((100-$scope.createSliderValue.split(";")[1])/100)*partition.blockWidthOrigin) - 4,
        }
        $scope.selectedDrive.partitionList[partition.index].blockWidth -= 4;
        if (logical) after.logicalFreespace = true;
        console.log("after");
        console.log(after);
        var afterIndex = partition.index;
        if (partition.type === "DEVICE_PARTITION_TYPE_EXTENDED") {
          afterIndex++;
        }
        if (parseInt($scope.createSliderValue.split(";")[0]) > 0 ) {
          afterIndex += 2;
        } else {
          afterIndex++;
        }
        $scope.selectedDrive.partitionList.splice(afterIndex,0, after);
      }
  
      var index = $scope.selectedDrive.partitionList.indexOf(partition);
      if ($scope.undoHistory) {
        $scope.partitionState.history.splice(index);
      }
      $scope.partitionState.history.push({action:"create", state:angular.copy($scope.selectedDrive.partitionList)});
      $scope.undoHistory = false;
      $scope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
      $scope.partitionState.stateIndex++;
      console.log($scope.partitionState);
      $scope.createDialog = false;
      $scope.actionDialog = false;
    }
  }
  // end of partitionCreateApply

  $scope.partitionCreateCancel = function(){
    $scope.createDialog = false;
    $scope.actionDialog = false;
  }
  $scope.partitionMountPoint = function(partition, mountPoint) {
    console.log("yoooo");
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    if ($scope.undoHistory) {
      $scope.partitionState.history.splice(index);
    }
    partition.mountPoint = mountPoint;
    if (mountPoint === "/") {
      $scope.partitionState.mountPoint.root = true;
    } else if (mountPoint === "/home") {
      $scope.partitionState.mountPoint.home = true;
    } else if (mountPoint === "swap") {
      $scope.partitionState.mountPoint.swap = true;
    }
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    if ($scope.undoHistory) {
      $scope.partitionState.history.splice(index);
    }
    $scope.partitionState.history.push({action:"mount", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    $scope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    $scope.partitionState.stateIndex++;
    console.log($scope.partitionState);
  }
  $scope.partitionDelete = function(partition) {
    var p = partition;
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    if (p.extended_) {
      /* partition.extended = false; */
      /* partition.freespace = true; */
      /* partition.type = "DEVICE_PARTITION_TYPE_FREESPACE"; */
      /* partition.id = -1; */
      /* for (var i = 0; i < $rootScope.selectedDrive.partitionList.length; i++) { */
      /*   var current = $rootScope.selectedDrive.partitionList[i]; */
      /*   console.log(current); */
      /*   if (current.type != "DEVICE_PARTITION_TYPE_EXTENDED" && */
      /*   current.start != partition.start && */
      /*   current.start >= p.start && */
      /*   current.end <= p.end) { */
      /*     $rootScope.selectedDrive.partitionList.splice(i,1); */
      /*     i = 0; */
      /*   } */
      /* } */

    } else {
      if (p.extended) {
        partition.extended = false;
        partition.freespace = true;
        partition.type = "DEVICE_PARTITION_TYPE_FREESPACE";
        partition.id = -1;
        partition.blockWidth += 8;
        for (var i = 0; i < $rootScope.selectedDrive.partitionList.length; i++) {
          var current = $rootScope.selectedDrive.partitionList[i];
          console.log(current);
          if (current.type != "DEVICE_PARTITION_TYPE_EXTENDED" &&
          current.start != partition.start &&
          current.start >= p.start &&
          current.end <= p.end) {
            $rootScope.selectedDrive.partitionList.splice(i,1);
            i = 0;
          }
        }
  
      }
      // if the deleted partition is a logical, check if there is another sibling
      // if so, tell the parent
      if (p.logical) {
        console.log("p is logical");
        for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
          if ($rootScope.selectedDrive.partitionList[k].extended) {
            console.log("chcek this extended partition");
            // reset
            $rootScope.selectedDrive.partitionList[k].hasChild = false;
            // loop through the whole partitionList
            for (var i = 0; i < $rootScope.selectedDrive.partitionList.length; i++) {
              var current = $rootScope.selectedDrive.partitionList[i];
              console.log(current);
              if (current.type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
              current.type != "DEVICE_PARTITION_TYPE_EXTENDED" &&
              current.start != partition.start &&
              current.start >= $rootScope.selectedDrive.partitionList[k].start &&
              current.end <= $rootScope.selectedDrive.partitionList[k].end) {
                console.log("has child!");
                $rootScope.selectedDrive.partitionList[k].hasChild = true;
              }
            }
          }
        }
      }
      if (
      $scope.selectedDrive.partitionList[(index+1)] && 
      $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
      $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
      ) {
        // the prev and next partition of this partition are freespace. merge them.
        $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size + $scope.selectedDrive.partitionList[(index+1)].size;
        var size = $scope.selectedDrive.partitionList[(index-1)].size;
        $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[(index+1)].end;
        $scope.selectedDrive.partitionList[(index-1)].hidden = false;
        $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        if ($scope.selectedDrive.partitionList[(index-1)].freespace) {
          $scope.selectedDrive.partitionList[(index-1)].blockWidth += 8;
        }
        if ($scope.selectedDrive.partitionList[(index+1)].freespace) {
          $scope.selectedDrive.partitionList[(index-1)].blockWidth += 8;
        }
        $scope.selectedDrive.partitionList[(index-1)].freespace = true;
        $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index-1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index-1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,2);
      } else if (
          ($scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
          $scope.selectedDrive.partitionList[(index+1)].type != "DEVICE_PARTITION_TYPE_FREESPACE") ||
          (!$scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE") 
        ) {
        // the prev partition of this partition is free space
        $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[index].end;
        $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size;
        var size = $scope.selectedDrive.partitionList[(index-1)].size;
        $scope.selectedDrive.partitionList[(index-1)].hidden = false;
        $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        if ($scope.selectedDrive.partitionList[(index-1)].freespace) {
          $scope.selectedDrive.partitionList[(index-1)].blockWidth += 8;
        }
        $scope.selectedDrive.partitionList[(index-1)].freespace = true;
        $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index-1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index-1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,1);
      } else if (
        $scope.selectedDrive.partitionList[(index+1)] && 
        $scope.selectedDrive.partitionList[(index-1)].type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
        $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
        ) {
        // the next partition of this partition is free space
        $scope.selectedDrive.partitionList[(index+1)].start = $scope.selectedDrive.partitionList[index].start;
        $scope.selectedDrive.partitionList[(index+1)].size += $scope.selectedDrive.partitionList[index].size;
        var size = $scope.selectedDrive.partitionList[(index+1)].size;
        $scope.selectedDrive.partitionList[(index+1)].hidden = false;
        $scope.selectedDrive.partitionList[(index+1)].freespace = true;
        $scope.selectedDrive.partitionList[(index+1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
        if ($scope.selectedDrive.partitionList[(index+1)].freespace) {
          $scope.selectedDrive.partitionList[(index+1)].blockWidth += 8;
        }
        $scope.selectedDrive.partitionList[(index+1)].sizeGb = (size/gbSize).toFixed(2);
        if (p.logical) {
          $scope.selectedDrive.partitionList[(index+1)].logicalFreespace = true;
          $scope.selectedDrive.partitionList[(index+1)].freeSpace = true;
        }
        $scope.selectedDrive.partitionList.splice(index,1);
      } else {
        $scope.selectedDrive.partitionList[index].type = "DEVICE_PARTITION_TYPE_FREESPACE"; 
        $scope.selectedDrive.partitionList[index].id = -1;
        $scope.selectedDrive.partitionList[index].filesystem = "";
        $scope.selectedDrive.partitionList[index].description = "";
        $scope.selectedDrive.partitionList[index].freespace = true;
      }
    }
    $timeout(function(){
      if ($scope.undoHistory) {
        $scope.partitionState.history.splice(index);
      }
      $scope.partitionState.history.push({action:"delete", state:angular.copy($scope.selectedDrive.partitionList)});
      $scope.undoHistory = false;
      $scope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
      $scope.partitionState.stateIndex++;
      console.log($scope.partitionState);
    }, 100);
  }
  $scope.partitionFormat = function(partition) {
    console.log("format");
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].format = true;
    if ($scope.undoHistory) {
      $scope.partitionState.history.splice(index);
    }
    $scope.partitionState.history.push({action:"format", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    $scope.partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    $scope.partitionState.stateIndex++;
    console.log($scope.partitionState);
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      /* $rootScope.devices = Parted.getDevices(); */
      $rootScope.devices = [{"path":"/dev/sda","size":53687091200,"model":"ATA VBOX HARDDISK","label":"msdos","partitions":[{"id":-1,"parent":-1,"start":32256,"end":1048064,"size":1016320,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":15570304512,"size":15569256448,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":2,"parent":-1,"start":15570305024,"end":17780702720,"size":2210398208,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":17780703232,"end":27044871680,"size":9264168960,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":3,"parent":-1,"start":27044872192,"end":53687090688,"size":26642219008,"type":"DEVICE_PARTITION_TYPE_EXTENDED","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872192,"end":27044872192,"size":512,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872704,"end":27045920256,"size":1048064,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":5,"parent":-1,"start":27045920768,"end":50703891968,"size":23657971712,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":50703892480,"end":53687090688,"size":2983198720,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""}],"$$hashKey":"00T"}];
      $scope.scanning = true;
    }, 1000);
  }
  $scope.setDrive = function(path) {
    // TODO : reset UI
    console.log(JSON.stringify($rootScope.devices));
    $rootScope.validInstallationTarget = false;
    /* $rootScope.devices.forEach(function(drive){ */
    for (i = 0; i < $rootScope.devices.length; i++)
      if ($rootScope.devices[i].path === path) {
        $rootScope.selectedDrive = $rootScope.devices[i];
        $rootScope.selectedDrive.id = i;
        $rootScope.selectedDrive.partitionList = [];
        $rootScope.selectedDrive.driveWidth = 8;
        $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
        $rootScope.selectedDrive.hasExtended = false;
        /* $rootScope.selectedDrive.partitions.forEach(function(p){ */
        for (j = 0; j < $rootScope.selectedDrive.partitions.length; j++) {
          var p = $rootScope.selectedDrive.partitions[j];
          $rootScope.selectedDrive.partitionList.push(p);
          // filter partition to fit requirements
          if ( 
            (p.type.indexOf("NORMAL") > 0 || p.type.indexOf("LOGICAL") > 0 || p.type.indexOf("FREESPACE") > 0) && p.size > (0.01*gbSize)) {
            p.blockWidth = parseInt(((p.size/$rootScope.selectedDrive.size)*driveBlockWidth));
            $rootScope.selectedDrive.driveWidth += (8+p.blockWidth);
            p.sizeGb = (p.size/gbSize).toFixed(2);
            p.selected = false;
            p.normal = true;
            if (p.type.indexOf("LOGICAL") > 0) {
              p.logical = true;
              if ($rootScope.selectedDrive.hasExtended) {
                for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
                  if ($rootScope.selectedDrive.partitionList[k].extended &&
                  p.start >= $rootScope.selectedDrive.partitionList[k].start &&
                  p.end <= $rootScope.selectedDrive.partitionList[k].end) {
                    // tell it that it has child(s);
                    $rootScope.selectedDrive.partitionList[k].hasChild = true;
                  }
                }
              }
            } 
            if (p.size < minimumPartitionSize) {
              p.disallow = true;
            }
            if (p.id < 1 && p.type.indexOf("FREESPACE") > 0) {
              p.freespace = true;
              // is this freespace a child of extended partition?
              if ($rootScope.selectedDrive.hasExtended) {
                for (var k = 0; k < $rootScope.selectedDrive.partitionList.length; k++) {
                  if ($rootScope.selectedDrive.partitionList[k].extended &&
                  p.start >= $rootScope.selectedDrive.partitionList[k].start &&
                  p.end <= $rootScope.selectedDrive.partitionList[k].end) {
                    p.logicalFreespace = true;
                  }
                }
              }
            }
          } else {
            if (p.type.indexOf("EXTENDED") > 0) {
              p.extended = true;
              $rootScope.selectedDrive.hasExtended = true;
            } else {
              p.hidden = true;
            } 
          }
        }
      }
    } 
  }
])
