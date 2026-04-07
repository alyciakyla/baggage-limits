#!/usr/bin/env node
'use strict';

var path = require('path');
var baggage = require(path.join(__dirname, 'index'));
var table = require(path.join(__dirname, 'table'));
var pkg = require(path.join(__dirname, '..', 'package.json'));

// Parse arguments
var args = process.argv.slice(2);

function getArg(flags) {
  for (var i = 0; i < args.length; i++) {
    for (var f = 0; f < flags.length; f++) {
      if (args[i] === flags[f] && i + 1 < args.length) {
        return args[i + 1];
      }
    }
  }
  return null;
}

function hasFlag(flags) {
  for (var i = 0; i < args.length; i++) {
    for (var f = 0; f < flags.length; f++) {
      if (args[i] === flags[f]) return true;
    }
  }
  return false;
}

// Process locale first
var locale = getArg(['--locale']);
if (locale) {
  baggage.setLocale(locale);
}

var labels = baggage.getLabels();
var jsonMode = hasFlag(['--json']);

// Help
if (hasFlag(['-h', '--help'])) {
  console.log('Usage: baggage-limits [options]');
  console.log('');
  console.log('Options:');
  console.log('  -a, --airline <name|code>   Look up a single airline');
  console.log('  -l, --list                  List all airlines');
  console.log('  --alliance <name>           Filter by alliance');
  console.log('  -s, --search <query>        Search airlines');
  console.log('  --locale <code>             Set language (en, tr, es, fr, de, ar)');
  console.log('  --json                      Output raw JSON');
  console.log('  -h, --help                  Show help');
  console.log('  -v, --version               Show version');
  process.exit(0);
}

// Version
if (hasFlag(['-v', '--version'])) {
  console.log(pkg.version);
  process.exit(0);
}

// Airline lookup
var airlineQuery = getArg(['-a', '--airline']);
if (airlineQuery) {
  var airline = baggage.getAirline(airlineQuery);
  if (!airline) {
    console.log(labels.notFound + ': ' + airlineQuery);
    process.exit(0);
  }
  if (jsonMode) {
    console.log(JSON.stringify(airline, null, 2));
    process.exit(0);
  }
  printAirline(airline);
  process.exit(0);
}

// List all
if (hasFlag(['-l', '--list'])) {
  var all = baggage.getAll();
  if (jsonMode) {
    console.log(JSON.stringify(all, null, 2));
    process.exit(0);
  }
  printAirlineList(all, labels.allAirlines);
  process.exit(0);
}

// Search
var searchQuery = getArg(['-s', '--search']);
if (searchQuery) {
  var results = baggage.search(searchQuery);
  if (jsonMode) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }
  if (results.length === 0) {
    console.log(labels.notFound);
    process.exit(0);
  }
  printAirlineList(results, labels.searchResults);
  process.exit(0);
}

// Alliance filter
var allianceQuery = getArg(['--alliance']);
if (allianceQuery) {
  var allianceResults = baggage.getByAlliance(allianceQuery);
  if (jsonMode) {
    console.log(JSON.stringify(allianceResults, null, 2));
    process.exit(0);
  }
  if (allianceResults.length === 0) {
    console.log(labels.notFound);
    process.exit(0);
  }
  printAirlineList(allianceResults, allianceQuery);
  process.exit(0);
}

// Default: show help
console.log('Usage: baggage-limits [options]');
console.log('Run with --help for more information.');

// --- Output helpers ---

function formatWeight(w) {
  if (!w) return '-';
  return w.kg + ' kg / ' + w.lb + ' lb';
}

function formatDimensions(d) {
  if (!d) return '-';
  return d.cm + ' cm';
}

function printAirline(a) {
  var allianceStr = a.alliance ? ' \u2014 ' + a.alliance : '';
  console.log('\n\u2708 ' + a.name + ' (' + a.code + ')' + allianceStr);
  console.log('');

  // Build baggage table
  var headers = [labels.checked || 'Type', labels.weight || 'Weight', labels.dimensions || 'Dimensions'];
  var rows = [];

  // Carry-on row
  if (a.carryOn) {
    rows.push([
      labels.carryOn || 'Carry-on',
      formatWeight(a.carryOn.weight),
      formatDimensions(a.carryOn.dimensions)
    ]);
  }

  // Personal item row
  if (a.personalItem) {
    var piWeight = a.personalItem.weight ? formatWeight(a.personalItem.weight) : '-';
    var piDims = a.personalItem.dimensions ? formatDimensions(a.personalItem.dimensions) : '-';
    rows.push([labels.personalItem || 'Personal Item', piWeight, piDims]);
  }

  // Checked baggage rows
  if (a.checked) {
    if (a.checked.economy) {
      var eco = a.checked.economy;
      rows.push([
        (labels.checked || 'Checked') + ' (' + (labels.economy || 'Economy') + ')',
        formatWeight(eco.weight) + ' x' + eco.pieces,
        formatDimensions(eco.dimensions)
      ]);
    }
    if (a.checked.business) {
      var biz = a.checked.business;
      rows.push([
        (labels.checked || 'Checked') + ' (' + (labels.business || 'Business') + ')',
        formatWeight(biz.weight) + ' x' + biz.pieces,
        formatDimensions(biz.dimensions)
      ]);
    }
  }

  console.log(table.renderTable(headers, rows));

  // Excess fee
  if (a.excessFee) {
    console.log((labels.excessFee || 'Excess fee') + ': ' + a.excessFee.currency + ' ' + a.excessFee.amount);
  }

  // Website
  if (a.website) {
    console.log((labels.website || 'Website') + ': ' + a.website);
  }
  console.log('');
}

function printAirlineList(airlines, title) {
  if (title) {
    console.log('\n' + title + '\n');
  }
  var headers = [labels.airline || 'Airline', labels.code || 'Code', labels.alliance || 'Alliance'];
  var rows = airlines.map(function (a) {
    return [a.name, a.code, a.alliance || '-'];
  });
  console.log(table.renderTable(headers, rows));
  console.log('');
}
