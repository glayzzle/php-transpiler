<?php
namespace foo\bar {
  echo "Hello world";
  $a = 1;
  $b = 2;
  $c = $a + $b;
  function fibo(int $a) : int {
    return $a < 1 ? 1 : fibo($a - 2) + fibo($a - 1);
  }
  echo fibo(30);
}
