var _ = require('lodash');

/**
 * https://github.com/UptakeTech/angular-styleguide#style-y022
 *
 * When using a module, avoid using a variable and instead use chaining with the getter syntax.
 *
 * Why?: This produces more readable code and avoids variable collisions or leaks.
 */

module.exports = function (context) {
    return {
        VariableDeclarator: function (node) {
            var objectName = _.get(node, 'init.callee.object.name');
            var propertyName = _.get(node, 'init.callee.property.name');

            if (objectName === 'angular' && propertyName === 'module') {
                context.report(
                    node,
                    '`angular.module` assigned to variable: ' +
                    '[Y022](https://github.com/UptakeTech/angular-styleguide#style-y022)'
                );
            }
        }
    };
};
