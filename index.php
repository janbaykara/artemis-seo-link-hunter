<!DOCTYPE html>
<html lang='en-gb'>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ARTEMIS Link Hunter</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.5.0/bootstrap-table.min.css">
    <link rel='stylesheet' href='public/css/app.min.css' />

    <script>
        var mozApi = {
            "accessId": "member-c585999055",
            "secretKey": "79fb24f5736619a2029d7da68fbd88ec",
            // Regen the below with each request
            "expires": "1422625775",
            "signature": "s0624tGTJzfnvRUi09quKC2q0ko=",
            "append": "&AccessID=member-c585999055&Expires=1422625775&Signature=s0624tGTJzfnvRUi09quKC2q0ko%3D"
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

        /*

        // Add to end of each API call
            &AccessID=member-c585999055&Expires=1422625775&Signature=s0624tGTJzfnvRUi09quKC2q0ko%3D

        // URL METRICS
            http://lsapi.seomoz.com/linkscape/url-metrics/moz.com%2fblog?Cols=2048

            http://lsapi.seomoz.com/linkscape
                /url-metrics
                /moz.com
                ?Cols=2048
                &AccessID=member-c585999055
                &Expires=1422625775
                &Signature=s0624tGTJzfnvRUi09quKC2q0ko%3D

        // LINK METRICS
            http://moz.com/help/guides/moz-api/mozscape/api-reference/link-metrics

            http://lsapi.seomoz.com/linkscape/links/moz.com%2fblog?SourceCols=4&TargetCols=4&Scope=page_to_page&Sort=page_authority&SourceDomain=microsoft.com&Limit=1

            http://lsapi.seomoz.com/linkscape
                /links
                /moz.com
                ?
                &Scope=page_to_page
                &Sort=domain_authority
                &Filter=equity // links with equity
                &LinkCols=2 // Flags full of data on each link
                &TargetCols=256 // No. of links
                &SourceCols=68719476736 // DA
                &Limit=50
        */

        //


        var ContentPiece = function() {
            for(var prop in arguments[0])   {
                this[prop] = arguments[0][prop];
            }
        }
        ContentPiece.prototype.getLinks = function () {
            var apiURL = "http://lsapi.seomoz.com/linkscape"
                +"/links/"
                +this.url
                +"?"
                +"&Scope=page_to_page"
                +"&Sort=domain_authority"
                +"&Filter=equity" // links with equity
                +"&LinkCols=2" // Flags full of data on each link
                +"&TargetCols=256" // No. of links
                +"&SourceCols=68719476736" // DA
                +"&Limit=50"
                +"&"+mozApi.append;
                console.log(apiURL)
            // $.ajax(apiURL)
            // .success(function(data) {
            //     console.log(data);
            // });

            $.ajax({
                url: apiURL,
                dataType: 'jsonp',
                jsonp: 'jsonp',
                type: "post",
                success: function(res) {
                    console.log(res)
                }
            });
        }
        ContentPiece.prototype.getSocial = function() {
            $.sharedCount(this.url, function(data){
                console.log(data);
            });
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

        //

        $(document).ready(function() {
            $("#btn-hunt-links").on('click', function() {
                var contentPiece = new ContentPiece({
                    name: $("#input-content-name").val(),
                    url: $("#input-content-url").val(),
                    billableHours: $("#input-content-hours").val()
                });
                contentPiece.getLinks();
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