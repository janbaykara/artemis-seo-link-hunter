angular.module("artemis")
    .factory('ContentPiece', function() {
        var init = false;

        var content = defaultContent = {
            name: "",
            url: "",
            billableHours: 0,
            links: [],
            knownLinks: [],
            shares: {},
            costPerHour: 75,
            prices: {
                twitter: 0.25,
                facebook: 0.25,
                google: 0.4,
                other: 0.15
            }
        };

        var ContentPiece = {

            initialised: function() {
                return init;
            },

            new: function() {
                initialised = true;
                content = defaultContent; // reset

                for(var prop in arguments[0])   {
                    content[prop] = arguments[0][prop];
                }
            },

            get: {
                links: function (callback) {
                    $.ajax({
                        url: "mozapi.php",
                        type: "POST",
                        data: { url:"/links/"
                                    +encodeURIComponent(content.url)
                                    +"?"
                                    +"&Scope=page_to_page"
                                    +"&Sort=domain_authority"
                                    +"&Filter=equity" // links with equity
                                    +"&LinkCols=4" // Flags full of data on each link
                                    +"&TargetCols=256" // No. of links
                                    +"&SourceCols="+(1+4+68719476736) // Canon URL + DA of source
                                    +"&Limit=50"
                        },
                        error: function (msg) {console.warn(msg);},
                        success: function(res) { onReceiveLinks(JSON.parse(res)); }
                    });

                    function onReceiveLinks(links) {
                        _.each(links, function(link) {
                            var linkObject = new ContentLink({
                                title: link.ut,
                                url: link.uu,
                                domainAuthority: link.pda,
                                known: false,
                                relevant: true
                            });
                            content.links.push(linkObject)
                        })

                        if(content.knownLinks.length > 0) {
                            mergeInKnownLinks(callback);
                        } else {
                            if(typeof callback == 'function') callback(content.links);
                        }
                    }

                    function mergeInKnownLinks(cb) {
                        $.ajax({
                            url: "mozapi.php",
                            type: "POST",
                            data: { url: "/url-metrics/"
                                        +"?"
                                        +"&Cols="+(1+4+68719476736), // Canon URL + DA of source,
                                    array: content.knownLinks
                            },
                            error: function (msg) {console.warn(msg);},
                            success: function(res) {
                                var links = JSON.parse(res);
                                var knownLinksData = [];

                                // Turn into propa links
                                _.each(links, function(link) {
                                    var linkObject = new ContentLink({
                                        title: link.ut,
                                        url: link.uu,
                                        domainAuthority: link.pda,
                                        known: true,
                                        relevant: true
                                    });
                                    knownLinksData.push(linkObject)
                                });

                                // Merge into found links dataset
                                mergeByProperty(content.links,knownLinksData,'url');

                                if(typeof callback == 'function') callback(content.links);
                            }
                        });
                    }

                    function mergeByProperty(arr1, arr2, prop) {
                        _.each(arr2, function(arr2obj) {
                            var arr1obj = _.find(arr1, function(arr1obj) {
                                return arr1obj[prop] === arr2obj[prop];
                            });

                            //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
                            arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
                        });
                    }
                },

                social: function(callback) {
                    $.sharedCount(content.url, function(data){
                        content.shares = {
                            twitter: data.Twitter,
                            facebook: data.Facebook.like_count + data.Facebook.share_count,
                            google: data.GooglePlusOne,
                            other: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon,
                            buzz: data.Buzz,
                            delicious: data.Delicious,
                            linkedin: data.LinkedIn,
                            pinterest: data.Pinterest,
                            reddit: data.Reddit,
                            stumbleupon: data.StumbleUpon
                        };
                        if(typeof callback == 'function') {
                            callback(content.shares);
                        }
                    });
                }
            },


            info: {
                data: content,

            // Useful calculations

                linkValue: function() {
                    var totalLinkValue = 0;
                    _.each(content.links, function(link) {
                        totalLinkValue += link.value();
                    });
                    return totalLinkValue;
                },

                socialValue: function(medium) {
                    if(typeof medium != 'undefined') {
                        return content.shares[medium] * (
                            (typeof content.prices[medium] != 'undefined')
                                ? content.prices[medium]
                                : content.prices.other
                        )
                    } else {
                        return (content.shares.twitter * content.prices.twitter)
                             + (content.shares.facebook * content.prices.facebook)
                             + (content.shares.google * content.prices.google)
                             + (content.shares.other * content.prices.other)
                    }
                },

                cost: function() { //£
                    return content.billableHours * content.costPerHour;
                },

                value: function () { //£
                    return ContentPiece.info.linkValue() + ContentPiece.info.socialValue();
                },

                profitloss: function () { //£
                    return ContentPiece.info.value() - ContentPiece.info.cost()
                },

            // Informative summary calcs

                averageDA: function() {
                    return  _.reduce(content.links, function(stored,margin) {
                                return stored + margin.domainAuthority;
                            },0) / content.links.length;
                },

                socialCount: function() {
                    return  _.reduce(content.social,function(a,b) {
                                return a+b;
                            }, 0)
                },
            }
        };

        return ContentPiece;
    });