<?php
// special syntax
import * as fs from 'fs';

// using the global api
$links = document::getElementsByTagName('a');
foreach($links as $link) {
  echo $link->attr('href') . "\n";
}

// using nodejs library
fs::readFile('foo.php', function($err, $data) {
  if ($err) {
    // global object
    $console->error($err);
  } else {
    $data = $data->toString('utf8');
    // can also use static calls
    console::log($data);
  }
});
