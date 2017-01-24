<?php
namespace foo\bar {
  echo "Hello world";
  $a = 1;
  $b = 2;
  $c = $a + $b;
  /**
   * The famous fibonnaci benchmark to test function calls
   */
  function fibo(int $a) : int {
    // return $a < 1 ? 1 : fibo($a - 2) + fibo($a - 1);
    if ($a < 1) {
      return 1; /* here */
    } else if (false) {
      return true;
    } else {
      return fibo($a - 2) + fibo($a - 1);
    }
  }
  echo fibo(30);
}
