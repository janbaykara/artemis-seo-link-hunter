var ContentPiece = function() {
    this.name = "";
    this.url = "";
    this.billableHours = 0;
    this.links = [];
    this.shares = {};
    this.costPerHour = 75;//£
    this.prices = {
        twitter * 0.25,
        facebook * 0.25,
        google * 0.4,
        other * 0.15
    };

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
        return (content.shares.twitter * content.prices.twitter)
             + (content.shares.facebook * content.prices.facebook)
             + (content.shares.google * content.prices.google)
             + (content.shares.other * content.prices.other)
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