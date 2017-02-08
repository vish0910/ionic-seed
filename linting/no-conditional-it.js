var _ = require('lodash');

module.exports = function (context) {
    return {
        CallExpression: function (node) {
            var type = _.get(node, 'callee.type');
            var name = _.get(node, 'callee.name');
            var description = _.get(node, 'arguments[0].value');

            if (type === 'Identifier' && name === 'it' && / (if|when|on) /.test(description)) {
                context.report(node, 'Conditions should be in `context` block, not `it` description.');
            }
        }
    };
};
