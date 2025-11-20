import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer lazy evaluation patterns when only first N items are needed',
      recommended: true,
      url: 'https://github.com/gv-sh/iterflow#lazy-evaluation'
    },
    messages: {
      preferLazy: 'Consider using iterflow with take() for lazy evaluation instead of filtering entire array and then slicing.'
    },
    schema: []
  },
  create(context) {
    return {
      CallExpression(node) {
        // Detect pattern: array.filter(...).slice(0, n)
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'slice' &&
          node.callee.object.type === 'CallExpression' &&
          node.callee.object.callee.type === 'MemberExpression' &&
          node.callee.object.callee.property.type === 'Identifier' &&
          (node.callee.object.callee.property.name === 'filter' ||
           node.callee.object.callee.property.name === 'map')
        ) {
          const args = node.arguments;
          if (args.length >= 1 && args[0].type === 'Literal' && args[0].value === 0) {
            context.report({
              node,
              messageId: 'preferLazy'
            });
          }
        }
      }
    };
  }
};

export default rule;
