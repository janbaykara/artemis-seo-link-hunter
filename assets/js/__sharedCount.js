var sharedCount = function(url, fn) {
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