var _ = require('lodash');

/**
 * https://github.com/UptakeTech/angular-styleguide#style-y024
 *
 * Use named functions instead of passing an anonymous function
 * in as a callback.
 *
 * Why?: This produces more readable code, is much easier to debug,
 * and reduces the amount of nested callback code.
 */
module.exports = function (context) {
    return {
        CallExpression: CallExpression
    };

    function CallExpression(node) {
        var methodName = _.get(node, 'callee.property.name');
        var typeOfArgument = _.get(node, 'arguments[1].type');

        if (typeOfArgument === 'FunctionExpression') {
            switch (methodName) {
                case 'controller':
                case 'service':
                case 'factory':
                case 'provider':
                    context.report(
                        node,
                        'Anonymous functions should not be used for Angular fixtures: ' +
                        '[Y024](https://github.com/UptakeTech/angular-styleguide#style-y024)'
                    );
            }
        }
    };
};
