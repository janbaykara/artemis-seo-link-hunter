angular.module('artemis-content')
    .factory('GoogleAPI', function($http,Utils) {
        var gaApiUrl = "https://www.googleapis.com/analytics/v3",
            GoogleAPI = {};

        GoogleAPI = {
            authenticate: function(opts) {
                var oauthURL = "https://accounts.google.com/o/oauth2/auth?"
                + "&scope="+opts.scope
                + "&response_type=token"
                + "&client_id="+opts.client_id
                + "&redirect_uri="+opts.redirect_uri
                Utils.popupWindow(oauthURL,"_blank",500,500);
            },

            getAccounts: function(cb) {
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts",
                    params: { "access_token": GoogleAPI.access_token }
                }).success(function(data) { cb(data) })
            },
            getWebProperties: function(cb) {
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts/"+GoogleAPI.account+"/webproperties",
                    params: { "access_token": GoogleAPI.access_token }
                }).success(function(data) { cb(data) })
            },
            getViews: function(cb) {
                $http({method:"GET",
                    url: gaApiUrl+"/management/accounts/"+GoogleAPI.account+"/webproperties/"+GoogleAPI.webproperty+"/profiles",
                    params: { "access_token": GoogleAPI.access_token }
                }).success(function(data) { cb(data) })
            },
            getReferralData: function(cb) {
                $.ajax({
                    url: gaApiUrl+"/data/ga",
                    method: "GET",
                    data: {
                        "access_token": GoogleAPI.access_token,
                        "ids": "ga:"+GoogleAPI.view,
                        "dimensions": "ga:source,ga:referralPath",
                        "metrics": "ga:pageviews,ga:visits",
                        "sort": "-ga:visits",
                        "filters": "ga:pagePath=="+Utils.parseUri(GoogleAPI.ContentPiece.data.url).path+";ga:medium==referral;ga:referralPath!=/",
                        "max-results": 100,
                        "start-date": GoogleAPI.ContentPiece.data.dateFrom,
                        "end-date": GoogleAPI.ContentPiece.data.dateTo
                    },
                    success: function(data) {
                        var rows = _.map(data.rows, function(row) {
                                return {
                                    source:row[0],
                                    referralPath:row[1],
                                    pageViews:row[2],
                                    visits:row[3],
                                    url: row[0]+""+row[1]
                                };
                            });
                        cb(rows);
                    }
                });
            }
        }

        return GoogleAPI;
    })