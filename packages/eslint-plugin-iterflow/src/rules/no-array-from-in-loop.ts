import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid using Array.from() inside loops when iterflow can work with iterators directly',
      recommended: true,
      url: 'https://github.com/gv-sh/iterflow#lazy-evaluation'
    },
    messages: {
      noArrayFromInLoop: 'Avoid Array.from() in loops. Use iterflow to work with iterators directly for better performance.'
    },
    schema: []
  },
  create(context) {
    let loopDepth = 0;

    return {
      'ForStatement, ForInStatement, ForOfStatement, WhileStatement, DoWhileStatement'() {
        loopDepth++;
      },
      'ForStatement, ForInStatement, ForOfStatement, WhileStatement, DoWhileStatement:exit'() {
        loopDepth--;
      },
      CallExpression(node) {
        if (
          loopDepth > 0 &&
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Array' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'from'
        ) {
          context.report({
            node,
            messageId: 'noArrayFromInLoop'
          });
        }
      }
    };
  }
};

export default rule;
