import preferIterflowOverArray from './rules/prefer-iterflow-over-array';
import noArrayFromInLoop from './rules/no-array-from-in-loop';
import preferLazyEvaluation from './rules/prefer-lazy-evaluation';

const plugin = {
  meta: {
    name: 'eslint-plugin-iterflow',
    version: '0.1.0'
  },
  rules: {
    'prefer-iterflow-over-array': preferIterflowOverArray,
    'no-array-from-in-loop': noArrayFromInLoop,
    'prefer-lazy-evaluation': preferLazyEvaluation
  },
  configs: {
    recommended: {
      plugins: ['iterflow'],
      rules: {
        'iterflow/prefer-iterflow-over-array': 'warn',
        'iterflow/no-array-from-in-loop': 'error',
        'iterflow/prefer-lazy-evaluation': 'warn'
      }
    },
    strict: {
      plugins: ['iterflow'],
      rules: {
        'iterflow/prefer-iterflow-over-array': 'error',
        'iterflow/no-array-from-in-loop': 'error',
        'iterflow/prefer-lazy-evaluation': 'error'
      }
    }
  }
};

export default plugin;
