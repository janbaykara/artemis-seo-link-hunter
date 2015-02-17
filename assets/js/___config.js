_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\{#(.+?)#\}/gim
};

var sharedCount = {
    "key": "a96a4b17c9e761a475cc28a1731c8dc96ff7c6aa",
    "url": "//free.sharedcount.com"
}

angular.module('artemis', ['ui.router','utils.dataVis','artemis-content'])
    .config(function($stateProvider,$locationProvider,$urlRouterProvider,$httpProvider) {

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
                url: "/input",
                views: {
                    "main": {
                        templateUrl: "partials/app.input.html",
                        controller: 'input'
                    }
                }
            })
            .state('app.output', {
                url: "/output",
                views: {
                    "main": {
                        templateUrl: "partials/app.output.html",
                        controller: 'output'
                    }
                }
            })

            $urlRouterProvider.otherwise("/");
            // $locationProvider.html5Mode(true);
    })
    .run(function($rootScope, $location, $state) {
        // $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            $state.go('app.input');
        // });
    });