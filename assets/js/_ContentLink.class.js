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