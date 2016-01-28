/**
 * Author:       Titouan CREACH
 * Email:        titouan.creach@gmail.com
 * Filename:     index.controller.js
 * Date:         26/12/2015
 * Purpose:      Code logic for the index.html page.
 * Project:      Peerflix-GUI
 * License:      GPLv3
 */

var PeerflixGUI = angular.module('PeerflixGUI', []);
var exec = require('child_process').exec,
    child,
    ansiStrip = require('ansi-stripper');

PeerflixGUI.controller('MainCtrl', ['$scope', 
function($scope) {
  /* the full url of the torrent file */
  $scope.fullTorrentUri = "";
  $scope.files = [];
  $scope.selectedIndex = -1;
  $scope.value = ""; // fake model needed by angular for ng-change
  $scope.isLoading = false;
  $scope.keepTorrent = false;
  $scope.savePath = "";

  /**
   * The function assign the list of the files included in the .torrent 
   * to the variable $scope.files. The function also set the $scope.isLoading state.
   */
  $scope.listFile = function() {
    $scope.isLoading = true;
    $scope.$apply();
    child = exec("peerflix -l \"" + $scope.fullTorrentUri + "\"", function(error, stdout, stderr) {
      $scope.files = ansiStrip(stdout).split("\n");
      $scope.files.pop();
      $scope.isLoading = false;
      $scope.$apply();
    });
  };

  /**
   * The function assign the id of the selected file to
   * $scope.selectedIndex.
   * @param {number} idx - The id of the files selected.
   */
  $scope.onSelect = function(idx) {
    $scope.selectedIndex = idx;
  };

  /**
   * The function start the movie according the Id of the file
   */
  $scope.startFilm = function() {
    if ($scope.selectedIndex === -1) { return; }

    Materialize.toast('VLC will start soon, please, be patient', 3000, 'rounded');
    if ($scope.keepTorrent) {
      child = 
        exec("peerflix -v -i " + $scope.selectedIndex + " \"" + $scope.fullTorrentUri + "\"" + " --path \"" + $scope.savePath + "\"", function(err, stdout, stderr) {
        });
    } else { 
      child = 
        exec("peerflix -v -i " + $scope.selectedIndex + " \"" + $scope.fullTorrentUri + "\"", function(err, stdout, stderr) {
          console.log("executed!");
        });
    }
  };

}]);

/**
 * The function connect the file chosen by the input and the scope.
 */
function chooseFile(name) {
  var chooser = $(name);
  chooser.unbind('change');
  chooser.change(function(evt) {
    var scope = angular.element("#body").scope();
    scope.fullTorrentUri = $(this).val();
    scope.$apply();
    scope.listFile();
  });
}
chooseFile('#fileDialog');


/**
 * The function connect the location chosen for the saving and the scope.
 */
function saveFile(name) {
  var chooser = $(name);
  chooser.unbind('change');
  chooser.change(function(evt) {
    var scope = angular.element("#body").scope();
    scope.savePath = $(this).val();
    scope.$apply();
    console.log(scope.savePath);
  });
}
saveFile('#saveDialog');


