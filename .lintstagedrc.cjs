// eslint-disable-next-line no-undef
module.exports = {
  'src/**/*.{ts}': 'eslint --report-unused-disable-directives --max-warnings 0',
  'src/**/*.{ts}': () => {
    return 'tsc-files --noEmit';
  },
};
