'use strict';

const path = require('path');
const airlines = require(path.join(__dirname, '..', 'data', 'airlines.json'));

const SUPPORTED_LOCALES = ['en', 'tr', 'es', 'fr', 'de', 'ar'];
let currentLocale = 'en';
const translations = {};
SUPPORTED_LOCALES.forEach(function (locale) {
  translations[locale] = require(path.join(__dirname, '..', 'data', 'translations', locale + '.json'));
});

function getAll() {
  return airlines;
}

function getAirline(query) {
  if (!query || typeof query !== 'string') return null;
  var q = query.toLowerCase();
  var result = airlines.find(function (a) {
    return a.code.toLowerCase() === q || a.name.toLowerCase() === q;
  });
  return result || null;
}

function search(query) {
  if (!query || typeof query !== 'string') return [];
  var q = query.toLowerCase();
  return airlines.filter(function (a) {
    return a.name.toLowerCase().indexOf(q) !== -1 ||
           a.code.toLowerCase().indexOf(q) !== -1;
  });
}

function getByAlliance(alliance) {
  if (!alliance || typeof alliance !== 'string') return [];
  var q = alliance.toLowerCase();
  return airlines.filter(function (a) {
    return a.alliance && a.alliance.toLowerCase() === q;
  });
}

function filterByCarryOnWeight(minKg) {
  if (typeof minKg !== 'number') return [];
  return airlines.filter(function (a) {
    return a.carryOn && a.carryOn.weight && a.carryOn.weight.kg >= minKg;
  });
}

function setLocale(locale) {
  if (SUPPORTED_LOCALES.indexOf(locale) !== -1) {
    currentLocale = locale;
  }
}

function getLocale() {
  return currentLocale;
}

function getLabels() {
  return translations[currentLocale];
}

module.exports = {
  getAll: getAll,
  getAirline: getAirline,
  search: search,
  getByAlliance: getByAlliance,
  filterByCarryOnWeight: filterByCarryOnWeight,
  setLocale: setLocale,
  getLocale: getLocale,
  getLabels: getLabels
};
