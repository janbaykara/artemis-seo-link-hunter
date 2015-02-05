_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\{#(.+?)#\}/gim
};

var sharedCount = {
    "key": "a96a4b17c9e761a475cc28a1731c8dc96ff7c6aa",
    "url": "//free.sharedcount.com"
}

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

var ContentLink = function() {
    this.url = "";
    this.domainAuthority = 0;
    this.known = false;
    this.relevant = true;
    this.baseValue = 150;

    for(var prop in arguments[0])   {
        this[prop] = arguments[0][prop];
    }
}
ContentLink.prototype = {
    value: function () {
        var link = this;

        return link.relevant ?
            link.baseValue * ( link.domainAuthority / 100 + 1 ) + 10 :
            link.baseValue * ( link.domainAuthority / 100 + 1 ) - 50
    },
}

var ContentPiece = function() {
    this.name = "";
    this.url = "";
    this.billableHours = 0;
    this.links = [];
    this.shares = {};
    this.costPerHour = 75;//£

    for(var prop in arguments[0])   {
        this[prop] = arguments[0][prop];
    }
}
ContentPiece.prototype = {
    getLinks: function (callback) {
        var content = this;
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
        var content = this;
        $.sharedCount(this.url, function(data){
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
        var content = this;
        return (content.shares.twitter * 0.25)
             + (content.shares.facebook * 0.25)
             + (content.shares.google * 0.4)
             + (content.shares.other * 0.15)
    },

    cost: function() {
        var content = this; //£
        return content.billableHours * content.costPerHour;
    },

    value: function (callback) {
        var content = this;
        return content.linkValue() + content.socialValue();
    },

    earnings: function (billableHours, contentValue) {
        var content = this; //£
        return content.value() - content.cost()
    }
}

//
$(document).ready(function() {
    var _results = _.template($("#results").html());

    $("#btn-hunt-links").on('click', function() {
        // var contentPiece = new ContentPiece({
        //     name: $("#input-content-name").val(),
        //     url: $("#input-content-url").val(),
        //     billableHours: $("#input-content-hours").val()
        // });
        // contentPiece.getLinks(function(links){
        //     contentPiece.getSocial(function(shares){
            var contentPiece = {"name":"9001 Reasons Why I'm Voting UKIP","url":"http://www.appliancecity.co.uk/chilli/","billableHours":"15","links":[{"url":"visual.ly/periodic-table-worlds-hottest-chillis","domainAuthority":86.75191225648942,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/beer","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/creativity-101","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/the-auberge-handfield","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/Stibo","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/edwinbinary","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/tetra-pak-uht-milk","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/pausa","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/house-price-trendometer","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/miportfolio-responsive-one-page-creative-theme","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/jesserichards-com","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/saijo-s-curated-marketing-tools","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/beer?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/xhtmlchop","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/creativity-101?subsection=all","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/tetra-pak-uht-milk?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/hidden-wounds?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/sweet-delicious-vegetables-with-le-creuset?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/zywiec-the-verse?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.awwwards.com/best-websites/13-9-dia-do-baralho?subsection=open","domainAuthority":82.10075883518978,"known":false,"relevant":true,"baseValue":150},{"url":"www.thespicehouse.com/spices-by-category/chiles","domainAuthority":55.30671509220559,"known":false,"relevant":true,"baseValue":150},{"url":"infographicjournal.com/hottest-chillis-in-the-world/","domainAuthority":42.655840624517225,"known":false,"relevant":true,"baseValue":150},{"url":"wtfviz.net/post/89272698800/chilly-chillis","domainAuthority":41.34480508918695,"known":false,"relevant":true,"baseValue":150},{"url":"www.cocinillas.es/2014/12/como-se-mide-el-picante-escala-scoville/","domainAuthority":38.26196225992646,"known":false,"relevant":true,"baseValue":150},{"url":"www.scottrobertsweb.com/interactive-periodic-table-of-the-worlds-hottest-chile-peppers/","domainAuthority":37.18224658920168,"known":false,"relevant":true,"baseValue":150},{"url":"www.scottrobertsweb.com/page/4/","domainAuthority":37.18224658920168,"known":false,"relevant":true,"baseValue":150},{"url":"www.scottrobertsweb.com/page/3/","domainAuthority":37.18224658920168,"known":false,"relevant":true,"baseValue":150},{"url":"www.scottrobertsweb.com/page/2/","domainAuthority":37.18224658920168,"known":false,"relevant":true,"baseValue":150},{"url":"www.scottrobertsweb.com/page/6/","domainAuthority":37.18224658920168,"known":false,"relevant":true,"baseValue":150},{"url":"srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako","domainAuthority":32.21940185857237,"known":false,"relevant":true,"baseValue":150},{"url":"www.srednja.hr/Novosti/Jeste-li-znali/Ljuta-hrana-odlicno-djeluje-na-vase-tijelo-i-liniju-doznajte-kako","domainAuthority":32.21940185857237,"known":false,"relevant":true,"baseValue":150},{"url":"www.alyssaandcarla.com/2014/05/30/weekly-love-letter-may-30th-2014/","domainAuthority":31.837376148018624,"known":false,"relevant":true,"baseValue":150},{"url":"www.alyssaandcarla.com/category/carla/page/2/","domainAuthority":31.837376148018624,"known":false,"relevant":true,"baseValue":150},{"url":"www.appliancecity.co.uk/chilli/","domainAuthority":30.973347828841515,"known":false,"relevant":true,"baseValue":150},{"url":"www.appliancecity.co.uk/chilli","domainAuthority":30.973347828841515,"known":false,"relevant":true,"baseValue":150},{"url":"visitresponsivewebsites.com/tag/graphic-design","domainAuthority":19.59692071890584,"known":false,"relevant":true,"baseValue":150},{"url":"visitresponsivewebsites.com/tag/single-page","domainAuthority":19.59692071890584,"known":false,"relevant":true,"baseValue":150},{"url":"vcb.bz/kpx","domainAuthority":15.314589405272383,"known":false,"relevant":true,"baseValue":150}],"shares":{"twitter":70,"facebook":58,"google":6,"other":6},"costPerHour":75};
                console.log(contentPiece);
                $("#results").html(_results(contentPiece))
        //     });
        // });
    })
});