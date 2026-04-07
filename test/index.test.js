'use strict';

const assert = require('assert');
const baggage = require('../src/index');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  \u2713 ${name}`); }
  catch (e) { failed++; console.log(`  \u2717 ${name}\n    ${e.message}`); }
}

console.log('API Tests\n');

// getAll
test('getAll() returns array of 48 airlines', function () {
  const all = baggage.getAll();
  assert.ok(Array.isArray(all), 'should be an array');
  assert.strictEqual(all.length, 48);
});

test('getAll() airlines have required fields', function () {
  const airline = baggage.getAll()[0];
  const requiredFields = ['name', 'code', 'alliance', 'carryOn', 'personalItem', 'checked', 'excessFee', 'website'];
  requiredFields.forEach(function (field) {
    assert.ok(field in airline, 'missing field: ' + field);
  });
});

// getAirline by code
test('getAirline("TK") returns Turkish Airlines', function () {
  const tk = baggage.getAirline('TK');
  assert.ok(tk !== null, 'should not be null');
  assert.strictEqual(tk.name, 'Turkish Airlines');
  assert.strictEqual(tk.code, 'TK');
});

test('getAirline("tk") is case-insensitive', function () {
  const tk = baggage.getAirline('tk');
  assert.ok(tk !== null, 'should not be null');
  assert.strictEqual(tk.name, 'Turkish Airlines');
});

// getAirline by name
test('getAirline("Lufthansa") works by name', function () {
  const lh = baggage.getAirline('Lufthansa');
  assert.ok(lh !== null, 'should not be null');
  assert.strictEqual(lh.code, 'LH');
});

test('getAirline("FakeAir") returns null', function () {
  const result = baggage.getAirline('FakeAir');
  assert.strictEqual(result, null);
});

// search
test('search("turkish") finds Turkish Airlines', function () {
  const results = baggage.search('turkish');
  assert.ok(Array.isArray(results), 'should be an array');
  assert.ok(results.length > 0, 'should have results');
  assert.ok(results.some(function (a) { return a.code === 'TK'; }), 'should include TK');
});

test('search("EMIRATES") is case-insensitive', function () {
  const results = baggage.search('EMIRATES');
  assert.ok(results.length > 0, 'should have results');
  assert.ok(results.some(function (a) { return a.name === 'Emirates'; }), 'should include Emirates');
});

test('search("xyznonexistent") returns empty array', function () {
  const results = baggage.search('xyznonexistent');
  assert.ok(Array.isArray(results), 'should be an array');
  assert.strictEqual(results.length, 0);
});

// getByAlliance
test('getByAlliance("Star Alliance") filters correctly', function () {
  const results = baggage.getByAlliance('Star Alliance');
  assert.ok(Array.isArray(results), 'should be an array');
  assert.strictEqual(results.length, 12);
  results.forEach(function (a) {
    assert.strictEqual(a.alliance, 'Star Alliance');
  });
});

test('getByAlliance("skyteam") is case-insensitive', function () {
  const results = baggage.getByAlliance('skyteam');
  assert.ok(results.length > 0, 'should have results');
  results.forEach(function (a) {
    assert.strictEqual(a.alliance, 'SkyTeam');
  });
});

// filterByCarryOnWeight
test('filterByCarryOnWeight(10) returns airlines with >= 10kg carry-on', function () {
  const results = baggage.filterByCarryOnWeight(10);
  assert.ok(Array.isArray(results), 'should be an array');
  assert.strictEqual(results.length, 19);
  results.forEach(function (a) {
    assert.ok(a.carryOn && a.carryOn.weight && a.carryOn.weight.kg >= 10,
      a.name + ' should have carry-on weight >= 10kg');
  });
});

// locale
test('setLocale("tr") changes locale, getLocale() returns it', function () {
  baggage.setLocale('tr');
  assert.strictEqual(baggage.getLocale(), 'tr');
  baggage.setLocale('en'); // reset
});

test('setLocale("xx") ignores unsupported locale', function () {
  baggage.setLocale('en'); // ensure known state
  baggage.setLocale('xx');
  assert.strictEqual(baggage.getLocale(), 'en');
});

test('getLabels() returns correct labels for current locale', function () {
  baggage.setLocale('en');
  const labels = baggage.getLabels();
  assert.strictEqual(labels.airline, 'Airline');
  assert.strictEqual(labels.carryOn, 'Carry-on');

  baggage.setLocale('tr');
  const trLabels = baggage.getLabels();
  assert.strictEqual(trLabels.airline, 'Havayolu');
  assert.strictEqual(trLabels.carryOn, 'Kabin Bagaj\u0131');

  baggage.setLocale('en'); // reset
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
