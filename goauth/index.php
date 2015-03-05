<!DOCTYPE html>
<html>
<head>
    <title>Google Auth</title>
</head>
<body>
<script>
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    window.opener.authParams(params);
    window.close();
</script>
</body>
</html>