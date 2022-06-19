# node-modman
Module Manager

# Installation
```
npm i modman
```

# What is it?
Modman is a module that lets you control Node.js modules in a sandbox, based off of "vm2".

You can control any module/package, from simply disallowing usage of some FS functions, to controlling how NPM packages can be used in code.

# How do I use it?
Here is a basic example:
```js
var modman = require('modman');
var sandbox = modman({
  permissions: {
    "fs.unlinkSync": false,
    "fs.unlink": false,
    "fs.readFileSync": true,
    "fs.readFile": true,
    "fs.writeFileSync": true,
    "fs.writeFile": true
  },
  modules: ['@colors/colors']
});

sandbox(function(){
  var colors = require('@colors/colors')
  var fs = require('fs');

  console.log(colors.blue('Hello, World!')); // "Hello, World!" in blue color
  fs.unlinkSync('index.js'); // gives error
})
```

Let's break this down.
```json
"permissions": {
    "fs.unlinkSync": false,
    "fs.unlink": false,
    "fs.readFileSync": true,
    "fs.readFile": true,
    "fs.writeFileSync": true,
    "fs.writeFile": true
}
```
The "permissions" entry is an object filled with the module and functions that have permissions set.

All entry names are the modules, followed by a dot, followed by the function to control.

If a function is denied access, when it is ran, it will say this and stop execution of the sandbox:
```ansi
Error: Function not allowed in this context.
    at Object.ota.<computed>.<computed> [as unlinkSync] (/home/runner/sanel/index.js:21:52)
    at ReadOnlyHandler.apply (/home/runner/sanel/node_modules/vm2/lib/bridge.js:479:11)
    at vm.js:5:6
    at vm.js:6:3
    at BaseHandler.apply (/home/runner/sanel/node_modules/vm2/lib/bridge.js:479:11)
    at NodeVM.run (/home/runner/sanel/node_modules/vm2/lib/nodevm.js:425:23)
    at /home/runner/sanel/index.js:73:18
    at Object.<anonymous> (/home/runner/sanel/index.js:90:1)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
```
However, if it is allowed, you can use it as normal.

If a permission is not defined, then the function cannot be used. To make it usable, set the permission to true.

```json
  modules: ['@colors/colors']
```
The "modules" array is so you can include certain modules in the sandbox. It is recommended to use this only for custom modules, as you can include built-ins using the "permissions" entry.

```js
sandbox(function(){
  var colors = require('@colors/colors')
  var fs = require('fs');

  console.log(colors.blue('Hello, World!')); // "Hello, World!" in blue color
  fs.unlinkSync('index.js'); // gives error
})
```
The "sandbox" function is from the permissions and external modules we set. When run, it will run the code inside the function inside the sandbox, and not run it using `fn()`. No variables outside the code can be used in the sandbox. 

# Documentation
**modman()**
```js
modman({...})
```
__Returns:__ function

__Arguments:__ (1): array

- permissions: __required__
- modules: *optional*


**sandbox(function)**

```js
sandbox(function(){
  ...
})
```
__Returns:__ nothing

__Arguments:__ (1): function