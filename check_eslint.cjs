const { ESLint } = require('eslint');
const fs = require('fs');

(async () => {
  try {
    const eslint = new ESLint({ fix: true });
    const results = await eslint.lintFiles(['packages/components/core']);
    await ESLint.outputFixes(results);
    const count = results.reduce((s, r) => s + r.messages.length, 0);
    const formatter = await eslint.loadFormatter('stylish');
    fs.writeFileSync('eslint_result.txt', '=== REMAINING: ' + count + ' ===\n' + formatter.format(results), 'utf-8');
    console.log('DONE: wrote eslint_result.txt');
  } catch (e) {
    const msg = 'ERR: ' + e.message + '\n' + e.stack;
    fs.writeFileSync('eslint_result.txt', msg, 'utf-8');
    console.log('FAILED: wrote eslint_result.txt');
  }
})();
