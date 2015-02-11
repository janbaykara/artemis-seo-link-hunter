angular.module("artemis")
    .factory('ContentPiece', function() {
        var init = false;

        var content = {
            name: "",
            url: "",
            billableHours: 0,
            links: [],
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
                for(var prop in arguments[0])   {
                    content[prop] = arguments[0][prop];
                }
            },

            get: {
                links: function (callback) {
                    var linksForURLapi = "/links/"
                        +encodeURIComponent(content.url)
                        +"?"
                        +"&Scope=page_to_page"
                        +"&Sort=domain_authority"
                        +"&Filter=equity" // links with equity
                        +"&LinkCols=4" // Flags full of data on each link
                        +"&TargetCols=256" // No. of links
                        +"&SourceCols="+(4+16+68719476736) // URL + DA of source
                        +"&Limit=50";

                    $.ajax({
                        url: "mozapi.php",
                        type: "POST",
                        data: {url:linksForURLapi},
                        error: function (msg) {console.warn(msg);},
                        success: function(res){
                            var links = JSON.parse(res);
                            _.each(links, function(link) {
                                var linkObject = new ContentLink({
                                    url: link.uu,
                                    root: link.upl,
                                    domainAuthority: link.pda,
                                    known: false,
                                    relevant: true}
                                );
                                content.links.push(linkObject)
                            })
                            if(typeof callback == 'function') {
                                callback(content.links);
                            }
                        }
                    });
                },

                social: function(callback) {
                    $.sharedCount(content.url, function(data){
                        content.shares = {
                            twitter: data.Twitter,
                            facebook: data.Facebook.like_count + data.Facebook.share_count,
                            google: data.GooglePlusOne,
                            other: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon,
                            // Other shit
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
                        if(_.any(['twitter','facebook','google'],function(x) { return x == medium } ))
                            return content.shares[medium] * content.prices[medium]
                        else
                            return content.shares[medium] * content.prices.other;
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