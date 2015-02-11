angular.module("alchemy")
    .factory('ContentPiece', function() {
        content = {
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

        var obj = {

            new: function() {
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
                        +"&SourceCols="+(4+68719476736) // URL + DA of source
                        +"&Limit=50";

                    $.ajax({
                        url: "mozapi.php",
                        type: "POST",
                        data: {url:linksForURLapi},
                        error: function (msg) {console.warn(msg);},
                        success: function(res){
                            var links = JSON.parse(res);
                            _.each(links, function(link) {
                                var linkObject = new ContentLink({url: link.uu, domainAuthority: link.pda, known: false, relevant: true });
                                content.links.push(linkObject)
                            })
                            if(typeof callback == 'function') {
                                console.log("get.links(callback)()")
                                callback(content.links);
                            }
                        }
                    });
                },

                social: function(callback) {
                    $.sharedCount(this.url, function(data){
                        content.shares = {
                            twitter: data.Twitter,
                            facebook: data.Facebook.like_count + data.Facebook.share_count,
                            google: data.GooglePlusOne,
                            other: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon
                        };
                        if(typeof callback == 'function') {
                            console.log("get.social(callback)()")
                            callback(content.shares);
                        }
                    });
                }
            },

            info: {
                data: content,

                averageDA: function() {
                    return sumOfDA = _.reduce(content.links, function(stored,margin) {
                        return stored + margin.domainAuthority;
                    },0) / content.links.length;
                },

                linkValue: function() {
                    var totalLinkValue = 0;

                    _.each(content.links, function(link) {
                        totalLinkValue += link.value();
                    });
                    return totalLinkValue;
                },

                socialValue: function() {
                    return (content.shares.twitter * content.prices.twitter)
                         + (content.shares.facebook * content.prices.facebook)
                         + (content.shares.google * content.prices.google)
                         + (content.shares.other * content.prices.other)
                },

                cost: function() { //£
                    return content.billableHours * content.costPerHour;
                },

                value: function (callback) {
                    return obj.info.linkValue() + obj.info.socialValue();
                },

                earnings: function (billableHours, contentValue) { //£
                    return obj.info.value() - obj.info.cost()
                }
            }
        };

        return obj;
    });