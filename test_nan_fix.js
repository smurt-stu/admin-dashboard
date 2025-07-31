// Test script to verify the NaN fix
const { createProductData } = require('./lib/multilingualUtils.ts');

// Test cases
const testCases = [
  {
    name: 'Empty cost_price',
    formData: { cost_price: '', price: '100' },
    expected: undefined
  },
  {
    name: 'null cost_price',
    formData: { cost_price: null, price: '100' },
    expected: undefined
  },
  {
    name: 'undefined cost_price',
    formData: { cost_price: undefined, price: '100' },
    expected: undefined
  },
  {
    name: 'Valid cost_price',
    formData: { cost_price: '50.00', price: '100' },
    expected: '50'
  },
  {
    name: 'Invalid cost_price (NaN)',
    formData: { cost_price: 'invalid', price: '100' },
    expected: undefined
  }
];

console.log('Testing NaN fix for cost_price field...\n');

testCases.forEach((testCase, index) => {
  try {
    const result = createProductData(testCase.formData);
    const actual = result.cost_price;
    const passed = actual === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Input: ${JSON.stringify(testCase.formData.cost_price)}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Actual: ${actual}`);
    console.log(`  Status: ${passed ? 'PASS' : 'FAIL'}\n`);
  } catch (error) {
    console.log(`Test ${index + 1}: ${testCase.name} - ERROR: ${error.message}\n`);
  }
});

console.log('Test completed!'); 