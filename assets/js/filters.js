angular.module('artemis')
    .filter('sup', function($sce) {
        return function(input) {
            var num = input.split(".");
            return $sce.trustAsHtml(num[0]+"<sup>."+num[1]+"</sup>");
        }
    })