<?php

$decimals = 2;

if (!empty($_GET['decimals'])) {

    $decimals = $_GET['decimals'];
}

function cr($t)
{
    return $t[1] / $t[0];
}

function zscore($c, $t)
{
    $z = cr($t) - cr($c);
    $s = (cr($t) * (1 - cr($t))) / $t[0] + (cr($c) * (1 - cr($c))) / $c[0];
    return $z / sqrt($s);
}

function cumnormdist($x)
{
    $b1 = 0.319381530;
    $b2 = -0.356563782;
    $b3 = 1.781477937;
    $b4 = -1.821255978;
    $b5 = 1.330274429;
    $p = 0.2316419;
    $c = 0.39894228;

    if ($x >= 0.0) {
        $t = 1.0 / (1.0 + $p * $x);
        return (1.0 - $c * exp(-$x * $x / 2.0) * $t *
            ($t * ($t * ($t * ($t * $b5 + $b4) + $b3) + $b2) + $b1));
    } else {
        $t = 1.0 / (1.0 - $p * $x);
        return ($c * exp(-$x * $x / 2.0) * $t *
            ($t * ($t * ($t * ($t * $b5 + $b4) + $b3) + $b2) + $b1));
    }
}

function ssize($conv)
{
    $a = 3.84145882689;
    $res = array();
    $bs = array(0.0625, 0.0225, 0.0025, 0.05);
    foreach ($bs as $b) {
        $res[] = (int)((1 - $conv) * $a / ($b * $conv));
    }
    return $res;
}

function getProbabilityCenterOfTreatment($Visitors, $Conversions, $Conversions1)
{

    $pro = $Conversions / $Visitors;
    $pro1 = $Conversions1 / $Visitors;
    $pa1 = gmp_fact($Visitors);
    $pa2 = gmp_fact($Visitors - $Conversions1) * gmp_fact($Conversions1);
    $cardinal = gmp_div_q($pa1, $pa2);
    $result_big_pow_part1 = sp_power($pro, $Conversions1);
    $f_part1 = $result_big_pow_part1[0];
    $result_big_pow_part2 = sp_power((1 - $pro), ($Visitors - $Conversions1));
    $f_part2 = $result_big_pow_part2[0];
    $prt1_multiplied_part2 = floatval(floatval($f_part1) * floatval($f_part2));
    $total_division = 0;
    for ($o = 0; $o < count($result_big_pow_part1[1]); $o++) {
        $total_division = $total_division + $result_big_pow_part1[1][$o];
    }
    for ($o = 0; $o < count($result_big_pow_part2[1]); $o++) {
        $total_division = $total_division + $result_big_pow_part2[1][$o];
    }
    $result_of_division = bcdiv($cardinal, bcpow(10, $total_division), 9000);
    $result = bcmul($prt1_multiplied_part2, $result_of_division, 9000);
    $result_float = substr($result, 0, 6);
    return array($pro1, (float)$result_float);

}

//TODO find another way to calculate probability
function getProbabilityCenterOfTreatment2($Visitors, $Conversions, $Conversions1)
{
    $pro = $Conversions / $Visitors;
    $pro1 = $Conversions1 / $Visitors;
    $pa1 = gmp_fact($Visitors);
    $pa2 = gmp_fact($Visitors - $Conversions1) * gmp_fact($Conversions1);

    $cardinal = gmp_div_q($pa1, $pa2);
    $result_big_pow_part1 = bcpow($pro, $Conversions1);
    $result_big_pow_part2 = bcpow((1 - $pro), ($Visitors - $Conversions1));

    echo $result_big_pow_part2;
    exit;
}

function fact($x)
{
    $return = 1;
    for ($i = 2; $i <= $x; $i++) {
        $return = gmp_mul($return, $i);
    }
    return $return;
}

function sp_power($a, $b)
{
    $return = array();
    $return[0] = floatval($a);
    $return[1] = array();
    for ($i = 1; $i < $b; $i++) {
        $return[0] = $return[0] * floatval($a);
        $reg = '/E-(\w+)/';
        if (preg_match($reg, $return[0], $m)) {
            if ($m[1] > 300) {
                array_push($return[1], $m[1]);
                $return[0] = $return[0] * bcpow(10, $m[1]);
            }
        }
    }
    $reg = '/E-(\w+)/';
    if (preg_match($reg, $return[0], $m)) {
        if ($m[1] > 0) {
            array_push($return[1], $m[1]);
            $return[0] = $return[0] * bcpow(10, $m[1]);
        }

    }
    return $return;
}

function divisionResult($number, $lengthDivisor)
{

    $_number_length = strlen($number);
    $_lengthDivisor = $lengthDivisor;

    if ($_number_length < $_lengthDivisor) {

        $diff = $_lengthDivisor - $_number_length;
//        $diff_pow=pow(10,-$diff);
//        $result=substr($number,0,10)*$diff_pow;
//        echo $diff_pow;exit;
        $result = "0.";
        for ($i = 1; $i < $diff; $i++) {
            $result = $result . "0";

        }
        $result = $result . substr($number, 0, 10) . '<br>';


    } else {
        $result = 0;
    }
    return $result;

}

?>