angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,ContentPiece) {

        // Default values
        $scope.newPiece = {
            name: "Sample Content Piece (Chilli Table - Appliance City)",
            url: "http://www.appliancecity.co.uk/chilli/",
            billableHours: 10,
            links: []
        };

        // ng-click()
        $scope.analyse = function() {
            ContentPiece.new($scope.newPiece);

            ContentPiece.get.links(function(links) {
                ContentPiece.get.social(function(shares) {
                    $state.go('app.output.summary');
                });
            });
        }
    })
    .controller('output', function($scope,$state,ContentPiece) {
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