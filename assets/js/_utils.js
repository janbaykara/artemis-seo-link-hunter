angular.module("artemis-content")
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

            cleanArray: function(actual){
              var newArray = new Array();
              for(var i = 0; i<actual.length; i++){
                  if (actual[i]){
                    newArray.push(actual[i]);
                }
              }
              return newArray;
            },

            popupWindow: function(url, title, w, h) {
              var left = (screen.width/2)-(w/2);
              var top = (screen.height/2)-(h/2);
              return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width='+w+', height='+h+', top='+top+', left='+left);
            },

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