<?php
namespace foo\bar {
  /**
   * The famous fibonnaci benchmark to test function calls
   */
  function fibo(int $a) : int {
    return $a < 1 ? 1 :
      fibo($a - 2) + fibo($a - 1)
    ;
  }
  for($i = 10; $i < 20; $i++) {
    echo $i . " => " . fibo($i);
  }
}
echo "Hello world";
$a = 1;
$b = 2;
$c = $a + $b;
