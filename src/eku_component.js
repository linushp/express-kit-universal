var eku_compile_template = require("./eku_compile_template");


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

    if (isObject(componentDefine)) {

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
    var componentDefine = {};
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
                }


            })(templateDefine);

            componentDefineAttrCount++;
        }
    }


    if (componentDefineAttrCount > 0) {
        componentDefine.base_component = base_component;
        return register_component(componentName, componentDefine)
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
    }
    else if (isString(componentObject)) {
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

module.exports = {
    set_html2js_tpl: set_html2js_tpl,
    get_component: get_component,
    get_all_components: get_all_components,
    extend_component: extend_component,
    register_component: register_component,
    register_components: register_components,
    register_component_by_template: register_component_by_template
};