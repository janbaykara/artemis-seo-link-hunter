angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,ContentPiece) {

        // Default values
        $scope.newPiece = {
            inputLinks: "",
            name: "The Periodic Table of Chillis",
            url: "http://www.appliancecity.co.uk/chilli/",
            billableHours: 20
        };

        // ng-click()
        $scope.analyse = function() {
            ContentPiece.new({
                name: $scope.newPiece.name,
                url: $scope.newPiece.url,
                billableHours: $scope.newPiece.billableHours,
                knownLinks: $scope.knownLinks()
            });

            console.log("Loading content links");
            ContentPiece.get.links(function(links) {
                console.log("Loading social shares");
                ContentPiece.get.social(function(shares) {
                    console.log("Loading second degree shares");
                    ContentPiece.get.secondDegreeSocial(function(secondaryShares) {
                        console.log("Finished data capture.")
                        $state.go('app.output');
                    })
                });
            });
        }

        function cleanArray(actual){
          var newArray = new Array();
          for(var i = 0; i<actual.length; i++){
              if (actual[i]){
                newArray.push(actual[i]);
            }
          }
          return newArray;
        }

        $scope.knownLinks = function() {
            return cleanArray($scope.newPiece.inputLinks.split("\n"));
        }

        $scope.buzzstream = {
            done: false,
            doing: false,
            links: [],
            key: 'f41fb799-2865-4621-94a0-97091d515d21',
            secret: 'VgZzmN7AYLRw36An0pFFh_Z-0kCXhnT67pUqX3-f-83c6Jp-PuuoMe9FiS_SdA6v'
        }

        $scope.fetchBuzzstream = function() {
            $scope.buzzstream.done = false;
            $scope.buzzstream.doing = true;
            $.ajax({
                url: "php/buzzstream.php",
                type: "POST", data: {
                    url: "https://api.buzzstream.com/v1/links?linking_to="+$scope.newPiece.url,
                    key: $scope.buzzstream.key,
                    secret: $scope.buzzstream.secret
                },
                error: function(msg) { console.warn(msg); },
                success: function(res) {
                    var buzzstreamData = JSON.parse(res);
                    var links = buzzstreamData.list;
                    _.each(links, function(link,i) {
                        $.ajax({
                            url: "php/buzzstream.php",
                            type: "POST", data: {
                                url: link,
                                key: $scope.buzzstream.key,
                                secret: $scope.buzzstream.secret
                            },
                            error: function(msg) { console.warn(msg); },
                            success: function(res) {
                                var thisURL = JSON.parse(res).linkingFrom;
                                $scope.$apply(function() { $scope.newPiece.inputLinks += "\n"+thisURL; });
                                if(i >= buzzstreamData.numResults-1) {
                                    $scope.$apply(function() {
                                        $scope.buzzstream.doing = false;
                                        $scope.buzzstream.done = true;
                                    });
                                }
                            }
                        });
                    })
                }
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