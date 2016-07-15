(function($) {

  Drupal.behaviors.ymca_retention_activity = {};
  Drupal.behaviors.ymca_retention_activity.attach = function(context, settings) {
    if ($('body').hasClass('ymca-retention-activity-processed')) {
      return;
    }
    $('body').addClass('ymca-retention-activity-processed');

    var ActivityModule = angular.module('Activity', ['slickCarousel']);
    ActivityModule.controller('ActivityController', function($scope, $http) {
      $scope.dates = settings.ymca_retention.activity.dates;
      $scope.date_index = -1;
      $scope.dates.forEach(function(item, i, arr) {
        if (item.past) {
          $scope.date_index = i;
        }
      });

      $scope.activity_groups = settings.ymca_retention.activity.activity_groups;
      $scope.activity_group_index = 0;

      $http.get(settings.ymca_retention.activity.member_activities).success(function(data) {
        $scope.member_activities = data;
      });

      $scope.dateClass = function(index) {
        var classes = [];
        if ($scope.dates[index].past) {
          classes.push('campaign-dates--date-past');
        }
        if ($scope.date_index === index) {
          classes.push('campaign-dates--date-current');
        }
        if ($scope.dates[index].future) {
          classes.push('campaign-dates--date-future');
        }

        if (!$scope.activitiesCount(index)) {
          classes.push('campaign-dates--date-no-activity');
        }

        return classes.join(' ');
      };

      $scope.setDate = function(index) {
        if ($scope.dates[index].past) {
          $scope.date_index = index;
        }
      };

      $scope.activityGroupClass = function(index) {
        var classes = [];
        if ($scope.activity_groups[index].name === 'Swim') {
          classes.push('activity-group-item-link--swimming');
        }
        if ($scope.activity_groups[index].name === 'Fitness') {
          classes.push('activity-group-item-link--fitness');
        }
        if ($scope.activity_groups[index].name === 'Free Group X') {
          classes.push('activity-group-item-link--group-ex');
        }
        if ($scope.activity_group_index === index) {
          classes.push('activity-group-item-link--active');
        }

        return classes.join(' ');
      };

      $scope.setActivityGroup = function(index) {
        $scope.activity_group_index = index;
      };

      $scope.activityItemsShow = function(index) {
        return $scope.activity_group_index === index;
      };

      $scope.activitiesCount = function(index) {
        if (typeof $scope.member_activities === 'undefined') {
          return 0;
        }
        return $scope.member_activities[$scope.dates[index].timestamp].length;
      };

      $scope.activityItemChecked = function(id) {
        if (typeof $scope.member_activities === 'undefined') {
          return false;
        }
        return $scope.member_activities[$scope.dates[$scope.date_index].timestamp].indexOf(id) != -1;
      };

      $scope.slickConfig = {
        speed: 300,
        infinite: false,
        centerMode: false,
        variableWidth: true,
        swipeToSlide: true,
        initialSlide: Math.max(0, $scope.date_index - 3)
      };
    });

    // Bootstrap AngularJS application.
    angular.bootstrap(document.getElementById('activity-app'), ['Activity']);
  };

})(jQuery);
