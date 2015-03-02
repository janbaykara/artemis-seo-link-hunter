<!DOCTYPE html>
<html lang='en-gb' ng-app='artemis'>
<head>
    <meta charset="utf-8">
    <base href="/playground/boom/artemis/">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ARTEMIS Link Hunter</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
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
        <div ui-view='app'></div>
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