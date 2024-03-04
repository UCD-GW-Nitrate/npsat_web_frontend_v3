module.exports = {
  '*.{js,jsx,ts,tsx}': [],
  '**/*.ts?(x)': () => 'npm run check-types',
  '*.{json,yaml}': ['prettier --write'],
};
