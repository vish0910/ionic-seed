var _ = require('lodash');

module.exports = function (context) {
    return {
        CallExpression: function (node) {
            var type = _.get(node, 'callee.type');
            var name = _.get(node, 'callee.name');
            var description = _.get(node, 'arguments[0].value');

            if (type === 'Identifier' && (name === 'context' || name === 'it')) {
                if (/#.*\(\)/.test(description)) {
                    context.report(node, 'Use `describe` for method description suite.');
                }
            }
        }
    };
};
