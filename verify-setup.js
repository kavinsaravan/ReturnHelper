#!/usr/bin/env node

/**
 * Quick verification script to check if the project is set up correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ReturnsRunner setup...\n');

const checks = [
  {
    name: 'React installed',
    test: () => fs.existsSync('node_modules/react'),
  },
  {
    name: 'React Native installed',
    test: () => fs.existsSync('node_modules/react-native'),
  },
  {
    name: 'TypeScript types installed',
    test: () => fs.existsSync('node_modules/@types/react'),
  },
  {
    name: 'Navigation libraries installed',
    test: () => fs.existsSync('node_modules/@react-navigation/native'),
  },
  {
    name: 'App.tsx exists',
    test: () => fs.existsSync('App.tsx'),
  },
  {
    name: 'Source files exist',
    test: () => fs.existsSync('src/screens') && fs.existsSync('src/services'),
  },
  {
    name: 'Configuration files exist',
    test: () => fs.existsSync('package.json') && fs.existsSync('tsconfig.json'),
  },
];

let allPassed = true;

checks.forEach(check => {
  const passed = check.test();
  console.log(passed ? '✅' : '❌', check.name);
  if (!passed) allPassed = false;
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ All checks passed! Your project is ready.');
  console.log('\n📱 Next steps:');
  console.log('   For iOS:  npm run ios');
  console.log('   For Android: npm run android');
} else {
  console.log('❌ Some checks failed. Please review the errors above.');
}

console.log('='.repeat(50) + '\n');
