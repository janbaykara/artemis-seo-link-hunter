<?
// 'https://api.buzzstream.com/v1/links?linking_to='+$scope.newPiece.url

#OAuth library available at http://oauth.googlecode.com/svn/code/php/OAuth.php
include_once "OAuth.php";

$consumer_key = $_GET['key'];
$consumer_secret = $_GET['secret'];
$base_url = $_GET['url'];

#Create a consumer for the buzzstream api
$consumer = new OAuthConsumer($consumer_key, $consumer_secret);

#From the consumer create and sign a request object for 2leg authentication
$request = OAuthRequest::from_consumer_and_token($consumer, NULL, "GET", $base_url);
$sig_method = new OAuthSignatureMethod_HMAC_SHA1();
$request->sign_request($sig_method, $consumer, NULL);

#Perform request
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $request->to_url());
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, array($request->to_header()));
$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>