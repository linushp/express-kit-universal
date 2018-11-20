var eku_compile_template = require("./eku_compile_template");

var __$windowObj = null;

function isObject(x) {
    return Object.prototype.toString.call(x) === "[object Object]";
}


function isFunction(x) {
    return Object.prototype.toString.call(x) === "[object Function]";
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


function handle_base_component(obj, base_component) {
    if (base_component && base_component.length > 0) {
        var base_component_define = get_component(base_component);
        if (base_component_define) {
            handle_base_component(obj, base_component_define.base_component_name);
            extend_object(obj, base_component_define);
        }
    }
}


var register_component_container = {};

function register_component(componentName, componentDefine) {
    componentDefine["$render"] = function (tpl, data) {
        data = data || {};
        var windowObj = __$windowObj;
        handle_base_component(data, componentDefine.base_component_name);
        extend_object(data, componentDefine);
        return eku_compile_template(tpl)(data,windowObj);
    };
    register_component_container[componentName] = componentDefine;
    return componentDefine;
}


function register_component_by_template(componentName, html2js_tpl) {
    var componentDefine = {};

    var templateKeyBegin = componentName + "----";

    for (var templateKey in html2js_tpl) {
        if (html2js_tpl.hasOwnProperty(templateKey) && templateKey.indexOf(templateKeyBegin) === 0) {
            var templateDefine = html2js_tpl[templateKey];
            var foo_name = templateDefine.foo_name;

            /**
             * <string2-template foo="render" params="name,sex">
             */
            componentDefine[foo_name] = (function (aaaaa) {

                var tpl = aaaaa.content;
                var propsMap = aaaaa.propsMap || {};





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
                    return this.$render(tpl, data);
                }


            })(templateDefine);
        }
    }

    return register_component(componentName, componentDefine)
}


/**
 * @param componentName
 * @param html2js_tpl 可以为空
 * @returns {*}
 */
function get_component(componentName, html2js_tpl) {
    var ccc = register_component_container[componentName];
    if (ccc) {
        return ccc;
    }

    if (html2js_tpl) {
        return register_component_by_template(componentName, html2js_tpl);
    }
}


function extend_component(componentObject,xxxObj) {
    extend_object(componentObject,xxxObj);
}


function set_window(windowObj) {
    __$windowObj = windowObj;
}

module.exports = {
    set_window:set_window,
    get_component: get_component,
    extend_component: extend_component,
    register_component: register_component,
    register_component_by_template: register_component_by_template
};