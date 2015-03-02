<?php
define('ga_email','jan.baykara@boom-online.co.uk');
define('ga_password','macos100');
define('ga_profile_id',63202767);

require 'gapi.class.php';

$ga = new gapi(ga_email,ga_password);

$ga->requestReportData(
    ga_profile_id,
    array('source','referralPath'),//what field you are looking for
    array('pageviews','visits'),//what metric you want to calculate
    '-visits',//sort order, prefix - means descending
    'ga:pagePath==/wemissyou && medium==referral && referralPath != /',//filter query
    null,//start: yyyy-mm-dd or null
    null,//end: yyyy-mm-dd or null
    1,//offset lookup
    100//max result
);
?>
<table>
<tr>
  <th>Referral URL</th>
  <th>Pageviews</th>
  <th>Visits</th>
</tr>
<?php
foreach($ga->getResults() as $result):
?>
<tr>
  <td><?php echo $result->getSource() . $result->getReferralPath() ?></td>
  <td><?php echo $result->getPageviews() ?></td>
  <td><?php echo $result->getVisits() ?></td>
</tr>
<?php
endforeach
?>
</table>