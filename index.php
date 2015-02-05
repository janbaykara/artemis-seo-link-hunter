<!DOCTYPE html>
<html lang='en-gb'>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ARTEMIS Link Hunter</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel='stylesheet' href='public/css/app.min.css' />
    <script>
        _.templateSettings = {
          interpolate: /\{\{(.+?)\}\}/g
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

    </script>

    <style>
        body{
           min-width:1000px; /* suppose you want minimun width of 1000px */
           width: auto !important;  /* Firefox will set width as auto */
           width:1000px;             /* As IE ignores !important it will set width as 1000px; */
        }
    </style>
    <link rel='stylesheet' href='../global/public/css/app.min.css' />
</head>
<body>
    <?php include '../global/header.php'; ?>

    <div class='container'>
        <div class='row'>
            <div class='col-md-12'>
                <h1>ARTEMIS Link Hunter
                    <small>a.k.a. Waynebot 1000</small>
                </h1>
                <p class='wiki-def'>In the classical period of Greek mythology, <strong>Artemis</strong> (Ancient Greek: Ἄρτεμις) was goddess of the hunt, wild animals, wilderness, childbirth, virginity and protector of young girls, bringing and relieving disease in women; she often was depicted as a huntress carrying a bow and arrows. The deer and the cypress were sacred to her.</p>
            </div>
        </div>

        <div class='row' id='phase-1'>
            <div class='col-md-12'>
                <h2>Your content piece</h2>
            </div>
        </div>

        <div class='row'>
            <div class="form-group col-md-9">
                <label for="input-content-title">Title</label>
                <input type="text" class="form-control" id="input-content-name" placeholder="Content name" value="9001 Reasons Why I'm Voting UKIP" />
            </div>
            <div class="form-group col-md-3">
                <label for="input-content-hours">Billable hours</label>
                <input type="number" class="form-control" id="input-content-hours" placeholder="0" value='15' />
            </div>
        </div>

        <div class='row'>
            <div class='col-md-6'>
                <div class="form-group">
                    <label for="input-content-url">Content's URL</label>
                    <input type="url" class="form-control" id="input-content-url" placeholder="Content URL" value='http://www.appliancecity.co.uk/chilli/' />
                </div>
            </div>
            <div class='col-md-6'>
                <div class="form-group">
                    <label for="input-content-links">Known external links</label>
                    <textarea class="form-control" rows="3" id="input-content-links" placeholder='List of known URLs, one per line'></textarea>
                </div>
            </div>
        </div>

        <div class='row'>
            <div class='col-md-12'>
                <button id='btn-hunt-links' type="button" class="btn btn-primary btn-lg btn-block">Analyse this content</button>
            </div>
        </div>

        <hr>
        <div class='row' id='phase-2'>
            <div class='col-md-12'>
                <h2>Analysis</h2>
            </div>
            <div class='col-md-12' id='results'>
                <h3>Name: {{name}}</h3>
                {{links}}
            </div>
        </div>

    </div>

    <footer class='container'>
        <div class='row'>
            <div class='col-md-12'>2015 &copy; Boom</div>
        </div>
    </footer>

    <script src="public/js/libs.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="public/js/app.min.js"></script>
</body>
</html>