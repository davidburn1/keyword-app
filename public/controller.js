var app = angular.module("myApp", []);

app.controller('myController', function($scope, $location, $http) {
    $scope.theText = "";
    $scope.textUpdated = false;
    $scope.keywords = Array();
    $scope.keyphrases = Array();

    $scope.$watch('theText', function (newValue, oldValue, scope) {
        $scope.textUpdated = true;
        //$scope.submitText();
    });
    
    $scope.submitText = function(){
        $http({
            method : "POST",
              url : "ajax",
              data : "myText='" + $scope.theText + "'",
          }).then(function(response) {
                console.log( response.data);
                $scope.keywords = response.data.keywords;
                $scope.keyphrases = response.data.keyphrases;
        });
    }

    var tick = function() {
        if ($scope.textUpdated == true){
            $scope.submitText();
            $scope.textUpdated = false;
        }
	}

    setInterval(tick, 10000);

});


