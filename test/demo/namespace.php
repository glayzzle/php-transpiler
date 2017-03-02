<?php
require_once 'fibo.php';

namespace foo\bar {
  use function bench\fibo as fibo;
  /**
   * The famous fibonnaci benchmark to test function calls
   */
  for($i = 10; $i < 20; $i++) {
    echo $i . " => " . fibo($i);
  }
}
echo "Hello\nworld";
$a = 1;
$b = 2;
$c = $a + $b;
