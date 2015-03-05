angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,$http,$window,ContentPiece,GoogleAPI,BuzzstreamAPI,Utils) {

        // Default values
        $scope.newPiece = {
            inputLinks: "",
            name: "Periodic Table of Chillis",
            url: "http://www.appliancecity.co.uk/chilli/",
            billableHours: 20,
            dateFrom: "2013-05-03"
        };

        // ng-click()
        $scope.analyse = function() {
            ContentPiece.new({
                name: $scope.newPiece.name,
                url: $scope.newPiece.url,
                billableHours: $scope.newPiece.billableHours,
                knownLinks: $scope.knownLinks(),
                dateFrom: $scope.newPiece.dateFrom
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
            BuzzstreamAPI.getLinksToURL({
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
    .controller('output', function($scope,$state,$sce,$window,ContentPiece,GoogleAPI,Utils) {
        if(!ContentPiece.initialised()) $state.go('app.input');
        $scope.ContentPiece = ContentPiece;
        $scope.hideDuplicates = true;
        $scope.ContentPiece.safeURL = $sce.trustAsResourceUrl($scope.ContentPiece.data.url);

        ///////////////////
        //// GOOGLE ANALYTICS REFERRAL TRAFFIC
        ///////////////////
        $scope.GoogleAPI = GoogleAPI;

        $scope.googleAnalytics = function() {
            console.log("Auth'ing with Google, for analytics data.")
            $scope.GoogleAPI.authenticate({
                scope: "https://www.googleapis.com/auth/analytics.readonly",
                client_id: "696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com",
                redirect_uri: "http://www.boom-online.co.uk/playground/boom/artemis/goauth/"
            });
        }
        $window.authParams = function(authObj) {
            $scope.GoogleAPI.access_token = authObj.access_token;
            $scope.GoogleAPI.ContentPiece = $scope.ContentPiece;
            $scope.analytics.getAccounts();
        }
        $scope.analytics = {
            getAccounts: function() {
                $scope.GoogleAPI.getAccounts(function(data) {
                    $scope.GoogleAPI.accounts = data.items;
                });
            },
            getWebProperties: function() {
                $scope.GoogleAPI.getWebProperties(function(data) {
                    $scope.GoogleAPI.webproperties = data.items;
                });
            },
            getViews: function() {
                $scope.GoogleAPI.getViews(function(data) {
                    $scope.GoogleAPI.views = data.items;
                });
            },
            getReferralData: function() {
                $scope.GoogleAPI.getReferralData(
                    function(trafficData) {
                        $scope.GoogleAPI.trafficData = trafficData;
                        _.each(ContentPiece.data.links, function(eachLink) {
                            $scope.$apply(function() {
                                eachLink.referrals =_.reduce(trafficData,function(sum,referralLink) {
                                                        if(eachLink.url.indexOf(referralLink.source) > -1) {
                                                            sum += parseInt(referralLink.visits)
                                                        }
                                                        return sum;
                                                    },0);
                            });
                        })
                    }
                )
            }
        }
        $scope.logX = function(val,x) {
          return Math.log(val) / Math.log(x);
        }
    })
    .filter('sup', function($sce) {
        return function(input) {
            var num = input.split(".");
            return $sce.trustAsHtml(num[0]+"<sup>."+num[1]+"</sup>");
        }
    })