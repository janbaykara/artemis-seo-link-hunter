//////////////////////
/// Services
//////////////////////

angular.module("artemis-content")
    .factory('ContentPiece', function(ContentLink,ContentShares,Utils) {
        var init = false
          , ContentPiece = {};

        ContentPiece = {

            initialised: function() {
                return init;
            },

            new: function() {
                init = true;

                // Form today's YYYY-MM-DD date
                function pad(n){return n<10 ? '0'+n : n}
                var d = new Date();
                var dd = pad(d.getDate());
                var mm = pad(d.getMonth()+1);
                var yyyy = d.getFullYear();
                var dateToday = yyyy+"-"+mm+"-"+dd;

                ContentPiece.data = {
                    name: "",
                    url: "",
                    billableHours: 0,
                    links: [],
                    knownLinks: [],
                    shares: {},
                    costPerHour: 75,
                    dateFrom: "2005-01-01",
                    dateTo: dateToday,
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
                    if(ContentPiece.data.links.length < 1 && typeof callback == 'function')
                        return callback(ContentPiece.stats.secondarySocialCombined);

                    _.each(ContentPiece.data.links, function(link,i) {
                        link.social(function() {
                            if(i+1== ContentPiece.data.links.length) {
                                // _.each(ContentPiece.data.links, function(link) {
                                //     console.log(link.url,link.social().facebook.count);
                                // })
                                ContentPiece.stats.secondarySocialCombined =
                                    _.reduce(ContentPiece.data.links, function(sum, nextLink) {
                                        for (var medium in nextLink.shares) {
                                            nextLink.shares[medium].count += (typeof sum[medium] != 'undefined') ? sum[medium].count : 0;
                                            sum[medium] = _.clone(nextLink.shares[medium]);
                                        }
                                        return sum;
                                    }, {});

                                if (typeof callback == 'function') callback(ContentPiece.stats.secondarySocialCombined);
                            }
                        });
                    });
                },

                links: function(callback) {

                    // Get info on this link.
                    $.ajax({
                        url: "php/mozapi.php",
                        type: "POST",
                        data: {
                            url: "/links/" + encodeURIComponent(ContentPiece.data.url)
                                + "?"
                                + "Scope=page_to_page"
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
                            var links = JSON.parse(res)
                              , havePageData = true;
                            if(links.length == 0) havePageData = false
                            onReceiveLinks(havePageData,links);
                        }
                    });

                    // Once page data is received, trawl through the links
                    function onReceiveLinks(havePageData,links) {
                        ContentPiece.data.equitableLinkCount = (links.length > 0) ? links[0].luueid : 0;

                        // If MOZ data exists for this page
                        // then analyse each of the links automatically found
                        if(havePageData) {
                            console.log("Fetched %i new links",links.length)
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
                        } else {
                            console.log("Could not fetch any new links")
                        }

                        if(ContentPiece.data.knownLinks.length > 0) {
                            console.log("Getting data on %i previously known links.",ContentPiece.data.knownLinks.length)
                            mergeInKnownLinks(havePageData,eliminateDuplicates);
                        } else {
                            console.log("Was not provided with any known links");
                            eliminateDuplicates();
                        }
                    }

                    function mergeInKnownLinks(havePageData,cb) {

                        var knownLinkDomains = havePageData ?
                                                // Use pages as input
                                                ContentPiece.data.knownLinks
                                                // Or else get the root domains of the input pages
                                                : _.map(ContentPiece.data.knownLinks, function(link) {
                                                    return Utils.parseUri(link).authority;
                                                });

                        $.ajax({
                            url: "php/mozapi.php",
                            type: "POST",
                            data: {
                                url: "/url-metrics/"
                                   + "?"
                                   + "Cols="+(4 + 68719476736), // Canon URL + DA of source,
                                array:  knownLinkDomains
                            },
                            error: function(msg) {
                                console.warn(msg);
                                cb();
                            },
                            success: function(res) {
                                var links = JSON.parse(res);
                                links = _.filter(links, function(link) { return link.uu.length > 5 });
                                var knownLinksData = [];

                                // Turn into propa links
                                _.each(links, function(link) {
                                    if(link.length === 0) return false;

                                    var url = _.find(ContentPiece.data.knownLinks, function(known) {
                                                    if(known.length < 6) { return false; }
                                                    var verdict =  link.uu.indexOf(known) > -1
                                                                || known.indexOf(link.uu) > -1;
                                                    return verdict;
                                                }) || link.uu;
                                    console.log(url,typeof link.uu)
                                    if(typeof url != 'undefined') {
                                        var linkObject = new ContentLink({
                                            title: link.ut,
                                            url: url,
                                            equitable: !Utils.lfBitFlag(link.lf),
                                            domainAuthority: link.pda,
                                            known: true,
                                            relevant: true
                                        });
                                        knownLinksData.push(linkObject)
                                    };
                                });

                                // Merge into found links dataset
                                Utils.mergeByProperty(ContentPiece.data.links,knownLinksData,'url');

                                cb();
                            }
                        });
                    }

                    function eliminateDuplicates() {
                        // Ensure there are no multiple checked URLs per domain
                        _.each(ContentPiece.data.links, function(link) {
                            if(link.domainRepresentative) {
                                _.each(ContentPiece.data.links, function(otherLink) {
                                    if( link.domain == otherLink.domain && link.url != otherLink.url )
                                        otherLink.domainRepresentative = false;
                                });
                            }
                        })

                        // Dun.
                        if (typeof callback == 'function') callback(ContentPiece.data.links);
                    }
                },
            },

            buzzstreamLinks: function(options) {
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
            },

            stats: {

                //////////////////////
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


                ////////////////////////////
                // Informative summary calcs

                averageDA: function() {
                    var nUsefulLinks = 0
                      , aggregateDA = _.reduce(ContentPiece.data.links, function(stored, margin) {
                                            if(margin.equitable && margin.domainRepresentative) {
                                                nUsefulLinks++;
                                                return stored + margin.domainAuthority;
                                            } else return stored;
                                        }, 0);
                    return aggregateDA / nUsefulLinks;
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

                usefulLinkCount: function() {
                    return _.filter(ContentPiece.data.links, function(link) {
                        return (link.domainRepresentative && link.equitable);
                    }).length;
                }
            }
        };

        return ContentPiece;
    })