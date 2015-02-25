angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,ContentPiece) {

        // Default values
        $scope.newPiece = {
            name: "Sample Content Piece",
            url: "http://www.ukoakdoors.co.uk/articles/6220/what-to-eat-in-the-wilderness-a-survival-guide/",
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

            console.log("Loading links for content");
            ContentPiece.get.links(function(links) {
                console.log("Loaded "+links.length+" links")
                ContentPiece.get.social(function(shares) {
                    console.log("Loaded "+shares.length+" shares")
                    ContentPiece.get.secondDegreeSocial(function(secondaryShares) {
                        console.log("Loaded "+secondaryShares.length+" secondary shares")
                        console.log("Finished data capture.")
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
    .filter('sup', function($sce) {
        return function(input) {
            var num = input.split(".");
            return $sce.trustAsHtml(num[0]+"<sup>."+num[1]+"</sup>");
        }
    })