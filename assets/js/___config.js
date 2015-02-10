_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\{#(.+?)#\}/gim
};

var sharedCount = {
    "key": "a96a4b17c9e761a475cc28a1731c8dc96ff7c6aa",
    "url": "//free.sharedcount.com"
}

angular.module('alchemy', ['ui.router', 'ui.bootstrap', 'ui.router.tabs'])
    .config(function($stateProvider,$urlRouterProvider,$httpProvider) {

        $stateProvider
            .state('app', {
                url: "",
                abstract: true,
                views: {
                    "app": {
                        templateUrl: "partials/app.html",
                        controller: 'app'
                    }
                }
            })
            .state('app.input', {
                url: "/",
                views: {
                    "main": {
                        templateUrl: "partials/app.input.html",
                        controller: 'input'
                    }
                }
            })
            .state('app.output', {
                url: "/output",
                abstract: true,
                views: {
                    "main": {
                        templateUrl: "partials/app.output.html",
                        controller: 'output'
                    }
                }
            })
            .state('app.output.summary', {
                url: "/summary",
                templateUrl: "partials/app.output.summary.html",
                controller: 'summary'
            })
            .state('app.output.links', {
                url: "/links",
                templateUrl: "partials/app.output.links.html",
                controller: 'links'
            })
            .state('app.output.social', {
                url: "/social",
                templateUrl: "partials/app.output.social.html",
                controller: 'social'
            })

            $urlRouterProvider.otherwise("/");
    })