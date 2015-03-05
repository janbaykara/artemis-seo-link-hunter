angular.module('artemis-content')
    .factory('BuzzstreamAPI', function($http,Utils) {
        var BuzzstreamAPI = {};

        BuzzstreamAPI = {
            authenticate: function(options) {
                var oauth_url = "https://api.buzzstream.com/requestToken";
                var oauth_consumer_secret = "VgZzmN7AYLRw36An0pFFh_Z-0kCXhnT67pUqX3-f-83c6Jp-PuuoMe9FiS_SdA6v";

                var string = "Oauth ",
                    props = [];

                var oauthHeader = function(params) {
                    _.each(params, function(val,key) {
                        props.push(key+"="+val);
                    })

                    var sign = function() {
                        props.oauth_signature = null;
                        props.oauth_signature = oauthSignature.generate("POST",oauth_url,params,oauth_consumer_secret);
                    };

                    return {
                        string: function() {
                            sign();
                            string += props.join(",");
                        }
                    }
                };

                var thisOauthHeader = new oauthHeader({
                    oauth_callback: options.callback,
                    oauth_version: "1.0",
                    oauth_consumer_key: options.consumer_key,
                    oauth_timestamp: OAuth.timestamp(),
                    oauth_nonce: OAuth.nonce(7),
                    oauth_signature_method: "HMAC-SHA1"
                })

                console.log(thisOauthHeader.string());

                // OAUTH GET REQUEST TOKEN
                $http({
                    url: oauth_url,
                    method: "POST",
                    headers: {
                        'Authorization': thisOauthHeader.string()
                    },
                })
            },

            getLinksToURL: function(options) {

                // $.ajax({
                //     url: "php/buzzstream.php",
                //     type: "POST", data: {
                //         url: "https://api.buzzstream.com/v1/links?linking_to="+options.url,
                //         key: options.key,
                //         secret: options.secret
                //     },
                //     error: function(msg) {
                //         console.warn(msg);
                //         options.onFinished();
                //     },
                //     success: function(res) {
                //         var buzzstreamData = JSON.parse(res);
                //         var links = buzzstreamData.list;
                //         _.each(links, function(link,i) {
                //             $.ajax({
                //                 url: "php/buzzstream.php",
                //                 type: "POST", data: {
                //                     url: link,
                //                     key: options.key,
                //                     secret: options.secret
                //                 },
                //                 error: function(msg) { console.warn(msg); },
                //                 success: function(res) {
                //                     var thisURL = JSON.parse(res).linkingFrom;
                //                     if(typeof options.eachLink === 'function')
                //                         options.eachLink(thisURL,links)
                //                     if(i >= buzzstreamData.numResults-1 && typeof options.onFinished === 'function')
                //                         options.onFinished(links);
                //                 }
                //             });
                //         })
                //     }
                // });
            }
        }

        return BuzzstreamAPI;
    });