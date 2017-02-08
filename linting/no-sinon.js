var _ = require('lodash');

module.exports = function (context) {
    var disallowedMethods = _.get(context, 'options[0]', ['spy']);
    var recommended = _.get(context, 'options[1]', 'stub');

    return {
        CallExpression: function (node) {
            var object = _.get(node, 'callee.object.name');
            var property = _.get(node, 'callee.property.name');

            if (object === 'sinon') {
                _.each(disallowedMethods, function (disallowedMethod) {
                    if (property === disallowedMethod) {
                        context.report(node, 'Use `sinon.' + recommended + '` instead of `sinon.' + disallowedMethod + '`.');
                    }
                });
            }
        }
    };
};
