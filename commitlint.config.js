export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'init',
        'feat',
        'fix',
        'ui',
        'refactor',
        'perf',
        'release',
        'deploy',
        'docs',
        'test',
        'chore',
        'style',
        'revert',
        'add',
        'minus',
        'del',
        'hotfix',
      ],
    ],
  },
};
