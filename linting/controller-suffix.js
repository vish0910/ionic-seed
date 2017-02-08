var _ = require('lodash');

/**
 * https://github.com/UptakeTech/angular-styleguide#style-y124
 *
 * Append the controller name with the suffix `Controller`.
 *
 * Why?: The Controller suffix is more commonly used and is
 * more explicitly descriptive.
 */
module.exports = function (context) {
    return {
        CallExpression: function (node) {
            var methodName = _.get(node, 'callee.property.name');
            var fixtureName = _.get(node, 'arguments[0].value');

            // don't run on calls other than `angular.controller()`
            if (!node.arguments[1]) {
                return;
            }

            if (methodName === 'controller' && !(/Controller$/.exec(fixtureName))) {
                context.report(
                    node,
                    'Controller name should end with "Controller": ' +
                    '[Y124](https://github.com/UptakeTech/angular-styleguide#style-y124)'
                );
            }
        }
    };
};

