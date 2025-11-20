import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer iterflow for chained array operations to enable lazy evaluation',
      recommended: true,
      url: 'https://github.com/gv-sh/iterflow#performance'
    },
    messages: {
      preferIterflow: 'Consider using iterflow for chained operations to enable lazy evaluation and better performance.'
    },
    schema: [],
    hasSuggestions: true
  },
  create(context) {
    return {
      CallExpression(node) {
        // Check for chained array methods like arr.map().filter().reduce()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'CallExpression' &&
          node.callee.object.callee.type === 'MemberExpression'
        ) {
          const method = node.callee.property;
          const prevMethod = node.callee.object.callee.property;

          if (
            method.type === 'Identifier' &&
            prevMethod.type === 'Identifier' &&
            isChainableMethod(method.name) &&
            isChainableMethod(prevMethod.name)
          ) {
            context.report({
              node,
              messageId: 'preferIterflow'
            });
          }
        }
      }
    };
  }
};

function isChainableMethod(name: string): boolean {
  const chainableMethods = [
    'map', 'filter', 'reduce', 'flatMap', 'slice', 'take',
    'drop', 'forEach', 'some', 'every', 'find'
  ];
  return chainableMethods.includes(name);
}

export default rule;
