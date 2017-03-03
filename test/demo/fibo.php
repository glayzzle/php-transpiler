<?php
namespace bench {
  function fibo(int $a) : int {
    return $a < 1 ? 1 :
      fibo($a - 2) + fibo($a - 1)
    ;
  }
  return 1 + 2 + 3;
}
