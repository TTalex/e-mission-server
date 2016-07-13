angular.module('starter.metrics', ['nvd3'])

.controller('MetricsCtrl', function($scope, $ionicActionSheet, $http) {
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d[0]; },
            y: function(d){ return d[1]; },
            /*
            average: function(d) { 
                var vals = d.values.map(function(item){
                    return item[1];
                });
                return d3.mean(vals);
            },
            */

            color: d3.scale.category10().range(),
            // duration: 300,
            useInteractiveGuideline: true,
            // clipVoronoi: false,

            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%m/%d/%y')(new Date(d * 1000))
                },
                showMaxMin: false,
                staggerLabels: true
            },
            yAxis: {
              axisLabel: "Number",
              axisLabelDistance: -10
            },
        }
    };

    $scope.data = [];

    $scope.getMetrics = function() {
      var data = {
        freq: 'DAILY',
        start_time: $scope.selectCtrl.fromDate,
        end_time: $scope.selectCtrl.toDate,
        metric: $scope.selectCtrl.metric
      };
      console.log("Sending data "+JSON.stringify(data));
      $http.post("/result/metrics/local_date", data)
      .then(function(response) {
        if (angular.isDefined(response.data.aggregate_metrics)) {
          console.log("Got aggregate result "+response.data.aggregate_metrics.length);
          $scope.showCharts(response.data.aggregate_metrics)
          // $scope.showHeatmap(response.data.lnglat);
        } else {
          console.log("did not find aggregate result in response data "+JSON.stringify(response.data));
        }
      }, function(error) {
        console.log("Got error %s while trying to read metric data" +
          JSON.stringify(error));
      });
    };

    $scope.showCharts = function(agg_metrics) {
        var mode_bins = {};
        agg_metrics.forEach(function(metric) {
            for (var field in metric) {
                // TODO: Consider creating a prefix such as M_ to signal
                // modes. Is that really less fragile than caps, though?
                // Here, we check if the string is all upper case by 
                // converting it to upper case and seeing if it is changed
                if (field == field.toUpperCase()) {
                    if (field in mode_bins == false) {
                        mode_bins[field] = []
                    }
                    mode_bins[field].push([metric.ts, metric[field], metric.fmt_time]);
                }
            }
        });
        $scope.data = [];
        for (mode in mode_bins) {
            val_arrays = 
            $scope.data.push({key: mode, values: mode_bins[mode]});
        }
        $scope.options.
        $scope.options.yAxis.axisLabel = $scope.metricLabelMap[$scope.selectCtrl.metricString];
    };

    $scope.metricLabelMap = [
      {text: "COUNT", value:'Number'},
      {text: "DISTANCE", value: 'km'},
      {text: "DURATION", value: 'secs'},
      {text: "MEDIAN_SPEED", value: 'km/sec'}
    ];

    $scope.metricOptions = [
      {text: "COUNT", value:'count'},
      {text: "DISTANCE", value: 'distance'},
      {text: "DURATION", value: 'duration'},
      {text: "MEDIAN_SPEED", value: 'median_speed'}
    ];

    $scope.changeMetric = function() {
        $ionicActionSheet.show({
          buttons: $scope.metricOptions,
          titleText: "Select metric",
          cancelText: "Cancel",
          buttonClicked: function(index, button) {
            $scope.selectCtrl.metricString = button.text;
            $scope.selectCtrl.metric = button.value;
            return true;
          }
        });
    };

    var initSelect = function() {
      var now = moment();
      var monthago = moment().subtract(3, 'M');
      $scope.selectCtrl.metric = 'count';
      $scope.selectCtrl.metricString = "COUNT";
      $scope.selectCtrl.fromDate = moment2Localdate(monthago)
      $scope.selectCtrl.toDate = moment2Localdate(now);
      $scope.selectCtrl.fromDateWeekdayString = "All"
      $scope.selectCtrl.toDateWeekdayString = "All"
      $scope.selectCtrl.region = null;
    };
  
    var moment2Localdate = function(momentObj) {
      return {
        year: momentObj.year(),
        month: momentObj.month() + 1
      };
    }
  
    $scope.selectCtrl = {}
    initSelect();
});