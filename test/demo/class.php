<?php

interface baz {
  const FOO = 123;
  public function doSomething($arg);
}

abstract class bar implements baz {
  abstract protected function guessSomething();
}

class foo extends bar {
  public static $here = 'there';
  private $bar = false;
  protected $id;
  public function __construct($id) {
    $this->id = $id;
  }
  public function getId() {
    return $this->id;
  }
  private static function hello() {
    return self::$here;
  }
}

// const MAX = 10e4;
for($i = 0; $i < 10e4; $i++) {
  $item = new foo($i);
  if ($item->getId() !== $i) {
    console::log("Error @ $i");
  }
}
