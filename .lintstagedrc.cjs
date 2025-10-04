module.exports = {
  'src/**/*.{ts}': [
    'eslint --report-unused-disable-directives --max-warnings 0',
    () => 'tsc-files --noEmit',
  ]
};
