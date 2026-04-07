'use strict';

var assert = require('assert');
var execSync = require('child_process').execSync;
var path = require('path');

var CLI = 'node ' + JSON.stringify(path.join(__dirname, '..', 'src', 'cli.js'));

var passed = 0;
var failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log('  \u2713 ' + name); }
  catch (e) { failed++; console.log('  \u2717 ' + name + '\n    ' + e.message); }
}

function run(args) {
  return execSync(CLI + ' ' + args, { encoding: 'utf8', timeout: 5000 });
}

console.log('CLI Tests\n');

test('--help shows usage info', function () {
  var out = run('--help');
  assert.ok(out.indexOf('Usage') !== -1 || out.indexOf('usage') !== -1, 'should contain usage info');
  assert.ok(out.indexOf('--airline') !== -1, 'should mention --airline flag');
});

test('--version shows semver', function () {
  var out = run('--version');
  assert.ok(/\d+\.\d+\.\d+/.test(out.trim()), 'should match semver pattern');
});

test('--airline TK shows Turkish Airlines', function () {
  var out = run('--airline TK');
  assert.ok(out.indexOf('Turkish Airlines') !== -1, 'should contain Turkish Airlines');
  assert.ok(out.indexOf('TK') !== -1, 'should contain TK code');
});

test('-a LH shows Lufthansa', function () {
  var out = run('-a LH');
  assert.ok(out.indexOf('Lufthansa') !== -1, 'should contain Lufthansa');
});

test('--airline FAKE shows not found', function () {
  var out = run('--airline FAKE');
  assert.ok(out.toLowerCase().indexOf('not found') !== -1, 'should show not found message');
});

test('--list shows all airlines', function () {
  var out = run('--list');
  assert.ok(out.indexOf('Turkish Airlines') !== -1, 'should contain Turkish Airlines');
  assert.ok(out.indexOf('Lufthansa') !== -1, 'should contain Lufthansa');
  assert.ok(out.indexOf('Emirates') !== -1, 'should contain Emirates');
});

test('--search wizz finds Wizz Air', function () {
  var out = run('--search wizz');
  assert.ok(out.indexOf('Wizz Air') !== -1, 'should contain Wizz Air');
});

test('--alliance "Star Alliance" filters correctly', function () {
  var out = run('--alliance "Star Alliance"');
  assert.ok(out.indexOf('Turkish Airlines') !== -1, 'should contain Turkish Airlines');
  assert.ok(out.indexOf('Lufthansa') !== -1, 'should contain Lufthansa');
});

test('--airline TK --json outputs valid JSON', function () {
  var out = run('--airline TK --json');
  var data = JSON.parse(out);
  assert.strictEqual(data.name, 'Turkish Airlines');
  assert.strictEqual(data.code, 'TK');
});

test('--locale tr changes labels', function () {
  var out = run('--airline TK --locale tr');
  assert.ok(out.indexOf('Kabin') !== -1 || out.indexOf('Bagaj') !== -1 || out.indexOf('A\u011f\u0131rl\u0131k') !== -1,
    'should contain Turkish labels');
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
