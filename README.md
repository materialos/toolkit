<div align="center">

![Icon](img/icon.png)

</div>


<div align="center">

[![npm version](https://img.shields.io/npm/v/toolkit/materialos.svg)](https://www.npmjs.com/package/org/materialos/toolkit)
[![license](https://img.shields.io/github/license/materialos/toolkit.svg)](/LICENSE)

</div>


# MaterialOS Toolkit

## Description
A set of tools for maintaining the [materialos/icons](https://github.com/materialos/icons/) repository mainly written in Node.js. These aren't required to use our icons but my be helpful for contributors. They may be buggy and will change and break frequently since they're just small tools for internal use.


## Features
* Change, parse, and retrieve XMP data by path or tag
* Convert files to SVG using Inkscape
* Make JSON representing the file structure
* Manage `all-contributors` files
* Minify SVGs
* Render SVGs to PNG
* Retrieve thumbnails from XMP


## Installation
<!-- TODO: Once published to npm, uncomment -->
<!-- ###### From npm
```bash
$ npm install -g @materialos/toolkit
``` -->
###### From source
```bash
$ git clone https://github.com/materialos/toolkit
$ cd toolkit/
$ npm install -g
```


## Usage
### CLI
The CLI may be used interactively or using parsed commands from the execution from the shell. You can call `--help` on commands to learn more about them.
###### Interactive
```bash
$ toolkit
materialos/toolkit: help
```
###### From Shell
```bash
$ toolkit help
$ toolkit help render # or another command
```

### API
The API for each submodule isn't documented at this time since the API isn't guaranteed to stay the same however, the API can be relatively easily figured out from the parameters of each module's `module.exports`. Almost every one returns a promise and many save files.


## Contributors
Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/5341898?v=4" width="100px;"/><br /><sub><b>Daniel Hickman</b></sub>](https://www.danielhickman.com/)<br />[💻](https://github.com/materialos/toolkit/commits?author=danielhickman "Code") [🎨](#design-danielhickman "Design") [📖](https://github.com/materialos/toolkit/commits?author=danielhickman "Documentation") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License
Copyright MaterialOS, [MIT License](https://github.com/materialos/toolkit/blob/master/LICENSE)
