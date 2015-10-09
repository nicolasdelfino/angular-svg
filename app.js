(function(){
   'use strict';

   //app name and dependencies:

  var app = angular.module('testApp', ['ngMaterial']);

   //config:
   //Available palettes: red, pink, purple, deep-purple, indigo, blue, light-blue,
   //cyan, teal, green, light-green, lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey

   app.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
      .primaryPalette('amber')
      .accentPalette('red');
    })


    //main controller with scope and http:

    app.controller('appController', ['$scope', '$window', function($scope, $window){
    console.log("controller init")

    var hasMoved = false;

    //RESET:

    $scope.reset = function() {

      console.log("start / reset");

      $scope.circle_x = $('#svg-container').innerWidth()/2;
      $scope.circle_y = $('#svg-container').innerHeight()/2;

      fadeInCircle();

    }

    function fadeInCircle() {
      circle.attr({r:0});
      circle.animate({r: 10}, 500);
    }

    //SNAP:

    var s = Snap("#svg-container");

    //set css for svg container background:

    $('#svg-container').css( "background-color", '#F2F2F2' );
    $('#svg-container').css( "width", '100%' );
    setSVGHeight();

    // wrap existing svg circle as a Snap element:

    var circle = Snap("#svg-circle");

    $scope.reset();

    $scope.$watch(function() {
      return $scope.circle_x;
    }, function(newValue, oldValue) {
      console.log("change detected: " + newValue)
      fadeInCircle();

    });

    var move = function(dx,dy,mx, my) {

      var m = this.data;
      var cx = (mx-6);
      var cy = (my-72);
      var innerW = $('#svg-container').innerWidth();
      var innerH = $('#svg-container').innerHeight();
      var radius = $('#svg-circle').attr('r');

      var padding = radius;

      if(cx < (innerW - padding))
      {
        if(cx > padding)
        {
          if(cy > (padding))
          {
            if(cy < innerH - padding)
            {
                    this.attr({
                      transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
                    });
                    var matrix = this.matrix;
                    $scope.$apply(function() {
                      $scope.circle_x = matrix.e;
                      $scope.circle_y = matrix.f;
                    });
            }
          }
        }
      }
    }

    var start = function() {
            this.data('origTransform', this.transform().local );

            circle.animate({r: 30}, 300);
            hasMoved = true;
    }
    var stop = function() {

            console.log('finished dragging');

            circle.animate({r: 10}, 300);

            var matrix = this.matrix;
            $scope.circle_x = matrix.e; // e = x value
            $scope.circle_y = matrix.f; // f = y value

            var hack_matrix = [1, 0, 0, 1, $scope.circle_x, $scope.circle_y];
            $('#svg-container circle').attr('transform', "matrix("+hack_matrix+")");

    }

    circle.drag(move, start, stop );

    $( window ).resize(function() {
      $scope.reset();
    });

    }]);

    //////////////////////////////////////////////////////////////////////////////////////////
    //end controller

    $( window ).resize(function() {

      setSVGHeight();

    });

    function setSVGHeight() {
      var total_body_height = $('body').innerHeight();
      var toolbarHeight = $('md-toolbar').innerHeight();
      var svgDisplayHeight = (total_body_height - toolbarHeight) * .4;

      $('#svg-container').css( "width", '100%' );
      $('#svg-container').css( "height", svgDisplayHeight );
    }

})();
