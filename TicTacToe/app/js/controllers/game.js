
(function(ng) {

  function controller($scope) {

    function toggleXO(v) {
      return v === "X" ? "O" : "X";
    }

    function isItXorO(v) {
      return v === "X" || v === "O";
    }

    function isThereAWinner(i, j, val) {
      var matchCount = 0;
      var last3MatchBoxes = [];
      // horizontal scan
      for (var jx = 0; jx < $scope.model.boardSize; jx++) {
        if ($scope.model.board[i][jx].text === val) {
          matchCount++;
          last3MatchBoxes.push([i, jx]);
          if (matchCount === 3) {
            // Found winner
            last3MatchBoxes.forEach(function(box) {
              $scope.model.board[box[0]][box[1]].isWinningBox = true;
            });
            return true;
          }
        } else {
          // reset
          matchCount = 0;
          last3MatchBoxes = [];
        }
      }

      // vertical scan
      matchCount = 0;
      last3MatchBoxes = [];
      for (var ix = 0; ix < $scope.model.boardSize; ix++) {
        if ($scope.model.board[ix][j].text === val) {
          matchCount++;
          last3MatchBoxes.push([ix, j]);
          if (matchCount === 3) {
            // Found winner
            last3MatchBoxes.forEach(function(box) {
              $scope.model.board[box[0]][box[1]].isWinningBox = true;
            });
            return true;
          }
        } else {
          // reset
          matchCount = 0;
          last3MatchBoxes = [];
        }
      }

      // top-left to bottom-right diagonal scan
      var ix = i < j ? 0 : i - j;
      var jx = i < j ? j - i : 0;

      matchCount = 0;
      last3MatchBoxes = [];
      while (ix < $scope.model.boardSize && jx < $scope.model.boardSize) {
        if ($scope.model.board[ix][jx].text === val) {
          matchCount++;
          last3MatchBoxes.push([ix, jx]);
          if (matchCount === 3) {
            // Found winner
            last3MatchBoxes.forEach(function(box) {
              $scope.model.board[box[0]][box[1]].isWinningBox = true;
            });
            return true;
          }
        } else {
          matchCount = 0;
          last3MatchBoxes = [];
        }
        ix++;
        jx++;
      }

      // top-right to bottom-left diagonal scan
      ix = Math.abs($scope.model.boardSize - (i + j + 1));
      jx = (i + j) >= $scope.model.boardSize ? ($scope.model.boardSize - 1) : (i + j);

      matchCount = 0;
      last3MatchBoxes = [];
      while (ix < $scope.model.boardSize && jx >= 0) {
        if ($scope.model.board[ix][jx].text === val) {
          matchCount++;
          last3MatchBoxes.push([ix, jx]);
          if (matchCount === 3) {
            // Found winner
            last3MatchBoxes.forEach(function(box) {
              $scope.model.board[box[0]][box[1]].isWinningBox = true;
            });
            return true;
          }
        } else {
          matchCount = 0;
          last3MatchBoxes = [];
        }
        ix++;
        jx--;
      }

      return false;
    }

    function isBoardSizeValid() {
      if (typeof $scope.model.boardSize !== "number" || $scope.model.boardSize < 3) {
        return false;
      }
      return true;
    }

    $scope.initializeBoard = function() {
      $scope.model.whoseTurn = "X";
      $scope.model.gameOver = false;
      $scope.model.winner = "";

      if (!isBoardSizeValid()) {
        // reset to default (3)
        $scope.model.boardSize = 3;
        return false;
      }
      $scope.model.board = [];
      for (var i = 0; i < $scope.model.boardSize; i++) {
        $scope.model.board[i] = [];
        for (var j = 0; j < $scope.model.boardSize; j++) {
          $scope.model.board[i][j] = {
            "text": "_",
            "isWinningBox": false
          };
        }
      }
    }

    $scope.pickXorO = function(i, j) {
      if (!isItXorO($scope.model.board[i][j].text) && !$scope.model.gameOver) {
        $scope.model.board[i][j].text = $scope.model.whoseTurn;
        // console.log({"i": i, "j": j});
        if (isThereAWinner(i, j, $scope.model.board[i][j].text)) {
          $scope.model.gameOver = true;
          $scope.model.winner = $scope.model.board[i][j].text === "X" ? 1 : 2;
        } else {
          $scope.model.whoseTurn = toggleXO($scope.model.whoseTurn);
        }
      }
    };

    $scope.model = {};
    $scope.model.boardSize = 3;
    $scope.initializeBoard();
  }

  return ng.module("TicTacToeApp")
          .controller("GameCtrl", [ "$scope", controller ]);

}(angular));
