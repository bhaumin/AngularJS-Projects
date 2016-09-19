(function(ng) {
	"use strict";

	function progressBar() {
		return {
			restrict: "E",
			templateUrl: "templates/progress-bar.html"
		};
	}

	ng.module("oneTableSampleApp")
		.directive("progressBar", progressBar);
}(angular));
