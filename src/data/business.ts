/**
 * McLeod's Spring & Chassis: the single source of truth for every factual
 * claim on the site.
 *
 * 1. If a fact is not in this file, it does not go on the website.
 * 2. Change it here and it changes everywhere. Never hard-code a phone number,
 *    hour or claim into a page.
 * 3. Anything marked TODO(mcleods) is unconfirmed or conflicting. Check with
 *    the Baileys before launch. Do not invent replacements.
 *
 * Sources (all public, gathered 2026-10-06):
 *  - Google Business Profile (rating, reviews, address, phone, "closes 5 PM")
 *  - The McLeod's Facebook page: bio, contact info, posts and photo captions
 *    (raw-assets/facebook/posts.txt), including their newspaper ads
 *  - Directory listings: Snow Plow News and meyerdealers.com (Meyer dealer)
 */

export const company = {
  name: "McLeod's Spring & Chassis",
  shortName: "McLeod's",
  // Facebook bio, and printed on the logo and every ad.
  tagline: 'Your truck chassis specialists',
  shortDescription:
    "Family-owned since 1987: heavy truck repair shop and parts store in Barre, Vermont. Springs and suspension, brakes, alignment, frame repair and welding, hydraulic hoses, and Meyer snowplows, for pickups through tractor trailers.",
  // Brian & Shannon Bailey run the shop with their kids Brian Jr. and Caitlin
  // (Facebook posts). TODO(mcleods): confirm how they want the family named.
  owners: 'Brian & Shannon Bailey',
  url: 'https://www.mcleodsspring.com', // TODO(mcleods): confirm domain
  phone: '(802) 476-4971',
  phoneRaw: '+18024764971',
  // On their mud flaps, truck lettering and the McLeod's/Bailey event banner.
  tollFree: '(800) 464-4971',
  tollFreeRaw: '+18004644971',
  email: 'mcleodsspring@gmail.com',
  facebook: 'https://www.facebook.com/McLeodsSpringandChassis/',
  street: '32 Blackwell St',
  city: 'Barre',
  state: 'VT',
  zip: '05641',
  address: '32 Blackwell St, Barre, VT 05641',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=McLeod%27s+Spring+%26+Chassis+32+Blackwell+St+Barre+VT+05641',
  // Approximate, Blackwell St in Barre. Used for schema only.
  geo: { lat: 44.2016, lng: -72.5056 },
};

/**
 * History.
 *  - "Year Founded: 1987", legal name Lowell McLeod's, Inc. (Buzzfile, Yelp,
 *    D&B directory listings).
 *  - "Brian Bailey is the owner and founder of McLeod's Spring and Chassis in
 *    Barre." (Vermont Fish & Wildlife press release, March 2019)
 *  - Before that it was the McLeod family business, Lowell McLeod Inc., run by
 *    Harrison McLeod, who "sold the family business to Brian and Kevin Bailey
 *    (it still operates today under Brian Bailey as McLeod's Spring and
 *    Chassis)" (Myrtle B. McLeod obituary, Times Argus, Dec 2015).
 * TODO(mcleods): confirm 1987 is the year the Baileys took over, and ask when
 * the McLeods first opened. If it is older, it belongs on the site.
 */
export const history = {
  founded: 1987,
  legalName: "Lowell McLeod's, Inc.",
  years: new Date().getFullYear() - 1987,
  timeline: [
    { when: 'Before', title: 'The McLeod family shop', text: 'Harrison McLeod spends long hours running the family business, Lowell McLeod Inc., in Barre.' },
    { when: '1987', title: 'The Baileys take the keys', text: "Harrison sells to Brian and Kevin Bailey. Lowell McLeod's, Inc. carries on as McLeod's Spring & Chassis, with Brian at the helm." },
    { when: 'Since', title: 'Brian & Shannon', text: 'Brian and Shannon Bailey spend most of their married life keeping the place humming.' },
    { when: 'Today', title: 'The next generation', text: 'Brian Jr. and Caitlin work alongside their parents, and the family runs a second shop in Essex Junction.' },
  ],
};

export const cta = {
  call: `Call ${company.phone}`,
  directions: 'Get directions',
};

/**
 * TODO(mcleods): only "closes 5 PM" is public (Google). Facebook posts mention
 * closing at 4 on a holiday Friday. Get the full weekly hours before launch.
 * Until then the site says "Weekdays, closes 5 PM" and nothing more specific.
 */
export const hours = {
  summary: 'Weekdays, closes 5 PM',
  // Left out of the JSON-LD until the opening time is confirmed.
  confirmed: false,
};

export const ratings = {
  google: { rating: 4.9, count: 91 },
  facebook: { recommendPct: 100, count: 11 },
};

/** Sister shop, named in their hiring posts and on the shared event banner. */
export const sister = {
  name: 'Bailey Spring & Chassis',
  town: 'Essex Junction, VT',
  address: '15A Maple St, Essex Jct, VT',
  tollFree: '(800) 339-0801',
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  items: string[];
  /** Where the claim comes from, so nobody has to guess later. */
  source: string;
};

