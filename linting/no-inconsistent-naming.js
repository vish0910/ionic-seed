var _ = require('lodash');

/**
 * https://github.com/UptakeTech/angular-styleguide#style-y123
 *
 * Use consistent names for all controllers named after their feature.
 * Use UpperCamelCase for controllers, as they are constructors.
 *
 * Why?: Provides a consistent way to quickly identify and reference controllers.
 *
 * Why?: UpperCamelCase is conventional for identifying object that can
 * be instantiated using a constructor.
 */
module.exports = function (context) {
    return {
        CallExpression: function (node) {
            var methodName = _.get(node, 'callee.property.name');
            var fixtureName = _.get(node, 'arguments[0].value');
            var functionName = _.get(node, 'arguments[1].name');

            var styleLink = '[Y123](https://github.com/UptakeTech/angular-styleguide#style-y123)';

            if (methodName === 'controller' && /^[a-z]/.exec(fixtureName)) {
                context.report(
                    node,
                    'Controller name should be UpperCamelCase: ' + styleLink
                );
            }

            // don't run if no function name to compare
            if (!functionName) {
                return;
            }

            switch (methodName) {
                case 'controller':
                case 'directive':
                case 'service':
                case 'factory':
                    if (fixtureName !== functionName) {
                        context.report(node, methodName + ' name should match function name: ' + styleLink);
                    }
            }
        }
    };
};

