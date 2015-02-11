angular.module("alchemy")
    .controller('app', function($scope) {
        // setInterval(function() {
        //     console.log(ContentPiece.info)
        // }, 1000);
    })
    .controller('input', function($scope,$state,ContentPiece) {
        $scope.newPiece = {
            name: "Sample Content Piece (Chilli Table - Appliance City)",
            url: "http://www.appliancecity.co.uk/chilli/",
            billableHours: 10,
            links: []
        };

        $scope.analyse = function() {
            ContentPiece.new({
                name: $scope.newPiece.name,
                url: $scope.newPiece.url,
                billableHours: $scope.newPiece.hours
            });
            ContentPiece.get.links(function(links) {
                console.log(links);
                ContentPiece.get.social(function(shares) {
                    console.log(shares);
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

        $scope.ContentPiece = ContentPiece.info;
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