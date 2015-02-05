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
                <ul>
                {# _.each(links, function(link) { #}
                    <li>{{ link.url }}</li>
                {# }) #}
                </ul>
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