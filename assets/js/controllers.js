angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,$http,ContentPiece,Utils) {

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
    })
    .controller('output', function($scope,$state,ContentPiece,Utils,$sce,$window) {
        if(!ContentPiece.initialised()) $state.go('app.input');
        $scope.ContentPiece = ContentPiece;
        $scope.hideDuplicates = true;
        $scope.ContentPiece.safeURL = $sce.trustAsResourceUrl($scope.ContentPiece.data.url);

        ///////////////////
        //// GOOGLE ANALYTICS REFERRAL TRAFFIC
        ///////////////////
        $window.authParams = function(x) {
            console.log(x);
        }
        $scope.googleAnalytics = function() {
            var oauthURL = "https://accounts.google.com/o/oauth2/auth?"
                            + "&scope=https://www.googleapis.com/auth/analytics.readonly"
                            + "&response_type=token"
                            + "&client_id=696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com"
                            + "&redirect_uri=http://www.boom-online.co.uk/playground/boom/artemis/goauth/";
            var w = Utils.popupWindow(oauthURL,"_blank",600,600);
            /*
            function onAuth(access_token) {

                // Convert this to a URL
                // $ga->requestReportData(
                //     ga_profile_id,
                //     array('source','referralPath'),//what field you are looking for
                //     array('pageviews','visits'),//what metric you want to calculate
                //     '-visits',//sort order, prefix - means descending
                //     'ga:pagePath==/wemissyou && medium==referral && referralPath != /',//filter query
                //     null,//start: yyyy-mm-dd or null
                //     null,//end: yyyy-mm-dd or null
                //     1,//offset lookup
                //     100//max result
                // );

                $http.get("https://www.googleapis.com/analytics/v3/data", {
                    "access_token": access_token,
                    "ids": "ga:12345",
                    "dimensions": "ga:source,ga:medium",
                    "metrics": "ga:sessions,ga:bounces",
                    "sort": "-ga:sessions",
                    "filters": "ga:medium%3D%3Dreferral",
                    "segment": "gaid::-10 OR segment: sessions::condition::ga:medium%3D%3Dreferral",
                    "start-date": "2008-10-01",
                    "end-date": "2008-10-31",
                    "start-index": 10,
                    "max-results": 100,
                    "prettyprint": true
                }).success(function(a,b,c) {
                    console.log(a,b,c);
                })
            }
            */
        }
    })
    .filter('sup', function($sce) {
        return function(input) {
            var num = input.split(".");
            return $sce.trustAsHtml(num[0]+"<sup>."+num[1]+"</sup>");
        }
    })