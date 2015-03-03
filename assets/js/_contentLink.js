angular.module("artemis-content")
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
            this.domainRepresentative = true;
            this.equitable = true;
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

                if(link.equitable && this.domainRepresentative) {
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
                    console.log("Retrieving from stored.")
                        if (typeof callback == 'function')
                            callback(link.shares);
                        else return link.shares;
                }
            }
        };

        return ContentLink
    })