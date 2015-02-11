var ContentLink = function() {
    this.url = "";
    this.domainAuthority = 0;
    this.known = false;
    this.relevant = true;
    this.equitable = false;
    this.baseValue = 150;
    this.irrelevantLinkModifier = -50;
    this.relevantLinkModifier = 10;

    for(var prop in arguments[0])   {
        this[prop] = arguments[0][prop];
    }
}
ContentLink.prototype = {
    value: function () {
        var link = this
          , domainValue = link.baseValue * ( link.domainAuthority / 100 + 1 );

        if(link.equitable) {
            console.log(link.url,link.equitable,"This HAS value");
            var value = link.relevant
                    ? domainValue + link.relevantLinkModifier
                    : domainValue + link.irrelevantLinkModifier
        } else {
            var value = 0;
            console.log(link.url,link.equitable,"NOT EQUITABLE value");
        }

        return value;
    },
}