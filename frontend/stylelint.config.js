/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
    'selector-class-pattern': [
      '^([a-z][a-z0-9-]*|mdc-[a-z0-9_-]+|mat-[a-z0-9-]+)$',
      { resolveNestedSelectors: true }
    ],
  },
};
