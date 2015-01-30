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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.5.0/bootstrap-table.min.css">
    <link rel='stylesheet' href='public/css/app.min.css' />

    <script>
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
                    console.log(data);
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

            value: function (callback) {
                var content = this;
                return content.linkValue() + content.socialValue();
            },

            earnings: function (billableHours, contentValue) {
                var content = this; //£
                return content.value() - (content.billableHours * content.costPerHour)
            },

            cost: function() {
                var content = this; //£
                return content.billableHours * content.costPerHour;
            }
        }

        //

        $(document).ready(function() {
            $("#btn-hunt-links").on('click', function() {
                var contentPiece = new ContentPiece({
                    name: $("#input-content-name").val(),
                    url: $("#input-content-url").val(),
                    billableHours: $("#input-content-hours").val()
                });
                contentPiece.getLinks(function(links){
                    contentPiece.getSocial(function(shares){
                        console.log( contentPiece );
                        console.log( contentPiece.value() );
                        console.log( contentPiece.earnings() );
                    });
                });
            })
        })
    </script>
</head>
<body>

    <?php include '../global/header.php'; ?>

    <div class='container'>
        <div class='row'>
            <div class='col-md-12'>
                <h1>ARTEMIS Link Hunter
                    <small>Do the thing</small>
                </h1>
            </div>
        </div>

        <hr>
        <div class='row' id='phase-1'>
            <div class='col-md-12'>
                <h2>Your content piece</h2>
            </div>
        </div>

        <div class='row'>
            <div class="form-group col-md-9">
                <label for="input-content-title">Title</label>
                <input type="text" class="form-control" id="input-content-title" placeholder="Content name" />
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
                <h2>Looking for other links to this</h2>
            </div>
        </div>

        <hr>
        <div class='row' id='phase-3'>
            <div class='col-md-12'>
                <h2>Looking for other links to this</h2>
            </div>
        </div>

        <hr>
        <div class='row' id='phase-4'>
            <div class='col-md-12'>
                <h2>Analysing links + social shares</h2>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.5.0/bootstrap-table.min.js"></script>
    <script src="public/js/app.min.js"></script>
</body>
</html>