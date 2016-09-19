(function(ng) {
  "use strict";

  // Controller
  function controller($scope, $sce, $http) {

    function retrieveResultSet(reportName) {
      var url = "/data/";
      return $http({
        method: "get",
        url: [url, reportName, ".json"].join("")
      });
    }

    function onPageChange(newPage) {
      $scope.model.report.pagination.currentPage = newPage;
      $scope.updateReport();
    }

    function processResultSet(response) {
      // Displays our resultset with only our requested columns and with our custom formatting

      if (response.data && response.data.meta && response.data.resultSet && response.data.meta.totalRecords) {
        var start, end, paginatedResultSet;

        var results = response.data;

        // Retrieve the correct subset as per pagination
        // START - This block (line 26-38) is just to mimic the server side pagination logic.
        // We won't have to do this with real paginated data coming from server.
        if (results.meta.totalRecords >= ($scope.model.report.pagination.currentPage - 1) * $scope.model.report.reportInputs.itemsPerPage) {
          start = ($scope.model.report.pagination.currentPage - 1) * $scope.model.report.reportInputs.itemsPerPage;
          end = results.meta.totalRecords < ($scope.model.report.pagination.currentPage * $scope.model.report.reportInputs.itemsPerPage) ? 
                  results.meta.totalRecords : 
                  ($scope.model.report.pagination.currentPage * $scope.model.report.reportInputs.itemsPerPage);
          paginatedResultSet = results.resultSet.slice(start, end);
        } else {
          paginatedResultSet = results.resultSet;
          start = 0;
          end = results.totalRecords;
        }

        results.meta.startRecord = start + 1;
        results.meta.endRecord = end;
        // END - temporary block of code to just mimic server side pagination

        results.resultSet = paginatedResultSet;

        $scope.model.report.results = results;
        $scope.showProgressBar = false;
      }
    }

    $scope.loadReport = function() {
      $scope.showProgressBar = true;
      // reset to page 1
      $scope.model.report.pagination.currentPage = 1;
      retrieveResultSet($scope.model.report.reportInputs.requestedReport).then(processResultSet);
    };

    $scope.updateReport = function() {
      $scope.showProgressBar = true;
      retrieveResultSet($scope.model.report.reportInputs.requestedReport).then(processResultSet);
    };

    $scope.showProgressBar = false;
    $scope.model = {};
    $scope.model.report = {};

    $scope.model.report.config = {};

    $scope.model.report.config.customEndpoint = "http://some.standard.endpoint/";
    $scope.model.report.config.customAccountUrl = $scope.model.report.config.customEndpoint + "custom_account_page.html";

    $scope.model.report.reportInputs = {};
    $scope.model.report.reportInputs.requestedReport = "accounts";
    $scope.model.report.reportInputs.itemsPerPage = "10";

    $scope.model.report.pagination = {};
    $scope.model.report.pagination.onPageChange = onPageChange;

    $scope.loadReport();
  }

  ng.module("oneTableSampleApp").controller("sampleController", controller);

})(angular);