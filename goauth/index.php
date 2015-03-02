<?php
/*
https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=696947788101-j3ak6sd69ic5t4bc869pkugeochfsfg6.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/analytics.readonly&redirect_uri=http://www.boom-online.co.uk/playground/boom/artemis/
*/
?>
<!DOCTYPE html>
<html>
<head>
    <title>Google Auth</title>
</head>
<body>
<script>
    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    // console.log(params);

    window.opener.authParams(params);
    window.close();
    //-> Object {access_token: "ya29.KgGoh6CXO962e-ktjvn-4dPiOucWLsMt1l0KKHkqjniEZ3hYh0FfRf-2XlBm3pqNhSWovyIxIsTNjw", token_type: "Bearer", expires_in: "3600"}

    // And send the token over to the server
    // var req = new XMLHttpRequest();
    // // consider using POST so query isn't logged
    // req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);

    // req.onreadystatechange = function (e) {
    //   if (req.readyState == 4) {
    //      if(req.status == 200){
    //        window.location = params['state']
    //    }
    //   else if(req.status == 400) {
    //         alert('There was an error processing the token.')
    //     }
    //     else {
    //       alert('something else other than 200 was returned')
    //     }
    //   }
    // };
    // req.send(null);
</script>
</body>
</html>