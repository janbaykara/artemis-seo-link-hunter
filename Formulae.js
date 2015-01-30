# Formulae

### Value of link

function linkValue (nLinks, DA, relevant) {
    return relevant ?
        ( nLinks * 150 ) * (DA / 100 + 1 ) + 10 :
        ( nLinks * 150 ) * (C3 / 100 + 1 ) - 50
}

function contentValue (linksValue, twitterShares, facebookShares, googleShares, otherShares) {
    return linksValue
            + (twitterShares * 0.25)
            + (facebookShares * 0.25)
            + (googleShares * 0.4)
            + (otherShares * 0.15)
}

function ROI (billableHours, contentValue) {
    contentValue - (billableHours * 75)
}

//
//
//

/* arguments = {
    name: string,
    url: string,
    billableHours: integer,
    links: [
       { string "url", bool "known" }
    ],
    shares: {
        "facebook" integer,
        "twitter" integer,
        "google" integer,
        "other" integer
    }
} */

var ContentPiece = function() {
    for(var prop in arguments[0])   {
        this[prop]=arguments[0][prop];
    }
}
ContentPiece.prototype.linkValue = function (nLinks, DA, relevant) {
    return relevant ?
        ( nLinks * 150 ) * (DA / 100 + 1 ) + 10 :
        ( nLinks * 150 ) * (DA / 100 + 1 ) - 50
}
ContentPiece.prototype.contentValue = function (linksValue, twitterShares, facebookShares, googleShares, otherShares) {
    return linksValue
            + (twitterShares * 0.25)
            + (facebookShares * 0.25)
            + (googleShares * 0.4)
            + (otherShares * 0.15)
}
ContentPiece.prototype.ROI = function (billableHours, contentValue) {
    contentValue - (billableHours * 75)
}