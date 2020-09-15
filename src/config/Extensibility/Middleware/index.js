/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
/* eslint-disable no-param-reassign, @scandipwa/scandipwa-guidelines/export-level-one */
const generateGetHandler = require('./handlers/generateGetHandler');
const generateApplyHandler = require('./handlers/generateApplyHandler');
const generateConstructHandler = require('./handlers/generateConstructHandler');
const applyClassWrappers = require('./middlewarers/generateMiddlewaredClass');

const addNamespaceToMiddlewarable = (Middlewarable, namespace) => {
    if (!Middlewarable.prototype.__namespace__) {
        Middlewarable.prototype.__namespace__ = [];
    }

    // Prevent duplicate namespaces from overridden classes
    if (!Middlewarable.prototype.__namespace__.includes(namespace)) {
        Middlewarable.prototype.__namespace__.push(namespace);
    }
};

const getNamespacesFromMiddlewarable = (Middlewarable) => Middlewarable.prototype.__namespace__;

/**
 * Middleware function is supposed to wrap source classes
 * in order to provide plugin functionality
 * @param {Function} Middlewarable
 * @param {string} namespace
 */
function middleware(Middlewarable, namespace) {
    addNamespaceToMiddlewarable(Middlewarable, namespace);

    const handler = {
        // Get handler for members - intercepts `get` calls, meant for class static members
        get: generateGetHandler('class', getNamespacesFromMiddlewarable(Middlewarable)),

        // Apply handler for functions - intercepts function calls
        apply: generateApplyHandler(getNamespacesFromMiddlewarable(Middlewarable)),

        // Construct handler for classes - intercepts `new` operator calls, changes properties
        construct: generateConstructHandler(getNamespacesFromMiddlewarable(Middlewarable))
    };

    const proxy = new Proxy(Middlewarable, handler);

    // TODO check if class
    return applyClassWrappers(proxy);
}

module.exports = middleware;