export const services: Service[] = [
  {
    slug: 'springs',
    name: 'Springs & suspension',
    short: 'Broken leaves, sagging packs and overloaded trucks. Springs replaced, rebuilt, re-fit or helped out with an added leaf.',
    items: ['Leaf spring replacement', 'Add-a-leaf', 'Stretch and fit', 'Bushings, pins and hangers', 'Custom U-bolts'],
    source: 'Shop name; Google reviews (Corey Norris, anthony wright, derek merusi, Andrew Spencer); parts post',
  },
  {
    slug: 'brakes',
    name: 'Brakes',
    short: 'Brake work for light duty pickups up through heavy trucks and trailers.',
    items: ['Light to heavy duty', 'Trucks and trailers', 'Brake parts in stock'],
    source: 'Google review (Marc Blaine); Facebook services post; parts post',
  },
  {
    slug: 'alignment',
    name: 'Alignment & chassis',
    short: 'Chassis and alignment work that keeps fleet trucks tracking straight and wearing tires evenly.',
    items: ['Alignments', 'Chassis repair', 'Steering and suspension'],
    source: 'Google review (Bill Heywood); Yelp listing',
  },
  {
    slug: 'welding',
    name: 'Frame repair & fabrication',
    short: 'Cracked frames, rusted rails, dump bodies and one-off fabrication other shops turn away.',
    items: ['Frame repair', 'Custom welding', 'Dump bodies', 'Body swaps'],
    source: "Facebook ('We do a lot of frame repairs', dump body and body swap posts); Google reviews (Seth Mellinger, Bruce Melendy)",
  },
  {
    slug: 'hydraulics',
    name: 'Hydraulic hoses',
    short: 'Hydraulic and industrial hose assemblies made in-house while you wait.',
    items: ['Built in-house', 'Custom assemblies', 'Fittings'],
    source: "Facebook 'New Service Alert' post; shop sign: Authorized Gates Service Center, made in minutes",
  },
  {
    slug: 'plows',
    name: 'Snowplows & spreaders',
    short: 'Authorized Meyer dealer. Plows and sanders sold, installed and serviced, and every plow brand repaired.',
    items: ['Meyer plows', 'Salt and sand spreaders', 'Installs', 'All brands repaired'],
    source: "Meyer dealer listings; Facebook posts; their newspaper ad ('We repair all snowplow brands')",
  },
];

/** Facebook "Did you know?" post plus chain, cable and tire chain posts. */
export const parts = {
  intro: "Not just a heavy-duty repair shop. McLeod's is a full parts store right here in Barre.",
  groups: [
    { name: 'Hardware', items: ['Nuts, bolts and washers', 'U-bolts', 'Bushings, pins and hangers'] },
    { name: 'Chassis', items: ['Springs', 'Brake parts', 'Hoses and fittings'] },
    { name: 'Rigging', items: ['Chain and binders', 'Tire chains, four-wheelers to skidders', 'Regular and swaged cable'] },
    { name: 'Hydraulics', items: ['Hoses built in-house', 'Made while you wait', 'Gates service center'] },
  ],
};

/**
 * What they work on, from the reviews and Facebook photos (crane trucks, log
 * trucks, wreckers, dump trucks, municipal plow trucks, RVs and trailers).
 */
export const fleet = [
  { name: 'Pickups & SUVs', note: 'Half tons to one-tons' },
  { name: 'Dump trucks', note: 'Municipal and contractor' },
  { name: 'Tractor trailers', note: 'Tractors, trailers, wreckers' },
  { name: 'Log & crane trucks', note: 'Logging and heavy equipment' },
  { name: 'RVs & trailers', note: 'Hitches, springs, axles' },
];

export const faqs = [
  {
    q: 'Do you work on regular pickups, or only big trucks?',
    a: 'Both. Customers bring in everything from F-150s and passenger cars to tractor trailers, dump trucks and log trucks. If it has springs and a frame, bring it in.',
  },
  {
    q: 'How long have you been around?',
    a: "The Bailey family has run McLeod's since 1987, and before that it was the McLeod family's business. Some customers have been coming for about thirty years.",
  },
  {
    q: 'Can I just buy parts?',
    a: `Yes. McLeod's is a full parts store: U-bolts, bushings, pins and hangers, springs, brake parts, hoses and fittings, chain, cable and hardware. Call ${company.phone} to check stock.`,
  },
  {
    q: 'Do you sell and install snowplows?',
    a: "Yes. McLeod's is an authorized Meyer dealer for plows and salt and sand spreaders, sells and installs them, and repairs every plow brand.",
  },
  {
    q: 'Can you make a hydraulic hose while I wait?',
    a: 'Yes. Hydraulic and industrial hose assemblies are built in-house, usually in minutes. Bring the old hose or the fitting sizes.',
  },
  {
    q: 'Where are you?',
    a: `${company.address}. There is room in the yard for big rigs and trailers.`,
  },
  {
    q: 'Is there a location closer to Burlington?',
    a: `The same family runs ${sister.name} at ${sister.address}.`,
  },
];

/** Hiring, from their 2026 Facebook posts. TODO(mcleods): confirm still open. */
export const hiring = {
  open: true,
  roles: ['Truck technicians', 'Front counter / parts sales'],
  pitch: "Mechanically inclined, dependable and proud of your work? Heavy-duty experience is a plus. Stop in at 32 Blackwell St or give us a call.",
};
