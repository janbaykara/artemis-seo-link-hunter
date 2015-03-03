<?php
$objectURL = $_GET['url'];
$batchedData = $_GET['array'];
if(isset($batchedData)) {
    $encodedData = json_encode($batchedData);
}
/**
*/
$accessID = "member-c585999055";
$secretKey = "676396e4e393d3ec091fe91a2bd41eee";
/*
**/

// Set your expires for five minutes into the future.
$expires = time() + 300;
// A new linefeed is necessary between your AccessID and Expires.
$stringToSign = $accessID."\n".$expires;
// Get the "raw" or binary output of the hmac hash.
$binarySignature = hash_hmac('sha1', $stringToSign, $secretKey, true);
// We need to base64-encode it and then url-encode that.
$urlSafeSignature = urlencode(base64_encode($binarySignature));

// Now put your entire request together.
// This example uses the Mozscape URL Metrics API.
$requestUrl = "http://lsapi.seomoz.com/linkscape".$objectURL."&AccessID=".$accessID."&Expires=".$expires."&Signature=".$urlSafeSignature;

// We can easily use Curl to send off our request.
$options = array(
    CURLOPT_RETURNTRANSFER => true
);
if($encodedData) { $options[CURLOPT_POSTFIELDS] = $encodedData; }

$ch = curl_init($requestUrl);
curl_setopt_array($ch, $options);
$content = curl_exec($ch);
curl_close($ch);
//

echo $content;

?>