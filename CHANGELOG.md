## [Version 0.1.0](https://github.com/glayzzle/php-transpiler/releases/tag/v0.1.0) (2017-1-26)

### Major Changes

- implement for keyword: [`6a3758e`](https://github.com/glayzzle/php-transpiler/commit/6a3758e)
- implement post variable operations: [`a80f878`](https://github.com/glayzzle/php-transpiler/commit/a80f878)
- implement pre variable operation: [`a255278`](https://github.com/glayzzle/php-transpiler/commit/a255278)

### Minor Changes

- add a generic serialiser: [`371ad8e`](https://github.com/glayzzle/php-transpiler/commit/371ad8e)
- (wip) start a property lookup visitor: [`a4404c9`](https://github.com/glayzzle/php-transpiler/commit/a4404c9)
- add helpers / find a parent & convert to string: [`6ea38b8`](https://github.com/glayzzle/php-transpiler/commit/6ea38b8)
- register new nodes: [`f0a32d7`](https://github.com/glayzzle/php-transpiler/commit/f0a32d7)

### Patches

- fix the concat operator: [`3819d6c`](https://github.com/glayzzle/php-transpiler/commit/3819d6c)
- improve function performance (when return type is checked): [`342ba91`](https://github.com/glayzzle/php-transpiler/commit/342ba91)
- fix function late state binding: [`c9f3304`](https://github.com/glayzzle/php-transpiler/commit/c9f3304)
- avoid nested namespaces usage: [`02cf9e7`](https://github.com/glayzzle/php-transpiler/commit/02cf9e7)
- improve tests: [`3e79383`](https://github.com/glayzzle/php-transpiler/commit/3e79383)

[...full changes](https://github.com/glayzzle/php-transpiler/compare/v0.0.5...v0.1.0)

## [Version 0.0.5](https://github.com/glayzzle/php-transpiler/releases/tag/v0.0.5) (2017-1-24)

### Minor Changes

- add build tools / browserify: [`79bcfed`](https://github.com/glayzzle/php-transpiler/commit/79bcfed)
- use node 4: [`b9786da`](https://github.com/glayzzle/php-transpiler/commit/b9786da)
- add generic wrapper: [`276dcfe`](https://github.com/glayzzle/php-transpiler/commit/276dcfe)
- serialize comment nodes: [`0b1f6d6`](https://github.com/glayzzle/php-transpiler/commit/0b1f6d6)
- implement return node: [`8e5fc09`](https://github.com/glayzzle/php-transpiler/commit/8e5fc09)
- impl uqn + function resolution stack: [`4fec3f4`](https://github.com/glayzzle/php-transpiler/commit/4fec3f4)
- resolves the function final name: [`4380688`](https://github.com/glayzzle/php-transpiler/commit/4380688)
- add a generic block writer: [`7da02c7`](https://github.com/glayzzle/php-transpiler/commit/7da02c7)
- impl if statements: [`845a7d7`](https://github.com/glayzzle/php-transpiler/commit/845a7d7)
- register new nodes: [`54ced98`](https://github.com/glayzzle/php-transpiler/commit/54ced98)
- add an import header for lazy methods resolution: [`3d3f618`](https://github.com/glayzzle/php-transpiler/commit/3d3f618)

### Patches

- complete sample: [`bec7f69`](https://github.com/glayzzle/php-transpiler/commit/bec7f69)
- first build: [`0d5a1cd`](https://github.com/glayzzle/php-transpiler/commit/0d5a1cd)
- fix output on multiple lines: [`609a346`](https://github.com/glayzzle/php-transpiler/commit/609a346)
- fix type checks: [`76b4f45`](https://github.com/glayzzle/php-transpiler/commit/76b4f45)
- fix call type / change into statement: [`0fabf71`](https://github.com/glayzzle/php-transpiler/commit/0fabf71)

[...full changes](https://github.com/glayzzle/php-transpiler/compare/v0.0.4...v0.0.5)

## [Version 0.0.4](https://github.com/glayzzle/php-transpiler/releases/tag/v0.0.4) (2017-1-22)

### Patches

- up: [`74218e1`](https://github.com/glayzzle/php-transpiler/commit/74218e1)
- fix the function name (bug with coverage tools): [`3fa3744`](https://github.com/glayzzle/php-transpiler/commit/3fa3744)

[...full changes](https://github.com/glayzzle/php-transpiler/compare/v0.0.3...v0.0.4)

## [Version 0.0.3](https://github.com/glayzzle/php-transpiler/releases/tag/v0.0.3) (2017-1-22)

### Minor Changes

- add the scope into the state object: [`91acc77`](https://github.com/glayzzle/php-transpiler/commit/91acc77)
- add scope into the program node & fix namespace name: [`3829427`](https://github.com/glayzzle/php-transpiler/commit/3829427)
- add binary operations: [`98e7d97`](https://github.com/glayzzle/php-transpiler/commit/98e7d97)
- add the scope handler: [`01a48f9`](https://github.com/glayzzle/php-transpiler/commit/01a48f9)
- add the assign node: [`a168153`](https://github.com/glayzzle/php-transpiler/commit/a168153)
- add the variable node: [`d9b2ff4`](https://github.com/glayzzle/php-transpiler/commit/d9b2ff4)
- update node references & test: [`4dd441a`](https://github.com/glayzzle/php-transpiler/commit/4dd441a)
- add a fallback node: [`fb96242`](https://github.com/glayzzle/php-transpiler/commit/fb96242)
- implement function transcription: [`e150ad5`](https://github.com/glayzzle/php-transpiler/commit/e150ad5)
- handle program output modes: [`96cf416`](https://github.com/glayzzle/php-transpiler/commit/96cf416)

### Patches

- add a new create helper + fix inheritance: [`d311187`](https://github.com/glayzzle/php-transpiler/commit/d311187)
- correct namespace name: [`2c519fe`](https://github.com/glayzzle/php-transpiler/commit/2c519fe)
- correct number output: [`5b73955`](https://github.com/glayzzle/php-transpiler/commit/5b73955)
- fix output & serialize variables: [`cc80b4c`](https://github.com/glayzzle/php-transpiler/commit/cc80b4c)
- improve tests: [`23d87f6`](https://github.com/glayzzle/php-transpiler/commit/23d87f6)
- fix variable scopes: [`2604151`](https://github.com/glayzzle/php-transpiler/commit/2604151)

[...full changes](https://github.com/glayzzle/php-transpiler/compare/v0.0.2...v0.0.3)

## [Version 0.0.2](https://github.com/glayzzle/php-transpiler/releases/tag/v0.0.2) (2017-1-21)

### Minor Changes

- handle indentation: [`08991ba`](https://github.com/glayzzle/php-transpiler/commit/08991ba)
- handle primitives: [`992a96d`](https://github.com/glayzzle/php-transpiler/commit/992a96d)
- call expressions: [`040af0a`](https://github.com/glayzzle/php-transpiler/commit/040af0a)
- use indentation: [`ea7b09a`](https://github.com/glayzzle/php-transpiler/commit/ea7b09a)
- implement js statements: [`116b0b3`](https://github.com/glayzzle/php-transpiler/commit/116b0b3)
- handle echo/print statements: [`7f8e1bc`](https://github.com/glayzzle/php-transpiler/commit/7f8e1bc)
- handle status: [`f7d9399`](https://github.com/glayzzle/php-transpiler/commit/f7d9399)
- implement namespace resolution: [`8a99c13`](https://github.com/glayzzle/php-transpiler/commit/8a99c13)
- serialize primitives: [`62d83dc`](https://github.com/glayzzle/php-transpiler/commit/62d83dc)

### Patches

- make tests pass: [`5f1b358`](https://github.com/glayzzle/php-transpiler/commit/5f1b358)

- add travis & coveralls: [`fc993d7`](https://github.com/glayzzle/php-transpiler/commit/fc993d7)

[...full changes](https://github.com/glayzzle/php-transpiler/compare/v0.0.1...v0.0.2)
