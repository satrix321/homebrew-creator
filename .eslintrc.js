module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'node': true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  'rules': {
    'semi': 2,
    'quotes': [2, 'single'],
    'no-console': 0,
    'no-warning-comments': [1, { 'terms': ['todo', 'fixme'], 'location': 'anywhere' }]
  },
  'parserOptions': {
    'parser': 'babel-eslint',
  }
};
