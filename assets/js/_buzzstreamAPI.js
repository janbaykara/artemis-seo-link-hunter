angular.module('artemis-content')
    .factory('BuzzstreamAPI', function($http,Utils) {
        var BuzzstreamAPI = {};

        BuzzstreamAPI = {
            getLinksToURL: function(options) {
                $.ajax({
                    url: "php/buzzstream.php",
                    type: "POST", data: {
                        url: "https://api.buzzstream.com/v1/links?linking_to="+options.url,
                        key: options.key,
                        secret: options.secret
                    },
                    error: function(msg) {
                        console.warn(msg);
                        options.onFinished();
                    },
                    success: function(res) {
                        var buzzstreamData = JSON.parse(res);
                        var links = buzzstreamData.list;
                        _.each(links, function(link,i) {
                            $.ajax({
                                url: "php/buzzstream.php",
                                type: "POST", data: {
                                    url: link,
                                    key: options.key,
                                    secret: options.secret
                                },
                                error: function(msg) { console.warn(msg); },
                                success: function(res) {
                                    var thisURL = JSON.parse(res).linkingFrom;
                                    if(typeof options.eachLink === 'function')
                                        options.eachLink(thisURL,links)
                                    if(i >= buzzstreamData.numResults-1 && typeof options.onFinished === 'function')
                                        options.onFinished(links);
                                }
                            });
                        })
                    }
                });
            }
        }

        return BuzzstreamAPI;
    });