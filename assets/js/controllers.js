function authParams(x) {
    console.log(x);
}

angular.module("artemis")
    .controller('app', function($scope,$state) {
        $scope._ = _;
    })
    .controller('input', function($scope,$state,ContentPiece,$http) {

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

        function popupWindow(url, title, w, h) {
          var left = (screen.width/2)-(w/2);
          var top = (screen.height/2)-(h/2);
          return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width='+w+', height='+h+', top='+top+', left='+left);
        }

        $scope.googleAnalytics = function() {
            // OAuth for what
            // Replace with window.open -> get oauth token back to here, then proceed with gapi.class.php query
            // $http.get("https://accounts.google.com/o/oauth2/auth", {
            //     "scope": "https://www.googleapis.com/auth/analytics.readonly",
            //     "response_type": "token",
            //     "client_id": "696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com",
            //     "redirect_uri": "http://www.boom-online.co.uk/playground/boom/artemis/"
            // }).success(function(a,b,c) {
            //     console.log(a,b,c);
            // })
            var oauthURL = "https://accounts.google.com/o/oauth2/auth?"
                            + "&scope=https://www.googleapis.com/auth/analytics.readonly"
                            + "&response_type=token"
                            + "&client_id=696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com"
                            + "&redirect_uri=http://www.boom-online.co.uk/playground/boom/artemis/goauth/";
            var w = popupWindow(oauthURL,"_blank",600,600);
            // get access_token obj back from `w`
            // w.close();

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