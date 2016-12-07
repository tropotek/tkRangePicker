<?php
/**
 * Created by PhpStorm.
 * User: mifsudm
 * Date: 7/1/15
 * Time: 12:24 PM
 */
$pre = date('Y-m-');


// Non selectable dates
$dates = array(
    array($pre.'10', 'start'), array($pre.'11', 'full'), array($pre.'12', 'full'), array($pre.'13', 'end'),
    array($pre.'13', 'start'), array($pre.'14', 'full'), array($pre.'15', 'end'),
    array($pre.'21', 'start'), array($pre.'22', 'end'),
    array($pre.'22', 'start'), array($pre.'23', 'full'), array($pre.'24', 'full'), array($pre.'25', 'end')
);



header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($dates);