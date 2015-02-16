angular.module("artemis-content",[])
    .factory('ContentLink', function() {
        //////////////////////
        /// Utility functions
        //////////////////////

        function parseUri (str) {
            var o   = parseUri.options,
                m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i   = 14;

            while (i--) uri[o.key[i]] = m[i] || "";

            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1) uri[o.q.name][$1] = $2;
            });

            return uri;
        };

        parseUri.options = {
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
        };

        //////////////////////
        /// Game on
        //////////////////////

        var ContentLink = function() {
            this.url = "";
            this.domainAuthority = 0;
            this.known = false;
            this.relevant = true;
            this.equitable = false;
            this.baseValue = 150;
            this.irrelevantLinkModifier = -50;
            this.relevantLinkModifier = 10;

            for(var prop in arguments[0])   {
                this[prop] = arguments[0][prop];
            }
        }
        ContentLink.prototype = {
            value: function () {
                var link = this
                  , domainValue = link.baseValue * ( link.domainAuthority / 100 + 1 );

                if(link.equitable) {
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
                return parseUri(link.url);
            }
        };

        return ContentLink
    })
    .factory('ContentPiece', function(ContentLink) {
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

        function mergeByProperty(arr1, arr2, prop) {
            _.each(arr2, function(arr2obj) {
                var arr1obj = _.find(arr1, function(arr1obj) {
                    return arr1obj[prop] === arr2obj[prop];
                });

                arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
            });
        }

        function lfBitFlag(input) {
            var bitflag = input;
            while(bitflag > 1) {
                bitflag -= nearestPow2(bitflag);
            }
            return (bitflag === 1) ? true : false;
        }

        function nearestPow2(aSize) {
            return Math.pow(2, Math.ceil(Math.log(aSize) / Math.log(2)));
        }

        ////////////////////
        /// Configuration
        ////////////////////

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

                for (var prop in arguments[0]) {
                    content[prop] = arguments[0][prop];
                }
            },

            get: {
                links: function(callback) {
                    $.ajax({
                        url: "mozapi.php",
                        type: "POST",
                        data: {
                            url: "/links/" + encodeURIComponent(content.url)
                                + "?"
                                + "&Scope=page_to_page"
                                + "&Sort=domain_authority"
                                + "&Filter=equity"
                                /**********
                                *
                                    nonequity
                                        any of these attributes specified: nofollow, meta-nofollow, offscreen, 302 or an RSS feed
                                    equity
                                        not classified as non-equity, including followed links and 301 (permanent) redirects.
                                *
                                ***********/
                                + "&LinkCols=2" // Flags full of data on each link
                                + "&TargetCols=32" // No. of links
                                + "&SourceCols=" + (4 + 68719476736) // Canon URL + DA of source
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
                        content.equitableLinkCount = links[0].luueid;

                        _.each(links, function(link) {
                            var linkObject = new ContentLink({
                                title: link.ut,
                                url: link.uu,
                                equitable: !lfBitFlag(link.lf),
                                domainAuthority: link.pda,
                                known: false,
                                relevant: true
                            })
                            content.links.push(linkObject)
                        })

                        if (content.knownLinks.length > 0) {
                            mergeInKnownLinks(callback);
                        } else {
                            if (typeof callback == 'function') callback(content.links);
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
                                array: content.knownLinks
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
                                mergeByProperty(content.links, knownLinksData, 'url');

                                if (typeof callback == 'function') callback(content.links);
                            }
                        });
                    }
                },

                social: function(callback) {
                    $.sharedCount(content.url, function(data) {
                        content.shares = {
                            twitter:      { icon: "fa fa-twitter", importance: 1, name: "Twitter mentions", count: data.Twitter },
                            facebook:     { icon: "fa fa-facebook", importance: 1, name: "Facebook likes/shares", count: data.Facebook.like_count + data.Facebook.share_count },
                            google:       { icon: "fa fa-google", importance: 1, name: "Google +1s", count: data.GooglePlusOne },
                            other:        { icon: "fa fa-share-alt", importance: 1, name: "Other mentions/shares", count: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon },
                            buzz:         { icon: "fa fa-arrow-circle-up", importance: 2, name: "Buzzfeed", count: data.Buzz },
                            delicious:    { icon: "fa fa-delicious", importance: 2, name: "Delicious", count: data.Delicious },
                            linkedin:     { icon: "fa fa-linkedin", importance: 2, name: "LinkedIn", count: data.LinkedIn },
                            pinterest:    { icon: "fa fa-pinterest", importance: 2, name: "Pinterest", count: data.Pinterest },
                            reddit:       { icon: "fa fa-reddit", importance: 2, name: "Reddit", count: data.Reddit },
                            stumbleupon:  { icon: "fa fa-stumbleupon", importance: 2, name: "StumbleUpon", count: data.StumbleUpon }
                        };
                        if (typeof callback == 'function') {
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
                    if (typeof medium != 'undefined') {
                        return content.shares[medium].count * (
                            (typeof content.prices[medium] != 'undefined') ? content.prices[medium] : content.prices.other
                        )
                    } else {
                        return (content.shares.twitter.count * content.prices.twitter)
                            +  (content.shares.facebook.count * content.prices.facebook)
                            +  (content.shares.google.count * content.prices.google)
                            +  (content.shares.other.count * content.prices.other)
                    }
                },

                cost: function() { //£
                    return content.billableHours * content.costPerHour;
                },

                value: function() { //£
                    return ContentPiece.info.linkValue() + ContentPiece.info.socialValue();
                },

                profitloss: function() { //£
                    return ContentPiece.info.value() - ContentPiece.info.cost()
                },

                // Informative summary calcs

                averageDA: function() {
                    return _.reduce(content.links, function(stored, margin) {
                        return stored + margin.domainAuthority;
                    }, 0) / content.links.length;
                },

                socialCount: function() {
                    return _.reduce(content.shares, function(a, b) {
                        return a + b.count;
                    }, 0)
                },

                linkCount: function() {
                    return _.countBy(content.links, function(link) {
                        return link.relevant ? 'relevant' : 'nonrelevant';
                    });
                }
            }
        };

        return ContentPiece;
    });
