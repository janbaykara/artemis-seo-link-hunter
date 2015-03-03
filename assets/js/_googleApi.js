angular.module('artemis-content')
    .factory('GoogleAPI', function($http,Utils) {
        var gaApiUrl = "https://www.googleapis.com/analytics/v3";

        return {
            getAccounts: function(scope,cb) {
                // GET  /management/accounts
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts",
                    params: { "access_token": scope.google.access_token }
                }).success(function(data) { cb(data) })
            },
            getWebProperties: function(scope,cb) {
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts/"+scope.google.account+"/webproperties",
                    params: { "access_token": scope.google.access_token }
                }).success(function(data) { cb(data) })
            },
            getViews: function(scope,cb) {
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts/"+scope.google.account+"/webproperties/"+scope.google.webproperty+"/profiles",
                    params: { "access_token": scope.google.access_token }
                }).success(function(data) { cb(data) })
            },
            getReferralData: function(scope,cb) {
                // Form today's YYYY-MM-DD date
                function pad(n){return n<10 ? '0'+n : n}
                var d = new Date();
                var dd = pad(d.getDate());
                var mm = pad(d.getMonth()+1);
                var yyyy = d.getFullYear();
                var dateToday = yyyy+"-"+mm+"-"+dd;

                // Get
                $.ajax({
                    url: gaApiUrl+"/data/ga",
                    method: "GET",
                    data: {
                        "access_token": scope.google.access_token,
                        "ids": "ga:"+scope.google.view,
                        "dimensions": "ga:source,ga:referralPath",
                        "metrics": "ga:pageviews,ga:visits",
                        "sort": "-ga:visits",
                        "filters": "ga:pagePath=="+Utils.parseUri(scope.newPiece.url).path+";ga:medium==referral;ga:referralPath!=/",
                        "max-results": 100,
                        "start-date": scope.newPiece.date,
                        "end-date": dateToday
                    },
                    success: function(data) {
                        var rows = scope.google.referralData = _.map(data.rows, function(row) {
                                return {source:row[0],referralPath:row[1],pageViews:row[2],visits:row[3]};
                            });
                        cb(rows);
                    }
                });
            }
        }
    })