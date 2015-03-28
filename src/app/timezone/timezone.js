angular.module("timezone",[])
.controller("TimezoneCtrl", [
    "$scope", "$window", "$rootScope", 
    function ($scope, $window, $rootScope){
      $(document).ready(function() {
        // Set up the picker to update target timezone and country select lists.
        $('#timezone-image').timezonePicker({
          target: '#edit-date-default-timezone',
          countryTarget: '#edit-site-default-country'
        });
  
        // Optionally an auto-detect button to trigger JavaScript geolocation.
        $('#timezone-detect').click(function() {
          $('#timezone-image').timezonePicker('detectLocation');
        });
      });

}])
