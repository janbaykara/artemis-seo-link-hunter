//////////////////////
/// Services
//////////////////////

angular.module("artemis-content",[])
    .factory('ContentShares', function(Utils) {
        var shareRegister = function(data) {
            var shareObj = {
                twitter:      { importance: 1, icon: "fa fa-twitter",         count: data.Twitter, name: "Twitter mentions" },
                facebook:     { importance: 1, icon: "fa fa-facebook",        count: data.Facebook.like_count + data.Facebook.share_count, name: "Facebook likes/shares" },
                google:       { importance: 1, icon: "fa fa-google",          count: data.GooglePlusOne, name: "Google +1s" },
                other:        { importance: 1, icon: "fa fa-share-alt",       count: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon, name: "Other mentions/shares" },
                buzz:         { importance: 2, icon: "fa fa-arrow-circle-up", count: data.Buzz, name: "Buzzfeed" },
                delicious:    { importance: 2, icon: "fa fa-delicious",       count: data.Delicious, name: "Delicious" },
                linkedin:     { importance: 2, icon: "fa fa-linkedin",        count: data.LinkedIn, name: "LinkedIn" },
                pinterest:    { importance: 2, icon: "fa fa-pinterest",       count: data.Pinterest, name: "Pinterest" },
                reddit:       { importance: 2, icon: "fa fa-reddit",          count: data.Reddit, name: "Reddit" },
                stumbleupon:  { importance: 2, icon: "fa fa-stumbleupon",     count: data.StumbleUpon, name: "StumbleUpon" }
            }
            return shareObj;
        };
        return shareRegister;
    })
    .factory('ContentLink', function(Utils,ContentShares) {
        var ContentLink = function() {
            this.url = "";
            this.domainAuthority = 0;
            this.known = false;
            this.relevant = true;
            this.included = true;
            this.equitable = false;
            this.baseValue = 150;
            this.irrelevantLinkModifier = -50;
            this.relevantLinkModifier = 10;
            this.shares = null;

            for(var prop in arguments[0])   {
                this[prop] = arguments[0][prop];
            }

            if(this.url.indexOf("http") == -1) // Add HTTP to all
                this.url = "http://"+this.url;
            if(this.url.indexOf("www.") > -1) // Remove all www's
                this.url = this.url.replace(/(\/{0,2})www\./g,'$1');

            this.domain = Utils.parseUri(this.url).authority;
        }
        ContentLink.prototype = {
            value: function () {
                var link = this
                  , domainValue = link.baseValue * ( link.domainAuthority / 100 + 1 );

                if(link.equitable && this.included) {
                    var value = link.relevant
                            ? domainValue + link.relevantLinkModifier
                            : domainValue + link.irrelevantLinkModifier
                } else {
                    var value = 0;
                }

                return value;
            },
            parseUri: function () {
                var link = this;
                return Utils.parseUri(link.url);
            },
            social: function(callback) {
                var link = this;
                if(link.shares == null) {
                    $.sharedCount(link.url, function(data) {
                        link.shares = ContentShares(data);
                        if (typeof callback == 'function')
                            callback(link.shares);
                        else return link.shares;
                    });
                } else {
                    // console.log(link.url+" has already had social analysis done")
                        if (typeof callback == 'function')
                            callback(link.shares);
                        else return link.shares;
                }
            }
        };

        return ContentLink
    })
    .factory('ContentPiece', function(ContentLink,ContentShares,Utils) {
        var init = false
          , ContentPiece = {};

        ContentPiece = {

            initialised: function() {
                return init;
            },

            new: function() {
                init = true;

                ContentPiece.data = {
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
                }; // reset

                for (var prop in arguments[0]) {
                    ContentPiece.data[prop] = arguments[0][prop];
                }
            },

            get: {
                social: function(callback) {
                    $.sharedCount(ContentPiece.data.url, function(data) {
                        ContentPiece.data.shares = ContentShares(data);
                        if (typeof callback == 'function') {
                            callback(ContentPiece.data.shares);
                        }
                    });
                },

                secondDegreeSocial: function(callback) {
                    _.each(ContentPiece.data.links, function(link,i) {
                        link.social(function() {
                            if(i+1== ContentPiece.data.links.length) {
                                // _.each(ContentPiece.data.links, function(link) {
                                //     console.log(link.url,link.social().facebook.count);
                                // })
                                ContentPiece.stats.secondarySocialCombined =
                                    _.reduce(ContentPiece.data.links, function(acc, margin) {
                                        var o = margin.shares;
                                        for (var p in o) {
                                            marginalCount = (typeof acc[p] != 'undefined') ? acc[p].count : 0;
                                            acc[p] = _.clone(o[p]);
                                            if(p == 'count') {
                                                acc[p].count = acc[p].count + marginalCount;
                                            }
                                        }
                                        return acc;
                                    }, {});
                                if (typeof callback == 'function') callback(ContentPiece.stats.secondarySocialCombined);
                            }
                        });
                    });
                },

                links: function(callback) {
                    $.ajax({
                        url: "mozapi.php",
                        type: "POST",
                        data: {
                            url: "/links/" + encodeURIComponent(ContentPiece.data.url)
                                + "?"
                                + "&Scope=page_to_page"
                                + "&Sort=domain_authority"
                                + "&LinkCols=2" // Flags full of data on each link
                                + "&TargetCols=32" // No. of links
                                + "&SourceCols=" + (4 + 68719476736) // Canon URL + PDA + DA of source
                                + "&Limit=50"
                        },
                        error: function(msg) {
                            console.warn(msg);
                        },
                        success: function(res) {
                            onReceiveLinks(JSON.parse(res));
                        }
                    });

                    function onReceiveLinks(links) {
                        ContentPiece.data.equitableLinkCount = (links.length > 0) ? links[0].luueid : 0;

                        _.each(links, function(link) {
                            var linkObject = new ContentLink({
                                title: link.ut,
                                url: link.uu,
                                equitable: !Utils.lfBitFlag(link.lf),
                                domainAuthority: link.pda,
                                known: false,
                                relevant: true
                            })
                            ContentPiece.data.links.push(linkObject)
                        })

                        if (ContentPiece.data.knownLinks.length > 0) {
                            mergeInKnownLinks(callback);
                        } else {
                            // each link.included = false if previous one is true
                            _.each(ContentPiece.data.links, function(link) {
                                if(link.included) {
                                    _.each(ContentPiece.data.links, function(otherLink) {
                                        if( link.domain == otherLink.domain
                                         && link.url != otherLink.url )
                                            otherLink.included = false;
                                    });
                                }
                            })
                            if (typeof callback == 'function') callback(ContentPiece.data.links);
                        }
                    }

                    function mergeInKnownLinks(cb) {
                        $.ajax({
                            url: "mozapi.php",
                            type: "POST",
                            data: {
                                url: "/url-metrics/"
                                   + "?"
                                   + "&Cols="
                                   + (4 + 68719476736), // Canon URL + DA of source,
                                array: ContentPiece.data.knownLinks
                            },
                            error: function(msg) {
                                console.warn(msg);
                            },
                            success: function(res) {
                                var links = JSON.parse(res);
                                var knownLinksData = [];

                                // Turn into propa links
                                _.each(links, function(link) {
                                    var linkObject = new ContentLink({
                                        // title: link.ut,
                                        url: link.uu,
                                        // equitable: !lfBitFlag(link.lf),
                                        // domainAuthority: link.pda,
                                        known: true,
                                        // relevant: true
                                    });
                                    knownLinksData.push(linkObject)
                                });

                                // Merge into found links dataset
                                mergeByProperty(ContentPiece.data.links, knownLinksData, 'url');

                                if (typeof callback == 'function') callback(ContentPiece.data.links);
                            }
                        });
                    }
                },
            },


            stats: {
                // Useful calculations
                linkValue: function() {
                    var totalLinkValue = 0;
                    _.each(ContentPiece.data.links, function(link) {
                        totalLinkValue += link.value();
                    });
                    return totalLinkValue;
                },

                socialValue: function(medium,source) {
                    source = (typeof source != 'undefined') ? source : ContentPiece.data.shares;
                    if (typeof medium != 'undefined' && medium != '*') {
                        return source[medium].count * (
                            (typeof ContentPiece.data.prices[medium] != 'undefined') ? ContentPiece.data.prices[medium] : ContentPiece.data.prices.other
                        )
                    } else {
                        return (source.twitter.count * ContentPiece.data.prices.twitter)
                            +  (source.facebook.count * ContentPiece.data.prices.facebook)
                            +  (source.google.count * ContentPiece.data.prices.google)
                            +  (source.other.count * ContentPiece.data.prices.other)
                    }
                },

                cost: function() { //£
                    return ContentPiece.data.billableHours * ContentPiece.data.costPerHour;
                },

                value: function() { //£
                    return ContentPiece.stats.linkValue() + ContentPiece.stats.socialValue();
                },

                profitloss: function() { //£
                    return ContentPiece.stats.value() - ContentPiece.stats.cost()
                },

                // Informative summary calcs

                averageDA: function() {
                    return _.reduce(ContentPiece.data.links, function(stored, margin) {
                        return stored + margin.domainAuthority;
                    }, 0) / ContentPiece.data.links.length;
                },

                socialCount: function(x) {
                    x = (typeof x != 'undefined') ? x : ContentPiece.data.shares;
                    return _.reduce(x, function(a, b) {
                        return a + b.count;
                    }, 0)
                },

                linkCount: function() {
                    return _.countBy(ContentPiece.data.links, function(link) {
                        return link.relevant ? 'relevant' : 'nonrelevant';
                    });
                },

                equitableLinkCount: function() {
                    return _.filter(ContentPiece.data.links, function(link) {
                        return link.included;
                    }).length;
                }
            }
        };

        return ContentPiece;
    })
    .factory('Utils', function() {
        //////////////////////
        /// Utility functions
        //////////////////////

        jQuery.sharedCount = function(url, fn) {
            url = encodeURIComponent(url || location.href);
            var apikey = sharedCount.key;
            var domain = sharedCount.url;
            var arg = {
              data: {
                url : url,
                apikey : apikey
              },
                url: domain,
                cache: true,
                dataType: "json"
            };
            if ('withCredentials' in new XMLHttpRequest) {
                arg.success = fn;
            }
            else {
                var cb = "sc_" + url.replace(/\W/g, '');
                window[cb] = fn;
                arg.jsonpCallback = cb;
                arg.dataType += "p";
            }
            return jQuery.ajax(arg);
        };

        var Utils = {
            mergeByProperty: function(arr1, arr2, prop) {
                _.each(arr2, function(arr2obj) {
                    var arr1obj = _.find(arr1, function(arr1obj) {
                        return arr1obj[prop] === arr2obj[prop];
                    });

                    arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
                });
            },

            nearestPow2: function(aSize) {
                return Math.pow(2, Math.floor(Math.log(aSize) / Math.log(2)));
            },

            lfBitFlag: function(input) {
                // console.log("---");
                // console.log(input);
                var bitpointer = input,
                    bitFlags = [],
                    nearestSmallerSquare = Utils.nearestPow2(bitpointer)

                do {
                    nearestSmallerSquare = Utils.nearestPow2(bitpointer);
                    // console.log(bitpointer,"-",nearestSmallerSquare)
                    bitpointer -= nearestSmallerSquare;
                    bitFlags.push(nearestSmallerSquare);
                }
                while (bitpointer > 0)

                isNoFollow = _.any(bitFlags, function(bitflag) {
                    return bitflag === 1;
                })
                // console.log(bitFlags)
                // console.log("Nofollow: "+isNoFollow);
                return isNoFollow;
            },

            parseUri: function(str) {
                this.options = {
                    strictMode: false,
                    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                    q:   {
                        name:   "queryKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                    },
                    parser: {
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                    }
                }

                var o   = this.options,
                    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                    uri = {},
                    i   = 14;

                while (i--) uri[o.key[i]] = m[i] || "";

                uri[o.q.name] = {};
                uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                    if ($1) uri[o.q.name][$1] = $2;
                });

                return uri;
            }
        }

        return Utils;
    });