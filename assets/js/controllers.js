angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,$http,$window,ContentPiece,GoogleAPI,Utils) {

        // Default values
        $scope.newPiece = {
            inputLinks: "",
            name: "TastingBoutique We Miss You campaign",
            url: "http://www.tastingboutique.com/wemissyou",
            billableHours: 5,
            date: "2008-04-03"
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

        ///////////////////
        //// KNOWN LINKS + BUZZSTREAM INTEGRATION
        ///////////////////
        $scope.knownLinks = function() {
            return Utils.cleanArray($scope.newPiece.inputLinks.split("\n"));
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
            ContentPiece.buzzstreamLinks({
                url: $scope.newPiece.url,
                key: $scope.buzzstream.key,
                secret: $scope.buzzstream.secret,
                eachLink: function(thisURL,links) {
                    // Add to textarea
                    $scope.$apply(function() { $scope.newPiece.inputLinks += "\n"+thisURL; });
                },
                onFinished: function(links) {
                    $scope.$apply(function() {
                        $scope.buzzstream.doing = false;
                        $scope.buzzstream.done = true;
                    });
                }
            });
        }

        ///////////////////
        //// GOOGLE ANALYTICS REFERRAL TRAFFIC
        ///////////////////
        var gaApiUrl = "https://www.googleapis.com/analytics/v3";
        $scope.googleAnalytics = function() {
            console.log("Auth'ing with Google, for analytics data.")
            var oauthURL = "https://accounts.google.com/o/oauth2/auth?"
                            + "&scope=https://www.googleapis.com/auth/analytics.readonly"
                            + "&response_type=token"
                            + "&client_id=696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com"
                            + "&redirect_uri=http://www.boom-online.co.uk/playground/boom/artemis/goauth/";
            var w = Utils.popupWindow(oauthURL,"_blank",600,600);
        }
        $window.authParams = function(authObj) {
            $scope.google = authObj;
            $scope.analytics.getAccounts();
        }
        $scope.analytics = {
            getAccounts: function() {
                GoogleAPI.getAccounts($scope,function(data) {
                    $scope.google.accounts = data.items;
                });
            },
            getWebProperties: function() {
                GoogleAPI.getWebProperties($scope,function(data) {
                    $scope.google.webproperties = data.items;
                });
            },
            getViews: function() {
                GoogleAPI.getViews($scope,function(data) {
                    $scope.google.views = data.items;
                });
            },
            getReferralData: function() {
                GoogleAPI.getReferralData($scope,function(data) {
                    $scope.google.trafficData = data;
                })
            }
        }
    })
    .controller('output', function($scope,$state,$sce,ContentPiece,Utils) {
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