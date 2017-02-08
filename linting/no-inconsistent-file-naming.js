var _ = require('lodash');
var path = require('path');

/**
 * https://github.com/UptakeTech/angular-styleguide#style-y121
 *
 * Use consistent names for all components following a pattern
 * that describes the component's feature then (optionally) its
 * type. My recommended pattern is `feature.type.js`.
 *
 * Why?: Provides a consistent way to quickly identify components.
 *
 * Why?: Provides pattern matching for any automated tasks.
 */
module.exports = function (context) {
    return {
        CallExpression: CallExpression
    };

    function CallExpression(node) {
        var methodName = _.get(node, 'callee.property.name');

        var fileName = path.basename(context.getFilename());

        // don't run on calls other than `angular.*`
        if (!node.arguments[1]) {
            return;
        }

        switch (methodName) {
            case 'controller':
            case 'directive':
            case 'service':
            case 'provider':
            case 'factory':
                if (fileName.indexOf(methodName) === -1 && fileName.indexOf('.spec.') === -1) {
                    context.report(
                        node,
                        'Filename should indicate its feature and type: ' +
                        '[Y121](https://github.com/UptakeTech/angular-styleguide#style-y121)'
                    );
                }
        }
    }
};
