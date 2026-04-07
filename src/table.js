'use strict';

function renderTable(headers, rows) {
  if (!headers || !headers.length) return '';

  // Calculate column widths
  var widths = headers.map(function (h) { return h.length; });
  rows.forEach(function (row) {
    row.forEach(function (cell, i) {
      var len = String(cell).length;
      if (len > widths[i]) widths[i] = len;
    });
  });

  // Build separator line
  var separator = '+' + widths.map(function (w) {
    return '-'.repeat(w + 2);
  }).join('+') + '+';

  // Build header row
  var headerRow = '|' + headers.map(function (h, i) {
    return ' ' + h + ' '.repeat(widths[i] - h.length) + ' ';
  }).join('|') + '|';

  // Build data rows
  var dataRows = rows.map(function (row) {
    return '|' + row.map(function (cell, i) {
      var s = String(cell);
      return ' ' + s + ' '.repeat(widths[i] - s.length) + ' ';
    }).join('|') + '|';
  });

  var lines = [separator, headerRow, separator];
  dataRows.forEach(function (r) { lines.push(r); });
  lines.push(separator);

  return lines.join('\n');
}

module.exports = { renderTable: renderTable };
