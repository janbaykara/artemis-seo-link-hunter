var ContentLink = function() {
    this.url = "";
    this.root = "";
    this.domainAuthority = 0;
    this.known = false;
    this.relevant = true;
    this.baseValue = 150;
    this.irrelevantLinkModifier = -50;
    this.relevantLinkModifier = 10;

    for(var prop in arguments[0])   {
        this[prop] = arguments[0][prop];
    }
}
ContentLink.prototype = {
    value: function () {
        var link = this;

        return link.relevant ?
            link.baseValue * ( link.domainAuthority / 100 + 1 ) + link.relevantLinkModifier :
            link.baseValue * ( link.domainAuthority / 100 + 1 ) + link.irrelevantLinkModifier
    },
}