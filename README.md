# Baggage Limits

> Know your baggage allowance before you fly.

**[baggagelimits.co](https://baggagelimits.co)** is the most comprehensive airline baggage reference on the web — covering **48 major airlines**, **50+ countries**, and available in **6 languages**. Whether you're a frequent flyer, a first-time traveler, or building a travel product, we have the data you need.

---

## What is baggagelimits.co?

[baggagelimits.co](https://baggagelimits.co) answers the questions every traveler asks before a flight:

- **How heavy can my carry-on be?**
- **What are the size limits for cabin baggage?**
- **How many checked bags can I bring?**
- **What happens if my bag is overweight?**
- **What's the difference between Economy and Business?**

We track carry-on rules, checked baggage allowances, personal item policies, and excess baggage fees for every major airline — all in one place, updated regularly, and verified against official airline sources.

### Airlines We Cover

We track baggage policies for **48 airlines** across all three major alliances and independent carriers:

| Alliance | Airlines |
|----------|----------|
| **Star Alliance** | Aegean Airlines, Air Canada, Air New Zealand, ANA, EVA Air, Finnair, Lufthansa, SAS, Singapore Airlines, Swiss, TAP Air Portugal, Turkish Airlines, United Airlines |
| **oneworld** | Alaska Airlines, American Airlines, British Airways, Cathay Pacific, Iberia, Japan Airlines, Malaysia Airlines, Qantas, Qatar Airways |
| **SkyTeam** | Aeroflot, Air France, China Southern, Delta, KLM, Korean Air, LATAM Airlines, Saudia |
| **Independent / LCC** | Air Arabia, EasyJet, Emirates, Etihad, Flydubai, Hawaiian Airlines, IndiGo, JetBlue, Norwegian, Oman Air, Pegasus, Ryanair, Southwest, Spirit, Virgin Atlantic, Vueling, Wizz Air |

### Available Languages

| Language | URL |
|----------|-----|
| English | [baggagelimits.co](https://baggagelimits.co) |
| Turkish | [baggagelimits.co/tr](https://baggagelimits.co/tr) |
| Spanish | [baggagelimits.co/es](https://baggagelimits.co/es) |
| French | [baggagelimits.co/fr](https://baggagelimits.co/fr) |
| German | [baggagelimits.co/de](https://baggagelimits.co/de) |
| Arabic | [baggagelimits.co/ar](https://baggagelimits.co/ar) |

---

## npm Package

All the data from [baggagelimits.co](https://baggagelimits.co) is also available as an npm package for developers. Zero dependencies, works offline, includes a CLI.

```bash
npm install baggage-limits
```

### Quick Example

```js
const baggage = require('baggage-limits');

// Look up any airline by name or IATA code
const tk = baggage.getAirline('TK');
console.log(tk.carryOn.weight);   // { kg: 8, lb: 17.6 }
console.log(tk.carryOn.dimensions); // { cm: '55x40x23', in: '21.7x15.7x9' }

// Search airlines
baggage.search('air');  // Air Arabia, Air Canada, Air France, ...

// Filter by alliance
baggage.getByAlliance('Star Alliance');

// Filter by carry-on weight
baggage.filterByCarryOnWeight(10); // Airlines allowing 10kg+ carry-on

// Multi-language labels
baggage.setLocale('tr');
baggage.getLabels().carryOn; // 'Kabin Bagaji'
```

### CLI

```bash
$ npx baggage-limits --airline TK

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

```bash
baggage-limits --list                      # List all 48 airlines
baggage-limits --search wizz               # Search by name
baggage-limits --alliance "Star Alliance"  # Filter by alliance
baggage-limits --airline TK --json         # JSON output
baggage-limits --airline TK --locale tr    # Turkish labels
```

### Data Per Airline

Each airline record includes:

| Field | Description |
|-------|-------------|
| `name` | Full airline name |
| `code` | IATA airline code |
| `alliance` | Star Alliance, oneworld, SkyTeam, or null |
| `carryOn` | Weight (kg/lb) and dimensions (cm/in) |
| `personalItem` | Weight and dimensions, or null |
| `checked.economy` | Pieces, weight, and max dimensions |
| `checked.business` | Pieces, weight, and max dimensions |
| `excessFee` | Currency and amount, or null |
| `website` | Official airline baggage policy page |

Full API documentation available on [npm](https://www.npmjs.com/package/baggage-limits).

---

## Who Uses This?

- **Travel apps** — Show passengers their baggage allowance during booking
- **Packing assistants** — Help travelers know weight/size limits before they pack
- **Flight comparison tools** — Compare baggage policies side by side
- **Airport kiosks and check-in systems** — Quick baggage lookup for staff
- **Chatbots and AI agents** — Provide structured airline data in conversational UIs
- **Developers and CLI power users** — Check limits right from the terminal

---

## Links

- **Website:** [baggagelimits.co](https://baggagelimits.co)
- **npm:** [npmjs.com/package/baggage-limits](https://www.npmjs.com/package/baggage-limits)

## License

MIT
