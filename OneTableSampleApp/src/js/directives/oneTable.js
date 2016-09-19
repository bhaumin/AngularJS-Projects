(function(ng) {
	"use strict";

	// Common Directive
	function directive($sce) {

		function controller($scope) {

			function doesRowClassRuleMatch(op, actual, expected) {
				switch (op) {
					case "eq":
						return actual === expected;
					case "gt":
						return actual > expected;
					case "lt":
						return actual < expected;
					case "gte":
						return actual >= expected;
					case "lte":
						return actual <= expected;
					case "neq":
						return actual !== expected;
					case "mod":
						return actual % expected === 0;
				}
			}

			function isKeyNested(key) {
				return key.indexOf(".") !== -1;
			}

			function getColValue(col, row) {
				if (typeof row !== "undefined") {
					if (typeof row === "object" && col in row) {
						return row[col];
					} else if (isKeyNested(col)) {
						var nestedKeys = col.split(".");
						var colVal = "";

						var i = 0;
						nestedKeys.forEach(function(nKey) {
							if (nKey.trim() !== "") {
								if (i === 0) {
									colVal = row[nKey];
								} else if (typeof colVal === "object" && nKey in colVal) {
									colVal = colVal[nKey];
								} else {
									colVal = "";
								}

								i++;
							}
						});

						return colVal;
					} else {
						// key does not exist in the row
						return "";
					}
				}
			}

			$scope.applyRowClass = function(row, classMap) {
				if (typeof classMap === "undefined" ||
						typeof row === "undefined" ||
						classMap === null || row === null) {
					return;
				}

				var classes = "";

				function checkRuleAndApplyClass(rule) {
					if (doesRowClassRuleMatch(rule.op, actualVal, rule.value)) {
						classes += rule.class + " ";
					}
				}

				for (var col in classMap) {
					var actualVal = getColValue(col, row);
					if (actualVal !== null) {
						var classRules = classMap[col];

						classRules.forEach(checkRuleAndApplyClass);
					}
				}

				return classes;
			};

			$scope.formatCell = function(col, row, customFormatRules) {
				if (typeof row === "undefined" || row === null) {
					return "";
				}

				if (typeof customFormatRules === "object" &&
						col in customFormatRules &&
						typeof customFormatRules[col] === "object") {
					var formattedValue = getColValue(col, row);
					var colFormatRules = customFormatRules[col];

					if (formattedValue.toString().trim() !== "") {
						for (var rule in colFormatRules) {
							switch (rule) {
								case "math.float":
									if ("precision" in colFormatRules[rule]) {
										formattedValue = formattedValue.toFixed(colFormatRules[rule].precision);
									}

									break;
								case "link":
									if (colFormatRules[rule].href) {
										var customHref = colFormatRules[rule].href;
										if (colFormatRules[rule].queryParams &&
												colFormatRules[rule].queryParams.length > 0) {
											// Replace {x} with corresponding query param
											for (var i = 0; i < colFormatRules[rule].queryParams.length; i++) {
												var replaceVal = getColValue(colFormatRules[rule].queryParams[i], row);
												customHref = customHref.replace("{" + i + "}", replaceVal);
											}
										}

										var targetTag = "";
										if (colFormatRules[rule].target) {
											targetTag = "target=\"" + colFormatRules[rule].target + "\"";
										}

										formattedValue = "<a " + targetTag + " href=\"" +
															customHref + "\">" + formattedValue + "</a>";
									}

									break;
							}
						}
					}

					return $sce.trustAsHtml(formattedValue);

				} else {
					// Default Formatting Rules
					var customAccountUrl = "<a href=\"" + $scope.report.config.customAccountUrl;
					var colVal = getColValue(col, row);

					switch (col) {
						case "account.number":
							return $sce.trustAsHtml(customAccountUrl + "?account_no=" +
								colVal + "\">" + colVal + "</a>");
						case "account.email":
							return $sce.trustAsHtml("<a href=\"mailto:" + colVal + "\">" + colVal + "</a>");
						default:
							return colVal;
					}
				}
			};
		}

		return {
			replace: true,
			restrict: "E",
			scope: {
				report: "=reportData"
			},
			controller: ["$scope", controller],
			templateUrl: "templates/one-table.html"
		};
	}

	ng.module("oneTableSampleApp").directive("oneTable", directive);

}(angular));
