angular.module('alchemy', ['ui.router'])
    .config(function($httpProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('app', {
                url: "",
                templateUrl: "partials/app.html",
                abstract: true,
                controller: 'app'
            })
            .state('app.analyser', {
                url: "/",
                templateUrl: "partials/app.analyser.html",
                controller: 'analyser'
            })
            .state('app.results', {
                url: "/results",
                templateUrl: "partials/app.results.html",
                abstract: true,
                controller: 'results'
            })
            .state('app.results.summary', {
                url: "/summary",
                templateUrl: "partials/app.results.summary.html",
                controller: 'resultsSummary'
            })
            .state('app.results.links', {
                url: "/links",
                templateUrl: "partials/app.results.links.html",
                controller: 'resultsLinks'
            })
            .state('app.results.social', {
                url: "/social",
                templateUrl: "partials/app.results.social.html",
                controller: 'resultsSocial'
            })
    })
    .controller('app', function($scope, $http) {
        // var _results = _.template($("#results").html());
        // $("#results").html(_results(contentPiece))
    })
    .controller('analyser', function($scope) {
        // $("#btn-hunt-links").on('click', function() {
            // var contentPiece = new ContentPiece({
            //     name: $("#input-content-name").val(),
            //     url: $("#input-content-url").val(),
            //     billableHours: $("#input-content-hours").val()
            // });
            // contentPiece.getLinks(function(links) {
            //     contentPiece.getSocial(function(shares) {
                var contentPiece={name:"9001 Reasons Why I'm Voting UKIP",url:"http://www.appliancecity.co.uk/chilli/",billableHours:"15",links:[{url:"visual.ly/periodic-table-worlds-hottest-chillis",domainAuthority:86.75191225648942,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/beer",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/creativity-101",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/the-auberge-handfield",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/Stibo",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/edwinbinary",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/tetra-pak-uht-milk",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/pausa",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/house-price-trendometer",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/miportfolio-responsive-one-page-creative-theme",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/jesserichards-com",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/saijo-s-curated-marketing-tools",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/beer?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/xhtmlchop",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/creativity-101?subsection=all",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/tetra-pak-uht-milk?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/hidden-wounds?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/sweet-delicious-vegetables-with-le-creuset?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/zywiec-the-verse?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.awwwards.com/best-websites/13-9-dia-do-baralho?subsection=open",domainAuthority:82.10075883518978,known:!1,relevant:!0,baseValue:150},{url:"www.thespicehouse.com/spices-by-category/chiles",domainAuthority:55.30671509220559,known:!1,relevant:!0,baseValue:150},{url:"infographicjournal.com/hottest-chillis-in-the-world/",domainAuthority:42.655840624517225,known:!1,relevant:!0,baseValue:150},{url:"wtfviz.net/post/89272698800/chilly-chillis",domainAuthority:41.34480508918695,known:!1,relevant:!0,baseValue:150},{url:"www.cocinillas.es/2014/12/como-se-mide-el-picante-escala-scoville/",domainAuthority:38.26196225992646,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/interactive-periodic-table-of-the-worlds-hottest-chile-peppers/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/4/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/3/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/2/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"www.scottrobertsweb.com/page/6/",domainAuthority:37.18224658920168,known:!1,relevant:!0,baseValue:150},{url:"srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako",domainAuthority:32.21940185857237,known:!1,relevant:!0,baseValue:150},{url:"www.srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako",domainAuthority:32.21940185857237,known:!1,relevant:!0,baseValue:150},{url:"www.alyssaandcarla.com/2014/05/30/weekly-love-letter-may-30th-2014/",domainAuthority:31.837376148018624,known:!1,relevant:!0,baseValue:150},{url:"www.alyssaandcarla.com/category/carla/page/2/",domainAuthority:31.837376148018624,known:!1,relevant:!0,baseValue:150},{url:"www.appliancecity.co.uk/chilli/",domainAuthority:30.973347828841515,known:!1,relevant:!0,baseValue:150},{url:"www.appliancecity.co.uk/chilli",domainAuthority:30.973347828841515,known:!1,relevant:!0,baseValue:150},{url:"visitresponsivewebsites.com/tag/graphic-design",domainAuthority:19.59692071890584,known:!1,relevant:!0,baseValue:150},{url:"visitresponsivewebsites.com/tag/single-page",domainAuthority:19.59692071890584,known:!1,relevant:!0,baseValue:150},{url:"vcb.bz/kpx",domainAuthority:15.314589405272383,known:!1,relevant:!0,baseValue:150}],shares:{twitter:70,facebook:58,google:6,other:6},costPerHour:75};
        //         });
        //     });
        // })
    })
    .controller('summary', function($scope) {
        // Summary data analysis
    })
    .controller('links', function($scope) {
        // Link analysis
    })
    .controller('social', function($scope) {
        // Social shares
    })