<?php

$objectURL = $_POST['url'];
$accessID = "member-c585999055";
$secretKey = "s0624tGTJzfnvRUi09quKC2q0ko%3D";
$expires = 1422625775;
$urlToFetch = "http://lsapi.seomoz.com/linkscape".$objectURL."&AccessID=$accessID&Expires=$expires&Signature=$secretKey";
echo $urlToFetch;
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_URL, $urlToFetch);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// $contents = curl_exec($ch);
// curl_close($ch);

// echo $contents;

?>