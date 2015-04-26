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
  var partitionState = {
    mountpoint: {
      root : "",
      home : ""
    },
    stateIndex : 0,
    history : [],
      /* action : "", */
      /* prevState : [], */
      /* currentState : [] */
  }
  $scope.switchToAdvancedPartition = function(){
    $scope.advancedPartition = true;
    $scope.title = "PartoEdi";
    console.log($scope.selectedDrive.partitionList);
    // avoid two way binding
    partitionState.history.push({action:"initial", state:angular.copy($scope.selectedDrive.partitionList)});
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    console.log(partitionState);
  }
  $scope.undo = function(){
    if (partitionState.stateIndex > 0) {
      partitionState.currentState = angular.copy(partitionState.history[(partitionState.stateIndex-1)].state);
      $scope.selectedDrive.partitionList = angular.copy(partitionState.history[(partitionState.stateIndex-1)].state);
      console.log($scope.selectedDrive.partitionList);
      partitionState.stateIndex--;
      console.log(partitionState);
      $scope.undoHistory = true;
    }
  }
  $scope.redo = function(){
    if ($scope.undoHistory && partitionState.history[(partitionState.stateIndex+1)]) {
      partitionState.currentState = angular.copy(partitionState.history[(partitionState.stateIndex+1)].state);
      $scope.selectedDrive.partitionList = angular.copy(partitionState.history[(partitionState.stateIndex+1)].state);
      console.log($scope.selectedDrive.partitionList);
      partitionState.stateIndex++;
      console.log(partitionState);
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
  $scope.partitionCreate = function(partition) {
    $scope.createDialog = true;
    $scope.actionDialog = true;
    $scope.createDialogSelected = partition;
    $scope.createDialogSelected.index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.createDialogSelected.sizeOrigin = angular.copy($scope.createDialogSelected.size);
    $scope.createDialogSelected.startOrigin = angular.copy($scope.createDialogSelected.start);
    $scope.createDialogSelected.endOrigin = angular.copy($scope.createDialogSelected.end);
    $scope.createDialogSelected.sizeGbOrigin = angular.copy($scope.createDialogSelected.sizeGb);
  }
  $scope.$watch("createSliderValue", function(value){
    console.log(value);
    var val = value.split(";");
    var offset = val[0];
    var percentage = val[1]-val[0];
    console.log(percentage);
    var start = $scope.createDialogSelected.startOrigin; 
    var end = $scope.createDialogSelected.endOrigin; 
    /* var size = $scope.createDialogSelected.size; */
    $scope.createDialogSelected.size = $scope.createDialogSelected.sizeOrigin*(percentage/100);
    $scope.createDialogSelected.sizeGb = (($scope.createDialogSelected.sizeOrigin/gbSize)*(percentage/100)).toFixed(2);
    $scope.createDialogSelected.percentage = percentage;

  });
  $scope.partitionCreateApply = function(partition){
    console.log(partition);
    console.log(partition.percentage);
    /* if (!partition.percentage || partition.percentage === 100) { */
    /* } */
    // calculate new ID
    $scope.selectedDrive.partitionList[partition.index] = angular.copy(partition);
    $scope.selectedDrive.partitionList[partition.index].type = "DEVICE_PARTITION_TYPE_NORMAL";
    $scope.selectedDrive.partitionList[partition.index].filesystem = "ext4";
    $scope.selectedDrive.partitionList[partition.index].freespace = false;
    $scope.selectedDrive.partitionList[partition.index].normal = true;
    $scope.selectedDrive.partitionList[partition.index].id = 3;
    if ($scope.undoHistory) {
      partitionState.history.splice(index);
    }
    partitionState.history.push({action:"create", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    partitionState.stateIndex++;
    console.log(partitionState);
    $scope.createDialog = false;
    $scope.actionDialog = false;
  }
  $scope.partitionCreateCancel = function(){
    $scope.createDialog = false;
    $scope.actionDialog = false;
  }
  $scope.partitionDelete = function(partition) {
    /* angular.forEach($scope.selectedDrive.partitionList, function(p){ */
    /*   if (p.start === partition.start) { */
        var p = partition;
        var index = $scope.selectedDrive.partitionList.indexOf(partition);
        if (
          $scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
          $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
          ) {
          console.log("hola ganda");
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size + $scope.selectedDrive.partitionList[(index+1)].size;
          var size = $scope.selectedDrive.partitionList[(index-1)].size;
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[(index+1)].end;
          $scope.selectedDrive.partitionList[(index-1)].hidden = false;
          $scope.selectedDrive.partitionList[(index-1)].freespace = true;
          $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,2);
        } else if (
            ($scope.selectedDrive.partitionList[(index+1)] && 
            $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE" && 
            $scope.selectedDrive.partitionList[(index+1)].type != "DEVICE_PARTITION_TYPE_FREESPACE") ||
            (!$scope.selectedDrive.partitionList[(index+1)] && 
            $scope.selectedDrive.partitionList[(index-1)].type === "DEVICE_PARTITION_TYPE_FREESPACE") 
          ) {
          console.log("hola awal");
          $scope.selectedDrive.partitionList[(index-1)].end = $scope.selectedDrive.partitionList[index].end;
          $scope.selectedDrive.partitionList[(index-1)].size += $scope.selectedDrive.partitionList[index].size;
          var size = $scope.selectedDrive.partitionList[(index-1)].size;
          $scope.selectedDrive.partitionList[(index-1)].hidden = false;
          $scope.selectedDrive.partitionList[(index-1)].freespace = true;
          $scope.selectedDrive.partitionList[(index-1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index-1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,1);
        } else if (
          $scope.selectedDrive.partitionList[(index+1)] && 
          $scope.selectedDrive.partitionList[(index-1)].type != "DEVICE_PARTITION_TYPE_FREESPACE" && 
          $scope.selectedDrive.partitionList[(index+1)].type === "DEVICE_PARTITION_TYPE_FREESPACE"
          ) {
          console.log("hola akhir");
          $scope.selectedDrive.partitionList[(index+1)].start = $scope.selectedDrive.partitionList[index].start;
          $scope.selectedDrive.partitionList[(index+1)].size += $scope.selectedDrive.partitionList[index].size;
          var size = $scope.selectedDrive.partitionList[(index+1)].size;
          $scope.selectedDrive.partitionList[(index+1)].hidden = false;
          $scope.selectedDrive.partitionList[(index+1)].freespace = true;
          $scope.selectedDrive.partitionList[(index+1)].blockWidth = parseInt(((size/$rootScope.selectedDrive.size)*driveBlockWidth));
          $scope.selectedDrive.partitionList[(index+1)].sizeGb = (size/gbSize).toFixed(2);
          $scope.selectedDrive.partitionList.splice(index,1);
        } else {
          console.log("hola else");
          $scope.selectedDrive.partitionList[index].type = "DEVICE_PARTITION_TYPE_FREESPACE"; 
          $scope.selectedDrive.partitionList[index].id = -1;
          $scope.selectedDrive.partitionList[index].filesystem = "";
          $scope.selectedDrive.partitionList[index].description = "";
          $scope.selectedDrive.partitionList[index].freespace = true;
        }
        $timeout(function(){
          if ($scope.undoHistory) {
            partitionState.history.splice(index);
          }
          partitionState.history.push({action:"delete", state:angular.copy($scope.selectedDrive.partitionList)});
          $scope.undoHistory = false;
          partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
          partitionState.stateIndex++;
          console.log(partitionState);
        }, 100);
      /* } */
    /* }); */
  }
  $scope.partitionFormat = function(partition) {
    console.log("format");
    var index = $scope.selectedDrive.partitionList.indexOf(partition);
    $scope.selectedDrive.partitionList[index].format = true;
    if ($scope.undoHistory) {
      partitionState.history.splice(index);
    }
    partitionState.history.push({action:"format", state:angular.copy($scope.selectedDrive.partitionList)});
    $scope.undoHistory = false;
    partitionState.currentState = angular.copy($scope.selectedDrive.partitionList);
    partitionState.stateIndex++;
    console.log(partitionState);
  }
  if (!$rootScope.installationData.partition) {
    // give time for transition
    $timeout(function(){
      $rootScope.devices = Parted.getDevices();
      /* $rootScope.devices_ = [{"path":"/dev/sda","size":53687091200,"model":"ATA VBOX HARDDISK","label":"msdos","partitions":[{"id":-1,"parent":-1,"start":32256,"end":1048064,"size":1016320,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":1,"parent":-1,"start":1048576,"end":15570304512,"size":15569256448,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":2,"parent":-1,"start":15570305024,"end":17780702720,"size":2210398208,"type":"DEVICE_PARTITION_TYPE_NORMAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":17780703232,"end":27044871680,"size":9264168960,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":3,"parent":-1,"start":27044872192,"end":53687090688,"size":26642219008,"type":"DEVICE_PARTITION_TYPE_EXTENDED","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872192,"end":27044872192,"size":512,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":-1,"parent":-1,"start":27044872704,"end":27045920256,"size":1048064,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":5,"parent":-1,"start":27045920768,"end":50703891968,"size":23657971712,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""},{"id":-1,"parent":-1,"start":50703892480,"end":50704940544,"size":1048576,"type":"DEVICE_PARTITION_TYPE_FREESPACE","filesystem":"","description":""},{"id":6,"parent":-1,"start":50704941056,"end":53687090688,"size":2982150144,"type":"DEVICE_PARTITION_TYPE_LOGICAL","filesystem":"ext4","description":""}],"$$hashKey":"00T"}]; */
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
        $rootScope.selectedDrive.partitionList = [];
        $rootScope.selectedDrive.driveWidth = 8;
        $rootScope.selectedDrive.sizeGb = $rootScope.selectedDrive.size * gbSize;
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
            } 
            if (p.size < minimumPartitionSize) {
              p.disallow = true;
            }
            if (p.id < 1 && p.type.indexOf("FREESPACE") > 0) {
              p.freespace = true;
            }
          } else {
            if (p.type.indexOf("EXTENDED") > 0) {
              p.extended = true;
              console.log("extended!");
            } else {
              p.hidden = true;
            } 
          }
        }
      }
    } 
  }
])
