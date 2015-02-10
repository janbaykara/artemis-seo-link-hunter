angular.module("alchemy")
    .controller('app', function($scope, $http) {

    })
    .controller('input', function($scope,ContentPiece) {
        $scope.analyse = function() {
            ContentPiece.new({
                name: $scope.content.name,
                url: $scope.content.url,
                billableHours: $scope.content.hours
            });
            ContentPiece.getLinks(function(links) {
                ContentPiece.getSocial(function(shares) {
                    $state.go('app.output.summary');
                });
            });
        }
    })
    .controller('output', function($scope,ContentPiece) {
        $scope.outputTabs = [{
            heading: 'Summary',
            route:   'app.output.summary'
        },{
            heading: 'Links',
            route:   'app.output.links'
        },{
            heading: 'Social',
            route:   'app.output.social'
        }];

        $scope.ContentPiece = ContentPiece;
    })
    .controller('summary', function($scope) {
        // Summary data analysis
    })
    .controller('links', function($scope) {
        // Link analysis
    })
    .controller('social', function($scope) {
        // Social shares
    })