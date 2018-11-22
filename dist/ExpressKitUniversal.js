(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ExpressKitUniversal"] = factory();
	else
		root["ExpressKitUniversal"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var eku_compile_template = (function () {
    var openTag = '<%',
        closeTag = '%>',
        retTag = '$return',
        vars = 'var ',
        varsInTpl,
        codeArr = ''.trim ? [retTag + ' = "";', retTag + ' +=', ';', retTag + ';', 'print=function(){' + retTag + '+=[].join.call(arguments,"")},'] : [retTag + ' = [];', retTag + '.push(', ')', retTag + '.join("");', 'print=function(){' + retTag + '.push.apply(arguments)},'],
        keys = ('break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if' + ',in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with' + ',abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto' + ',implements,import,int,interface,long,native,package,private,protected,public,short' + ',static,super,synchronized,throws,transient,volatile' + ',arguments,let,yield').split(','),
        keyMap = {};

    for (var i = 0, len = keys.length; i < len; i++) {
        keyMap[keys[i]] = 1;
    }

    function _getCompileFn(source) {
        vars = 'var ';
        varsInTpl = {};
        varsInTpl[retTag] = 1;
        var openArr = source.split(openTag),
            tmpCode = '';

        for (var i = 0, len = openArr.length; i < len; i++) {
            var c = openArr[i],
                cArr = c.split(closeTag);
            if (cArr.length == 1) {
                tmpCode += _html(cArr[0]);
            } else {
                tmpCode += _js(cArr[0]);
                tmpCode += cArr[1] ? _html(cArr[1]) : '';
            }
        }

        var code = vars + codeArr[0] + tmpCode + 'return ' + codeArr[3];

        code = "try{" + code + " }catch(e){ console.log(e); return e;}";

        return new Function('$data', 'window', code);
    }

    function _html(s) {
        s = s.replace(/('|"|\\)/g, '\\$1').replace(/\r/g, '\\r').replace(/\n/g, '\\n');

        s = codeArr[1] + '"' + s + '"' + codeArr[2];

        return s + '\n';
    }

    function _js(s) {
        if (/^=/.test(s)) {
            s = codeArr[1] + s.substring(1).replace(/[\s;]*$/, '') + codeArr[2];
        }

        dealWithVars(s);

        return s + '\n';
    }

    function dealWithVars(s) {
        s = s.replace(/\/\*.*?\*\/|'[^']*'|"[^"]*"|\.[\$\w]+/g, '');
        var sArr = s.split(/[^\$\w\d]+/);
        for (var i = 0, len = sArr.length; i < len; i++) {
            var c = sArr[i];
            if (!c || keyMap[c] || /^\d/.test(c)) {
                continue;
            }
            if (!varsInTpl[c]) {
                if (c === 'print') {
                    vars += codeArr[4];
                } else {
                    vars += c + '=$data.hasOwnProperty("' + c + '")?$data.' + c + ':window.' + c + ',';
                }
                varsInTpl[c] = 1;
            }
        }
    }

    return function (str, data, windowObj) {
        var fn = _getCompileFn(str);
        return data ? fn(data, windowObj) : fn;
    };
})();

module.exports = eku_compile_template;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var eku_compile_template = __webpack_require__(0);

var __REGISTER_COMPONENT_CONTAINER__ = {};
var __HTML2JS_TPL__ = "__HTML2JS_TPL__";

function isObject(x) {
    return Object.prototype.toString.call(x) === "[object Object]";
}

function isFunction(x) {
    return Object.prototype.toString.call(x) === "[object Function]";
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
}

function extend_object(objA, objB) {
    for (var key in objB) {
        if (objB.hasOwnProperty(key)) {
            var valB = objB[key];
            objA[key] = valB;
        }
    }
    return objA;
}

/**
 *
 * @param obj
 * @param base_component 字符串
 */
function handle_base_component(obj, base_component) {
    if (base_component && base_component.length > 0) {
        var base_component_define = get_component(base_component);
        if (base_component_define) {
            handle_base_component(obj, base_component_define.base_component);
            extend_object(obj, base_component_define);
        }
    }
}

/**
 * @param componentName
 * @param componentDefine 可以是对象，也可以是函数
 * @returns {*}
 */
function register_component(componentName, componentDefine) {

    if (isObject(componentDefine) && componentDefine.eku_type === "eku_render_component") {

        componentDefine["$render"] = function (tpl_or_compiled, data) {
            data = data || {};
            var windowObj = __REGISTER_COMPONENT_CONTAINER__;
            handle_base_component(data, componentDefine.base_component);
            extend_object(data, componentDefine);

            if (isFunction(tpl_or_compiled)) {
                return tpl_or_compiled(data, windowObj);
            }

            return eku_compile_template(tpl_or_compiled)(data, windowObj);
        };
    }

    __REGISTER_COMPONENT_CONTAINER__[componentName] = componentDefine;
    return componentDefine;
}

function register_component_by_template(componentName, html2js_tpl) {

    var componentDefine = {
        eku_type: "eku_render_component"
    };

    var componentDefineAttrCount = 0;

    var templateKeyBegin = componentName + "----";

    var base_component = null;

    for (var templateKey in html2js_tpl) {
        if (html2js_tpl.hasOwnProperty(templateKey) && templateKey.indexOf(templateKeyBegin) === 0) {
            var templateDefine = html2js_tpl[templateKey];
            var foo_name = templateDefine.foo_name;

            /**
             * <string2-template foo="render" params="name,sex">
             */
            componentDefine[foo_name] = (function (aaaaa) {
                var tpl = aaaaa.content || "";
                var tpl_compiled = eku_compile_template(tpl);

                var propsMap = aaaaa.propsMap || {};

                if (propsMap['base_component'] && propsMap['base_component'].length > 0) {
                    base_component = propsMap['base_component'].trim();
                }

                var params = (propsMap['params'] || "").trim();
                var params_array = params.split(",");

                return function () {
                    var args = Array.prototype.slice.apply(arguments);
                    var data = {};
                    for (var i = 0; i < params_array.length; i++) {
                        var param_name = params_array[i];
                        if (param_name && param_name.trim().length > 0) {
                            param_name = param_name.trim();
                            data[param_name] = args[i];
                        }
                    }
                    return this.$render(tpl_compiled, data);
                };
            })(templateDefine);

            componentDefineAttrCount++;
        }
    }

    if (componentDefineAttrCount > 0) {
        componentDefine.base_component = base_component;
        return register_component(componentName, componentDefine);
    } else {
        return null;
    }
}

/**
 * @param componentName
 * @param html2js_tpl 可以为空
 * @returns {*}
 */
function get_component(componentName) {
    var ccc = __REGISTER_COMPONENT_CONTAINER__[componentName];
    if (ccc) {
        return ccc;
    }

    var html2js_tpl = __REGISTER_COMPONENT_CONTAINER__[__HTML2JS_TPL__];
    if (html2js_tpl) {
        return register_component_by_template(componentName, html2js_tpl);
    }
}

function extend_component(componentObject, xxxObj) {
    if (isObject(componentObject)) {
        extend_object(componentObject, xxxObj);
    } else if (isString(componentObject)) {
        var compObj = get_component(componentObject);
        if (!isObject(compObj)) {
            console.log("cannot find component of :" + componentObject, compObj);
            throw new Error("cannot find component of :" + componentObject);
        }
        extend_object(compObj, xxxObj);
    }
}

/**
 * 同时注册多个组件
 */
function register_components(obj) {
    var result = {};
    for (var comp_name in obj) {
        if (obj.hasOwnProperty(comp_name)) {
            var comp_obj = obj[comp_name];
            result[comp_name] = register_component(comp_name, comp_obj);
        }
    }
    return result;
}

function get_all_components() {
    return __REGISTER_COMPONENT_CONTAINER__;
}

function set_html2js_tpl(xxx) {
    __REGISTER_COMPONENT_CONTAINER__[__HTML2JS_TPL__] = xxx;
}

function clear_all_components() {
    __REGISTER_COMPONENT_CONTAINER__ = {};
}

module.exports = {
    set_html2js_tpl: set_html2js_tpl,
    get_component: get_component,
    get_all_components: get_all_components,
    clear_all_components: clear_all_components,
    extend_component: extend_component,
    register_component: register_component,
    register_components: register_components,
    register_component_by_template: register_component_by_template
};

/***/ })
/******/ ]);
});