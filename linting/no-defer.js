var _ = require('lodash');

module.exports = function (context) {
    return {
        CallExpression: function (node) {
            var objectName = _.get(node, 'callee.object.name');
            var methodName = _.get(node, 'callee.property.name');

            if (objectName === '$q' && methodName === 'defer') {
                context.report(node, '$q.defer called');
            }
        }
    };
};
