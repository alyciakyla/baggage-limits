# Baggage Limits

Airline baggage allowance data for **48 major airlines** worldwide — available as a programmatic Node.js API and a command-line tool. Zero dependencies, works offline.

All data sourced and regularly verified from [baggagelimits.co](https://baggagelimits.co).

## Why?

Building a travel app, flight comparison tool, or packing assistant? Baggage rules are scattered across dozens of airline websites, each with different formats. This package gives you **structured, consistent data** for carry-on limits, checked baggage allowances, personal item rules, and excess fees — all in one place, ready to use.

## Install

```bash
npm install baggage-limits
```

Or run the CLI directly without installing:

```bash
npx baggage-limits --airline TK
```

## API Usage

```js
const baggage = require('baggage-limits');
```

### Get all airlines

```js
const airlines = baggage.getAll();
console.log(airlines.length); // 48
```

### Look up a specific airline

Search by **IATA code** or **full airline name** (case-insensitive):

```js
const tk = baggage.getAirline('TK');
// or
const tk = baggage.getAirline('Turkish Airlines');

console.log(tk.carryOn.weight);      // { kg: 8, lb: 17.6 }
console.log(tk.carryOn.dimensions);  // { cm: '55x40x23', in: '21.7x15.7x9' }
console.log(tk.checked.economy);     // { pieces: 1, weight: { kg: 23, lb: 50.7 }, dimensions: { cm: '158 total', in: '62 total' } }
console.log(tk.checked.business);    // { pieces: 2, weight: { kg: 32, lb: 70.6 }, dimensions: { cm: '158 total', in: '62 total' } }
console.log(tk.excessFee);           // { currency: 'USD', amount: 8 }

// Returns null if airline is not found
baggage.getAirline('FakeAirline'); // null
```

### Search airlines

Partial, case-insensitive text search across airline names and codes:

```js
baggage.search('air');
// Returns: Air Arabia, Air Canada, Air France, Air New Zealand, ...

baggage.search('wizz');
// Returns: [{ name: 'Wizz Air', code: 'W6', ... }]
```

### Filter by alliance

```js
const starAlliance = baggage.getByAlliance('Star Alliance');
// Turkish Airlines, Lufthansa, ANA, Singapore Airlines, United, ...

const oneworld = baggage.getByAlliance('oneworld');
// American Airlines, British Airways, Cathay Pacific, Qantas, ...

const skyteam = baggage.getByAlliance('SkyTeam');
// Air France, Delta, KLM, Korean Air, ...
```

### Filter by carry-on weight limit

Find airlines that allow at least a given weight in the cabin:

```js
const generous = baggage.filterByCarryOnWeight(10);
// Airlines allowing 10 kg or more as carry-on
// Aegean (13kg), Aeroflot (10kg), American Airlines (18kg), ...
```

### Multi-language support

Labels and headers can be displayed in 6 languages:

| Code | Language |
|------|----------|
| `en` | English (default) |
| `tr` | Turkish |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `ar` | Arabic |

&nbsp;

```js
baggage.setLocale('tr');
console.log(baggage.getLocale());  // 'tr'

const labels = baggage.getLabels();
console.log(labels.carryOn);       // 'Kabin Bagajı'
console.log(labels.checked);       // 'Kayıtlı Bagaj'
console.log(labels.excessFee);     // 'Fazla Bagaj Ücreti'

// Unsupported locales are silently ignored
baggage.setLocale('xx'); // locale stays unchanged
```

## CLI Usage

### Look up an airline

```bash
$ baggage-limits --airline TK

✈ Turkish Airlines (TK) — Star Alliance

+----------------------------+--------------------+--------------+
| Type                       | Weight             | Dimensions   |
+----------------------------+--------------------+--------------+
| Carry-on                   | 8 kg / 17.6 lb     | 55x40x23 cm  |
| Personal Item              | -                  | 40x30x15 cm  |
| Checked Baggage (Economy)  | 23 kg / 50.7 lb x1 | 158 total cm |
| Checked Baggage (Business) | 32 kg / 70.6 lb x2 | 158 total cm |
+----------------------------+--------------------+--------------+
Excess Fee: USD 8
Website: https://www.turkishairlines.com
```

### List all airlines

```bash
$ baggage-limits --list

All Airlines (48):

+-------------------------------+------+---------------+
| Airline                       | Code | Alliance      |
+-------------------------------+------+---------------+
| Aegean Airlines               | A3   | Star Alliance |
| Aeroflot                      | SU   | SkyTeam       |
| Air Arabia                    | G9   | -             |
| ...                           | ...  | ...           |
+-------------------------------+------+---------------+
```

### Search, filter, and more

```bash
# Search by partial name
baggage-limits --search united

# Filter by alliance
baggage-limits --alliance "Star Alliance"

# Display in Turkish
baggage-limits --airline TK --locale tr

# Get raw JSON (great for piping to jq or other tools)
baggage-limits --airline TK --json

# Show help
baggage-limits --help
```

### All CLI flags

| Flag | Short | Description |
|------|-------|-------------|
| `--airline <name\|code>` | `-a` | Look up an airline by name or IATA code |
| `--list` | `-l` | List all 48 airlines |
| `--alliance <name>` | | Filter airlines by alliance name |
| `--search <query>` | `-s` | Search airlines by partial name match |
| `--locale <code>` | | Set output language (`en`, `tr`, `es`, `fr`, `de`, `ar`) |
| `--json` | | Output results as raw JSON |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show package version |

## Data Schema

Each airline record contains the following fields:

```js
{
  name: 'Turkish Airlines',       // Full airline name
  code: 'TK',                     // IATA airline code
  alliance: 'Star Alliance',      // Alliance name or null

  carryOn: {
    weight: { kg: 8, lb: 17.6 },           // Cabin bag weight limit
    dimensions: { cm: '55x40x23', in: '21.7x15.7x9' }  // LxWxH
  },

  personalItem: {                  // null if not separately defined
    weight: { kg: 4, lb: 8.8 },
    dimensions: { cm: '40x30x15', in: '15.7x11.8x5.9' }
  },

  checked: {
    economy: {
      pieces: 1,                   // Number of bags included
      weight: { kg: 23, lb: 50.7 },
      dimensions: { cm: '158 total', in: '62 total' }  // L+W+H
    },
    business: {
      pieces: 2,
      weight: { kg: 32, lb: 70.6 },
      dimensions: { cm: '158 total', in: '62 total' }
    }
  },

  excessFee: {                     // null if not available
    currency: 'USD',
    amount: 8                      // Per-unit fee
  },

  website: 'https://www.turkishairlines.com'  // Airline baggage policy page
}
```

## Airlines Covered

48 airlines across all three major alliances and independent carriers:

**Star Alliance:** Aegean Airlines, Air Canada, Air New Zealand, ANA, EVA Air, Finnair, Lufthansa, SAS, Singapore Airlines, Swiss, TAP Air Portugal, Turkish Airlines, United Airlines

**oneworld:** Alaska Airlines, American Airlines, British Airways, Cathay Pacific, Iberia, Japan Airlines, Malaysian Airlines, Qantas, Qatar Airways

**SkyTeam:** Aeroflot, Air France, China Southern, Delta, KLM, Korean Air, Saudia, Vietnam Airlines (via LATAM)

**Independent / LCC:** Air Arabia, EasyJet, Emirates, Etihad, Flydubai, Hawaiian Airlines, IndiGo, JetBlue, Norwegian, Oman Air, Pegasus, Ryanair, Southwest, Spirit, Virgin Atlantic, Vueling, Wizz Air

## Use Cases

- **Travel apps** — Show passengers their baggage allowance during booking
- **Packing assistants** — Help travelers know weight/size limits before they pack
- **Flight comparison tools** — Compare baggage policies side by side
- **Airport kiosks** — Quick lookup for check-in staff
- **CLI power users** — Check limits before heading to the airport
- **Chatbots & AI agents** — Provide structured airline data in conversational UIs

## License

MIT

## Links

- Data source: [baggagelimits.co](https://baggagelimits.co)
- npm: [npmjs.com/package/baggage-limits](https://www.npmjs.com/package/baggage-limits)
- Issues & contributions welcome
