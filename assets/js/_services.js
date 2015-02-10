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
            },
            // Mock data
            name:"9001 Reasons Why I'm Voting UKIP",url:"http://www.appliancecity.co.uk/chilli/",billableHours:"15",links:[{url:"visual.ly/periodic-table-worlds-hottest-chillis",domainAuthority:86.75191225648942,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/beer",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/creativity-101",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/the-auberge-handfield",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/Stibo",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/edwinbinary",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/tetra-pak-uht-milk",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/pausa",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/house-price-trendometer",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/miportfolio-responsive-one-page-creative-theme",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/jesserichards-com",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/saijo-s-curated-marketing-tools",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/beer?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/xhtmlchop",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/creativity-101?subsection=all",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/tetra-pak-uht-milk?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/hidden-wounds?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/sweet-delicious-vegetables-with-le-creuset?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/zywiec-the-verse?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/13-9-dia-do-baralho?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.thespicehouse.com/spices-by-category/chiles",domainAuthority:55.30671509220559,known:!1,relevant:!0,baseValue:150},{url:"infographicjournal.com/hottest-chillis-in-the-world/",domainAuthority:42.655840624517225,known:!1,relevant:!0,baseValue:150},{url:"wtfviz.net/post/89272698800/chilly-chillis",domainAuthority:41.34480508918695,known:!1,relevant:!0,baseValue:150},{url:"www.cocinillas.es/2014/12/como-se-mide-el-picante-escala-scoville/",domainAuthority:38.26196225992646,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/interactive-periodic-table-of-the-worlds-hottest-chile-peppers/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/4/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/3/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/2/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/6/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako",domainAuthority:32.21940185857237,known:!1,relevant:!0,baseValue:150},{url:"www.srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako",domainAuthority:32.21940185857237,known:!1,relevant:!0,baseValue:150},{url:"www.alyssaandcarla.com/2014/05/30/weekly-love-letter-may-30th-2014/",domainAuthority:31.837376148018624,known:!1,relevant:!0,baseValue:150},{url:"www.alyssaandcarla.com/category/carla/page/2/",domainAuthority:31.837376148018624,known:!1,relevant:!0,baseValue:150},{url:"www.appliancecity.co.uk/chilli/",domainAuthority:30.973347828841515,known:!1,relevant:!0,baseValue:150},{url:"www.appliancecity.co.uk/chilli",domainAuthority:30.973347828841515,known:!1,relevant:!0,baseValue:150},{url:"visitresponsivewebsites.com/tag/graphic-design",domainAuthority:19.59692071890584,known:!1,relevant:!0,baseValue:150},{url:"visitresponsivewebsites.com/tag/single-page",domainAuthority:19.59692071890584,known:!1,relevant:!0,baseValue:150},{url:"vcb.bz/kpx",domainAuthority:15.314589405272383,known:!1,relevant:!0,baseValue:150}],shares:{twitter:70,facebook:58,google:6,other:6},costPerHour:75
        };

        return {
            data: content,

            new: function() {
                for(var prop in arguments[0])   {
                    content[prop] = arguments[0][prop];
                }
            },

            getLinks: function (callback) {
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
                        if(callback) callback(content.links);
                    }
                });
            },

            getSocial: function(callback) {
                sharedCount(this.url, function(data){
                    content.shares = {
                        twitter: data.Twitter,
                        facebook: data.Facebook.like_count + data.Facebook.share_count,
                        google: data.GooglePlusOne,
                        other: data.Buzz + data.Delicious + data.LinkedIn + data.Pinterest + data.Reddit + data.StumbleUpon
                    };
                    if(callback) callback(content.shares);
                });
            },

            linkValue: function() {
                var content = this
                  , totalLinkValue = 0;

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
                return content.linkValue() + content.socialValue();
            },

            earnings: function (billableHours, contentValue) { //£
                return content.value() - content.cost()
            }
        };
    });