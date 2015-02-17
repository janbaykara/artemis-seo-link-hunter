angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,ContentPiece) {

        // Default values
        $scope.newPiece = {
            name: "Sample Content Piece (Chilli Table - Appliance City)",
            url: "http://www.appliancecity.co.uk/chilli/",
            billableHours: 30
        };

        // ng-click()
        $scope.analyse = function() {
            ContentPiece.new({
                name: $scope.newPiece.name,
                url: $scope.newPiece.url,
                billableHours: $scope.newPiece.billableHours,
                knownLinks: (typeof $scope.newPiece.knownLinks != 'undefined' && $scope.newPiece.knownLinks.length > 3) ? $scope.newPiece.knownLinks.split("\n") : []
            });

            ContentPiece.get.links(function(links) {
                ContentPiece.get.social(function(shares) {
                    ContentPiece.get.secondDegreeSocial(function(secondaryShares) {
                        $state.go('app.output');
                    })
                });
            });
        }
    })
    .controller('output', function($scope,$state,ContentPiece,$sce) {
        if(!ContentPiece.initialised()) $state.go('app.input');
        $scope.ContentPiece = ContentPiece;
        $scope.hideDuplicates = true;
        $scope.ContentPiece.safeURL = $sce.trustAsResourceUrl($scope.ContentPiece.data.url);
    })