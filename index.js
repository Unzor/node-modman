const isBuiltinModule = require('is-builtin-module');

function modman(s) {
    var ot = [];
    var otc = [];
    var otce = {};
    var ota = {};
	if (!s.permissions) {
		throw new Error("Permissions are not specified!");
	}
	if (!s) {
		throw new Error("Settings not set!")
	}
    for (var thing in s.permissions) {
        var module = thing.split('.')[0];
        var func = thing.split('.')[1];
        if (!ota[module]) {
            ota[module] = {};
        }
        if (isBuiltinModule(module)) {
            ot.push(module);
        } else {
            otc.push(module);
        }
        if (s.permissions[thing] == false) {
            ota[module][func] = function() {
                console.log('\x1b[31m%s\x1b[0m', new Error('Function not allowed in this context.'))
                return Buffer.from(JSON.stringify({
                    error: true,
                    message: "Function not allowed in context"
                }))
            }
        } else {
            ota[module][func] = function() {
                return require(module)[func](...arguments);
            }
        }
    }

    if (s.modules) {
        s.modules.forEach(function(m) {
            if (isBuiltinModule(m)) {
                ot.push(m);
            } else {
                otc.push(m);
                otce[m] = require(m);
            }
        })
    }

    otce['mockingbird_require'] = function(m) {
        if (otce[m]) {
            return otce[m];
        } else {
            vm.run('(()=>{throw new Error("Module ' + m + ' not found.")})()')
            otce['process'].exit(1);
        }
    }
    otce['mckbdrqur694202yftcbsufgje4hrs'] = function(r, m) {
        var org_rr = r;
        if (isBuiltinModule(m)) {
            return org_rr(m);
        } else {
            return otce['mockingbird_require'](m);
        }
    };
    const {
        NodeVM
    } = require('vm2');
    const vm = new NodeVM({
        console: 'inherit',
        sandbox: otce,
        require: {
            external: {
                modules: otc
            },
            imports: otc,
            builtin: ot,
            root: './',
            mock: ota
        },
    });
    return c => vm.run(`var ori = require;
require = m => mckbdrqur694202yftcbsufgje4hrs(ori, m);
(` + c.toString() + ')();')
}

module.exports = modman;