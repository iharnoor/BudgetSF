-- WealthLens: Normalized SF venue & alternatives database
-- 3 tables: sf_venues, venue_alternatives, merchant_aliases

-- ============================================================
-- Drop old JSONB-based tables (no production data yet)
-- ============================================================
drop table if exists merchant_aliases cascade;
drop table if exists merchant_alternatives cascade;

-- ============================================================
-- sf_venues: every business that matters in SF
-- Both "expensive" merchants AND their cheaper alternatives
-- ============================================================
create table sf_venues (
    id              uuid primary key default gen_random_uuid(),
    name            text not null,
    slug            text unique not null,
    category        text not null,
    subcategory     text,
    neighborhood    text,
    address         text,
    lat             double precision,
    lng             double precision,
    price_tier      int not null default 2,
    avg_price       text,
    tags            text[] default '{}',
    is_chain        boolean default false,
    google_place_id text,
    description     text,
    city            text not null default 'San Francisco',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_sf_venues_category on sf_venues(category);
create index idx_sf_venues_subcategory on sf_venues(subcategory);
create index idx_sf_venues_neighborhood on sf_venues(neighborhood);
create index idx_sf_venues_price_tier on sf_venues(price_tier);
create index idx_sf_venues_city on sf_venues(city);
create index idx_sf_venues_slug on sf_venues(slug);

-- ============================================================
-- venue_alternatives: the relationship map
-- ============================================================
create table venue_alternatives (
    id                  uuid primary key default gen_random_uuid(),
    expensive_venue_id  uuid not null references sf_venues(id) on delete cascade,
    cheaper_venue_id    uuid not null references sf_venues(id) on delete cascade,
    estimated_savings   text,
    reason              text,
    sort_order          int not null default 0,
    unique(expensive_venue_id, cheaper_venue_id)
);

create index idx_venue_alt_expensive on venue_alternatives(expensive_venue_id);
create index idx_venue_alt_cheaper on venue_alternatives(cheaper_venue_id);

-- ============================================================
-- merchant_aliases: bank statement names -> venue slugs
-- ============================================================
create table merchant_aliases (
    id              uuid primary key default gen_random_uuid(),
    alias_pattern   text not null,
    venue_slug      text not null references sf_venues(slug) on delete cascade,
    city            text not null default 'San Francisco'
);

create index idx_merchant_aliases_pattern on merchant_aliases(lower(alias_pattern));
create index idx_merchant_aliases_slug on merchant_aliases(venue_slug);

-- ============================================================
-- SEED: SF Venues
-- ============================================================

insert into sf_venues (slug, name, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description) values
('chipotle',            'Chipotle Mexican Grill', 'food', 'mexican',       null, 'Multiple SF locations',        2, '$12-16', '{fast_casual,chain,burritos}',              true,  'National burrito chain'),
('sweetgreen',          'Sweetgreen',             'food', 'salads',        null, 'Multiple SF locations',        3, '$14-18', '{fast_casual,chain,healthy,salads}',        true,  'Trendy salad chain'),
('cava',                'Cava',                   'food', 'mediterranean', null, 'Multiple SF locations',        2, '$13-17', '{fast_casual,chain,mediterranean,bowls}',   true,  'Mediterranean grain bowl chain'),
('la-taqueria',         'La Taqueria',            'food', 'mexican',       'Mission',  '2889 Mission St',        1, '$10-12', '{cash_only,local_icon,burritos}',           false, 'Legendary SF burrito, James Beard winner'),
('el-farolito',         'El Farolito',            'food', 'mexican',       'Mission',  '2779 Mission St',        1, '$10-12', '{late_night,burritos,local_icon}',          false, 'Giant super burritos, open late'),
('taqueria-cancun',     'Taqueria Cancun',        'food', 'mexican',       'Mission',  '2288 Mission St',        1, '$9-11',  '{burritos,fast_service}',                   false, 'Huge burritos under $11'),
('farolito-guerrero',   'Farolito on Guerrero',   'food', 'mexican',       'Mission',  '1206 Guerrero St',       1, '$10-12', '{late_night,burritos}',                     false, 'Same great El Farolito, less crowded'),
('taqueria-el-buen-sabor','Taqueria El Buen Sabor','food','mexican',       'Mission',  '699 Valencia St',        1, '$8-10',  '{burritos,authentic,no_frills}',            false, 'Under $10 burritos, authentic'),
('souvla',              'Souvla',                 'food', 'mediterranean', 'Hayes Valley','517 Hayes St',        2, '$13-16', '{greek,wraps,salads}',                     false, 'Greek-inspired salads and wraps'),
('senor-sisig',         'Senor Sisig',            'food', 'filipino',      null, 'Food trucks citywide',         1, '$10-12', '{food_truck,bowls,fusion}',                 false, 'Filipino fusion bowls, unique SF flavor'),
('rt-rotisserie',       'RT Rotisserie',          'food', 'bowls',         'Hayes Valley','101 Oak St',          2, '$11-13', '{bowls,rotisserie,healthy}',                false, 'Hearty grain bowls with rotisserie chicken'),
('mixt',                'Mixt',                   'food', 'salads',        'FiDi', '475 Sansome St',             2, '$13-16', '{salads,healthy,local_chain}',              false, 'Custom salads, SF-based chain'),
('truly-mediterranean', 'Truly Mediterranean',    'food', 'mediterranean', 'Mission',  '3109 16th St',           1, '$8-10',  '{falafel,byob,cash_friendly}',              false, 'Best falafel in the city under $10'),
('old-jerusalem',       'Old Jerusalem',          'food', 'mediterranean', 'Mission',  '2976 Mission St',        1, '$10-14', '{middle_eastern,family_run}',               false, 'Authentic Middle Eastern, huge portions'),
('sunrise-deli',        'Sunrise Deli',           'food', 'mediterranean', 'Sunset',   '2115 Irving St',         1, '$10-12', '{shawarma,neighborhood_gem}',               false, 'Massive shawarma plates'),
('tin-vietnamese',      'Tin Vietnamese',         'food', 'vietnamese',    'FiDi', 'Kearny St',                  3, '$16-22', '{sit_down,modern_vietnamese}',              false, 'Modern Vietnamese restaurant'),
('saigon-sandwich',     'Saigon Sandwich',        'food', 'vietnamese',    'Tenderloin','560 Larkin St',         1, '$5-6',   '{cash_only,local_icon,banh_mi}',            false, 'Best banh mi in SF, legendary'),
('turtle-tower',        'Turtle Tower',           'food', 'vietnamese',    'Tenderloin','645 Larkin St',         1, '$12-14', '{pho,authentic}',                           false, 'Authentic Northern Vietnamese pho'),
('pho-2000',            'Pho 2000',               'food', 'vietnamese',    'Tenderloin','637 Larkin St',         1, '$11-13', '{pho,quick_service}',                      false, 'Generous pho bowls'),
('hai-ky-mi-gia',       'Hai Ky Mi Gia',          'food', 'vietnamese',    'Tenderloin','707 Ellis St',          1, '$9-11',  '{noodles,no_frills,authentic}',             false, 'Dry egg noodles, authentic Vietnamese-Chinese'),
('bun-mee',             'Bun Mee',                'food', 'vietnamese',    'Tenderloin','674 Geary St',          1, '$9-11',  '{banh_mi,modern}',                         false, 'Modern banh mi, great combos'),
('blue-bottle',         'Blue Bottle Coffee',     'food', 'coffee',        null, 'Multiple SF locations',        3, '$6-8',   '{specialty_coffee,chain,pour_over}',        true,  'Premium specialty coffee, Oakland-born'),
('starbucks',           'Starbucks',              'food', 'coffee',        null, 'Multiple SF locations',        2, '$5-7',   '{chain,coffee,ubiquitous}',                 true,  'Global coffee chain'),
('philz-coffee',        'Philz Coffee',           'food', 'coffee',        null, 'Multiple SF locations',        2, '$5-6',   '{handcrafted,local_icon,drip}',             false, 'Handcrafted drip coffee, SF original'),
('equator-coffees',     'Equator Coffees',        'food', 'coffee',        'Mid-Market','986 Market St',         2, '$5-6',   '{b_corp,single_origin}',                   false, 'B-Corp certified, excellent origins'),
('sightglass',          'Sightglass Coffee',      'food', 'coffee',        'SoMa', '270 7th St',                2, '$5-6',   '{roastery,craft}',                         false, 'Beautiful SoMa roastery'),
('red-bay-coffee',      'Red Bay Coffee',         'food', 'coffee',        'FiDi', 'Salesforce Transit Center',  2, '$4-6',   '{community_focused,espresso}',              false, 'Oakland-roasted, community-focused'),
('peets-coffee',        'Peets Coffee',           'food', 'coffee',        null, 'Multiple SF locations',        2, '$5-6',   '{bay_area_original,bold_roasts}',           true,  'Bay Area original since 1966'),
('verve-coffee',        'Verve Coffee',           'food', 'coffee',        'Castro','2101 Market St',            2, '$5-7',   '{california_roasted,light_roasts}',         false, 'Exceptional light roasts'),
('home-brewing',        'Home Brewing',           'food', 'coffee',        null, 'Your kitchen',                 1, '$0.50-1', '{diy,home}',                              false, 'Local roaster beans = $0.75/cup'),
('salt-and-straw',      'Salt & Straw',           'food', 'ice_cream',     null, 'Multiple SF locations',        3, '$7-10',  '{premium,creative_flavors,chain}',          true,  'Portland-born premium ice cream'),
('mitchells-ice-cream', 'Mitchells Ice Cream',    'food', 'ice_cream',     'Noe Valley','688 San Jose Ave',      2, '$5-6',   '{local_icon,tropical_flavors,since_1953}',  false, 'SF icon since 1953, ube and lucuma'),
('bi-rite-creamery',    'Bi-Rite Creamery',       'food', 'ice_cream',     'Mission','3692 18th St',             2, '$5-7',   '{organic,salted_caramel,local_icon}',       false, 'Organic cream, legendary salted caramel'),
('garden-creamery',     'Garden Creamery',        'food', 'ice_cream',     'Mission','3566 20th St',             2, '$5-6',   '{asian_inspired,ube,pandan}',               false, 'Asian-inspired ube and pandan'),
('humphry-slocombe',    'Humphry Slocombe',       'food', 'ice_cream',     'Mission','2790 Harrison St',         2, '$6-7',   '{creative_flavors,secret_breakfast}',       false, 'Wild flavors, Secret Breakfast bourbon'),
('tj-ice-cream',        'Trader Joes Ice Cream',  'food', 'ice_cream',     null, 'Multiple SF locations',        1, '$3-4',   '{grocery,pints,value}',                    true,  'Great pints for $3-4'),
('whole-foods',         'Whole Foods',            'groceries','supermarket',null, 'Multiple SF locations',        4, '$$$',    '{organic,premium,chain}',                  true,  'Premium organic grocery'),
('trader-joes',         'Trader Joes',            'groceries','supermarket',null, 'Multiple SF locations',        2, '$$',     '{value,private_label,chain}',              true,  'Great private-label, good prices'),
('grocery-outlet',      'Grocery Outlet',         'groceries','supermarket',null, 'Multiple SF locations',        1, '$',      '{bargain,treasure_hunt,name_brand}',       true,  'Bargain items, 40-60% off retail'),
('costco-sf',           'Costco',                 'groceries','warehouse',  'SoMa','450 10th St',                1, '$',      '{bulk,membership,prepared_foods}',         true,  'In-city Costco, bulk + $5 rotisserie'),
('smart-and-final',     'Smart & Final',          'groceries','supermarket','Mission','1245 South Van Ness',     1, '$-$$',   '{bulk,no_membership}',                    true,  'Bulk pricing, no membership'),
('duc-loi',             'Duc Loi Supermarket',    'groceries','supermarket','Mission','2200 Mission St',         1, '$',      '{asian_produce,latin_produce,fresh}',      false, 'Amazing produce prices'),
('doordash',            'DoorDash',               'delivery','food_delivery',null,'App',                         4, '30-40% markup','{delivery_app,fees,markup}',          true,  'Food delivery, 30-40% total markup'),
('uber-eats',           'Uber Eats',              'delivery','food_delivery',null,'App',                         4, '25-35% markup','{delivery_app,fees,markup}',          true,  'Food delivery, 25-35% markup'),
('instacart',           'Instacart',              'delivery','grocery_delivery',null,'App',                      3, '20-30% markup','{grocery_delivery,fees,markup}',      true,  'Grocery delivery with markups'),
('dashmart',            'DashMart',               'delivery','convenience', null,'App',                          4, '40-60% markup','{convenience,delivery,markup}',       true,  'DoorDash convenience, 40-60% markup'),
('direct-pickup',       'Direct Restaurant Pickup','delivery','pickup',     null,'Wherever you order from',      1, '$0',     '{no_fees,no_markup}',                     false, 'Walk in or call ahead, skip all fees'),
('restaurant-delivery', 'Restaurant Own Delivery', 'delivery','delivery',   null,'Call restaurants directly',     1, '$0-3',   '{direct,no_app_markup}',                  false, 'Many SF spots deliver direct'),
('meal-prep',           'Meal Prepping',           'delivery','diy',        null,'Your kitchen',                 1, '$3-5/meal','{diy,batch_cooking}',                    false, 'Batch cook Sunday, eat all week'),
('costco-prepared',     'Costco Prepared Foods',   'delivery','ready_to_eat','SoMa','450 10th St',              1, '$5-10',  '{ready_to_eat,rotisserie}',               true,  '$5 chicken, $10 pizza'),
('walmart-plus',        'Walmart+ Delivery',       'delivery','grocery_delivery',null,'Delivery',                1, 'In-store prices','{delivery,no_markup}',             true,  'In-store prices delivered'),
('amazon-fresh',        'Amazon Fresh',            'delivery','grocery_delivery',null,'Delivery',                2, 'Online prices','{delivery,prime}',                   true,  'Free delivery over $35 with Prime'),
('walgreens',           'Walgreens',              'retail','convenience',   null,'Multiple SF locations',        2, '$$',     '{convenience,late_night}',                true,  'Open late, no delivery markup'),
('target-sf',           'Target',                 'retail','general',       'SoMa','789 Mission St',             2, '$$',     '{general,snacks,household}',              true,  'Better prices, BART accessible'),
('dollar-tree',         'Dollar Tree',            'retail','discount',      null,'Multiple SF locations',        1, '$1.25',  '{discount,basics}',                       true,  'Basics at $1.25'),
('boba-guys',           'Boba Guys',              'food', 'boba',          null,'Multiple SF locations',        3, '$7-9',   '{premium_boba,local}',                    false, 'Premium boba, SF-born'),
('plentea',             'Plentea',                'food', 'boba',          'Fishermans Wharf','2237 Mason St',   2, '$5-7',   '{loose_leaf,quality}',                    false, 'Premium loose-leaf boba'),
('feng-cha',            'Feng Cha',               'food', 'boba',          'Sunset','1946 Taraval St',          2, '$5-7',   '{cheese_foam,classic_boba}',               false, 'Cheese foam and classic boba'),
('sharetea',            'ShareTea',               'food', 'boba',          'Chinatown','240 Jackson St',         1, '$5-6',   '{taiwanese,reliable}',                    true,  'Reliable Taiwanese boba'),
('homemade-boba',       'Homemade Boba',          'food', 'boba',          null,'Your kitchen',                 1, '$0.50',  '{diy,home}',                              false, 'Tapioca pearls $3/bag = 20+ drinks'),
('dominos',             'Dominos',                'food', 'pizza',         null,'Multiple SF locations',        2, '$12-18', '{chain,delivery,pizza}',                   true,  'Pizza delivery chain'),
('costco-pizza',        'Costco Food Court Pizza','food', 'pizza',         'SoMa','450 10th St',                1, '$10',    '{no_membership_needed,huge}',              true,  '18" pizza $9.95'),
('arinell-pizza',       'Arinell Pizza',          'food', 'pizza',         'Mission','509 Valencia St',          1, '$3.50-4','{ny_style,slices}',                       false, 'NY-style slices, no-frills'),
('golden-boy-pizza',    'Golden Boy Pizza',       'food', 'pizza',         'North Beach','542 Green St',         2, '$4-5',   '{focaccia,squares,local_icon}',            false, 'Focaccia squares, North Beach icon'),
('tj-frozen-pizza',     'Trader Joes Frozen Pizza','food','pizza',         null,'Multiple SF locations',        1, '$4-6',   '{grocery,frozen,value}',                   true,  'Great frozen pizzas'),
('shake-shack',         'Shake Shack',            'food', 'burgers',       null,'Multiple SF locations',        3, '$12-16', '{chain,burgers,fast_casual}',              true,  'NYC-born burger chain'),
('in-n-out',            'In-N-Out Burger',        'food', 'burgers',       'Fishermans Wharf','333 Jefferson St',1, '$5-8',  '{california_icon,animal_style,value}',     true,  'Double-Double $5.25, the GOAT'),
('super-duper',         'Super Duper Burgers',    'food', 'burgers',       null,'Multiple SF locations',        2, '$9-11',  '{organic_beef,local_chain}',               false, 'Local SF chain, organic beef'),
('causwells',           'Causwells',              'food', 'burgers',       'Marina','2346 Chestnut St',         3, '$14-16', '{craft,gastropub}',                       false, 'One of SF best craft burgers'),
('roam-burgers',        'Roam Artisan Burgers',   'food', 'burgers',       'Cow Hollow','1785 Union St',        2, '$12-14', '{grass_fed,sustainable}',                  false, 'Grass-fed sustainable burgers'),
('china-live',          'China Live',             'food', 'chinese',       'Chinatown','644 Broadway',          4, '$20-40', '{upscale,chinese,market_hall}',            false, 'Upscale Chinese market hall'),
('good-mong-kok',       'Good Mong Kok Bakery',  'food', 'chinese',       'Chinatown','1039 Stockton St',      1, '$3-5',   '{dim_sum_to_go,bakery,legendary}',         false, 'Dim sum to-go, BBQ pork buns $4/3'),
('z-and-y',             'Z & Y Restaurant',       'food', 'chinese',       'Chinatown','655 Jackson St',        2, '$12-18', '{sichuan,spicy}',                         false, 'Sichuan masterclass, Obama ate here'),
('san-tung',            'San Tung',               'food', 'chinese',       'Sunset','1031 Irving St',           2, '$12-15', '{dry_fried_wings,famous}',                 false, 'SF-famous dry-fried wings'),
('yin-du-wonton',       'Yin Du Wonton Noodle',   'food', 'chinese',       'Chinatown','731 Vallejo St',        1, '$8-10',  '{hand_pulled_noodles}',                   false, 'Hand-pulled noodles under $10'),
('maruwu-seicha',       'Maruwu Seicha',          'food', 'japanese',      null,'San Francisco, CA',            2, '$6-10',  '{matcha,japanese_tea}',                    false, 'Japanese tea and matcha'),
('stonemill-matcha',    'Stonemill Matcha',       'food', 'japanese',      'Mission','561 Valencia St',          2, '$6-8',   '{matcha,ceremonial_grade}',               false, 'Ceremonial-grade matcha, great pastries'),
('homemade-matcha',     'Homemade Matcha',        'food', 'japanese',      null,'Your kitchen',                 1, '$1-2',   '{diy,home}',                              false, 'Ippodo matcha $25 tin = 20+ servings'),
('sf-cocktail-bars',    'SF Cocktail Bars',       'bars', 'cocktails',     null,'Various',                      4, '$16-20', '{cocktails,craft}',                       false, 'Average SF craft cocktail bar'),
('li-po-lounge',        'Li Po Cocktail Lounge',  'bars', 'dive',          'Chinatown','916 Grant Ave',         1, '$8-10',  '{cash_only,bourdain_approved}',            false, 'Chinese mai tais, Bourdain-approved'),
('the-500-club',        'The 500 Club',           'bars', 'dive',          'Mission','500 Guerrero St',         1, '$6-8',   '{dive,stiff_drinks,classic}',              false, 'Stiff drinks, classic SF dive'),
('toronado',            'Toronado',               'bars', 'beer',          'Lower Haight','547 Haight St',      2, '$6-9',   '{craft_beer,world_class}',                false, 'World-class craft beer selection'),
('tj-wine-beer',        'Trader Joes Wine/Beer',  'bars', 'retail',        null,'Multiple SF locations',        1, '$3-9',   '{grocery,pregame}',                       true,  'Charles Shaw $3.49, craft six-packs $7-9'),
('equinox',             'Equinox',                'fitness','gym',          null,'Multiple SF locations',        4, '$200-300/mo','{premium,luxury}',                    true,  'Luxury gym chain'),
('soulcycle',           'SoulCycle',              'fitness','boutique',     null,'Multiple SF locations',        4, '$30-40/class','{cycling,boutique}',                  true,  'Boutique cycling classes'),
('sf-rec-gyms',         'SF City Rec Gyms',       'fitness','gym',          null,'Multiple rec centers',         1, '$25-50/mo','{city_run,pools,classes}',               false, 'City-run gyms with pools'),
('planet-fitness',      'Planet Fitness',         'fitness','gym',          null,'Multiple SF locations',        1, '$10-25/mo','{basic,24_7}',                          true,  '$10-25/month, open 24/7'),
('24-hour-fitness',     '24 Hour Fitness',        'fitness','gym',          null,'Multiple SF locations',        2, '$30-50/mo','{good_equipment}',                      true,  'Good equipment, multiple locations'),
('outdoor-fitness',     'Outdoor Fitness (free)', 'fitness','outdoor',      null,'Golden Gate Park, Embarcadero',1,'$0',      '{free,running,hiking}',                   false, 'Lyon St stairs, Dolores Park bootcamps'),
('peloton-home',        'Peloton (at home)',      'fitness','home',         null,'Your home',                    2, '$44/mo', '{home,cycling,unlimited}',                false, '$44/mo unlimited vs $30-40/class'),
('bay-wheels',          'Bay Wheels Bikes',       'fitness','cycling',      null,'Docks citywide',              1, '$20/mo', '{e_bike,commute}',                        false, '$20/mo e-bikes, faster than Uber'),
('uber',                'Uber',                   'transportation','rideshare',null,'App',                      3, '$15-30', '{rideshare,app}',                         true,  'Rideshare app'),
('lyft',                'Lyft',                   'transportation','rideshare',null,'App',                      3, '$15-28', '{rideshare,app}',                         true,  'Rideshare app'),
('muni',                'Muni (SFMTA)',           'transportation','transit',null,'Citywide',                   1, '$2.50',  '{bus,metro,streetcar}',                    false, '$2.50/ride or $81/month unlimited'),
('bart',                'BART',                   'transportation','transit',null,'Multiple stations',           1, '$2-7',   '{rail,fast,airport}',                     false, 'Fast rail, great for airport'),
('lime-scooters',       'Lime/Scoot Scooters',    'transportation','scooter',null,'Citywide',                   1, '$5-8',   '{scooter,fun}',                           false, '$5-8 per trip'),
('netflix',             'Netflix',                'subscriptions','streaming',null,'App',                        2, '$7-23/mo','{streaming}',                            true,  'Streaming subscription'),
('sfpl-kanopy',         'SF Library (Kanopy)',    'subscriptions','streaming',null,'sfpl.org',                   1, '$0',     '{free,library}',                          false, 'Free with SF library card'),
('tubi-pluto',          'Tubi / Pluto TV',        'subscriptions','streaming',null,'App/Web',                    1, '$0',     '{free,ad_supported}',                     false, 'Free ad-supported streaming'),
-- === GAS STATIONS ===
('chevron-sf',          'Chevron',                'gas', 'gas_station',    null, 'Multiple SF locations',       3, '$5.50-6.00/gal', '{chain,premium,credit_card_markup}',    true,  'Premium-priced, widespread in SF'),
('shell-sf',            'Shell',                  'gas', 'gas_station',    null, 'Multiple SF locations',       3, '$5.40-5.90/gal', '{chain,premium,v_power}',               true,  'Premium brand, often $0.20+ above avg'),
('76-sf',               '76 Gas',                 'gas', 'gas_station',    null, 'Multiple SF locations',       3, '$5.40-5.80/gal', '{chain,premium}',                       true,  'ConocoPhillips brand, premium pricing'),
('arco-sf',             'ARCO',                   'gas', 'gas_station',    null, 'Multiple SF locations',       1, '$4.80-5.20/gal', '{budget,debit_only,no_credit}',         true,  'Cheapest in SF, debit/cash only saves $0.35-0.50/gal'),
('costco-gas',          'Costco Gas',             'gas', 'gas_station',    'SoMa', '450 10th St',              1, '$4.70-5.10/gal', '{membership,cheapest,bulk}',             true,  'Cheapest gas in SF, requires membership, long lines worth it'),
('safeway-gas',         'Safeway Gas Rewards',    'gas', 'gas_station',    null, 'Multiple Safeway locations',  2, '$5.00-5.40/gal', '{rewards,grocery_discount}',             true,  'Grocery reward points = $0.10-1.00/gal off'),
('valero-sf',           'Valero',                 'gas', 'gas_station',    null, 'Multiple SF locations',       2, '$5.00-5.40/gal', '{budget_friendly,reliable}',             true,  'Consistently $0.15-0.30 below Chevron/Shell'),
('gasbuddy-app',        'GasBuddy (app)',         'gas', 'gas_app',        null, 'App',                         1, '$0.05-0.25/gal off', '{app,price_comparison,cashback}',    false, 'Find cheapest gas nearby + Pay with GasBuddy card saves $0.25/gal');


-- ============================================================
-- SEED: Venue Alternatives
-- ============================================================

-- Chipotle -> cheaper Mexican
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='chipotle'), (select id from sf_venues where slug='la-taqueria'),         '30-40% cheaper', 'Legendary SF burrito, bigger portions, James Beard winner', 1),
((select id from sf_venues where slug='chipotle'), (select id from sf_venues where slug='el-farolito'),         '30-40% cheaper', 'Giant super burritos under $12, open late', 2),
((select id from sf_venues where slug='chipotle'), (select id from sf_venues where slug='taqueria-cancun'),     '25-35% cheaper', 'Huge burritos under $11, fast service', 3),
((select id from sf_venues where slug='chipotle'), (select id from sf_venues where slug='farolito-guerrero'),   '30-40% cheaper', 'Same El Farolito quality, less crowded', 4),
((select id from sf_venues where slug='chipotle'), (select id from sf_venues where slug='taqueria-el-buen-sabor'),'35-45% cheaper','Under $10 burritos, authentic flavors', 5);

-- Sweetgreen -> cheaper healthy
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='sweetgreen'), (select id from sf_venues where slug='senor-sisig'),       '20-30% cheaper', 'Filling bowls under $12, unique SF flavor', 1),
((select id from sf_venues where slug='sweetgreen'), (select id from sf_venues where slug='rt-rotisserie'),     '15-25% cheaper', 'Grain bowls with rotisserie chicken, $11-13', 2),
((select id from sf_venues where slug='sweetgreen'), (select id from sf_venues where slug='souvla'),            '10-20% cheaper', 'Greek salads and wraps, similar quality', 3),
((select id from sf_venues where slug='sweetgreen'), (select id from sf_venues where slug='mixt'),              '5-10% cheaper',  'Custom salads, local SF chain', 4);

-- Cava -> cheaper mediterranean
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='cava'), (select id from sf_venues where slug='truly-mediterranean'),     '30-40% cheaper', 'Best falafel in the city under $10, BYOB', 1),
((select id from sf_venues where slug='cava'), (select id from sf_venues where slug='old-jerusalem'),          '20-30% cheaper', 'Authentic Middle Eastern, huge portions', 2),
((select id from sf_venues where slug='cava'), (select id from sf_venues where slug='sunrise-deli'),           '25-35% cheaper', 'Massive shawarma plates under $12', 3),
((select id from sf_venues where slug='cava'), (select id from sf_venues where slug='souvla'),                 '5-15% cheaper',  'Greek wraps, better quality, similar price', 4);

-- Tin Vietnamese -> cheaper Vietnamese
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='tin-vietnamese'), (select id from sf_venues where slug='saigon-sandwich'),'70-80% cheaper','Best banh mi in SF for $5-6, legendary', 1),
((select id from sf_venues where slug='tin-vietnamese'), (select id from sf_venues where slug='hai-ky-mi-gia'), '40-50% cheaper', 'Dry egg noodles under $11, authentic', 2),
((select id from sf_venues where slug='tin-vietnamese'), (select id from sf_venues where slug='pho-2000'),      '35-45% cheaper', 'Generous pho bowls under $13', 3),
((select id from sf_venues where slug='tin-vietnamese'), (select id from sf_venues where slug='turtle-tower'),  '30-40% cheaper', 'Authentic Northern Vietnamese pho', 4),
((select id from sf_venues where slug='tin-vietnamese'), (select id from sf_venues where slug='bun-mee'),       '25-35% cheaper', 'Modern banh mi $9-11', 5);

-- Blue Bottle -> cheaper coffee
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='blue-bottle'), (select id from sf_venues where slug='philz-coffee'),    '10-20% cheaper', 'Handcrafted drip $5-6, equally iconic SF brand', 1),
((select id from sf_venues where slug='blue-bottle'), (select id from sf_venues where slug='red-bay-coffee'),  '15-20% cheaper', 'Oakland-roasted, community-focused', 2),
((select id from sf_venues where slug='blue-bottle'), (select id from sf_venues where slug='equator-coffees'), '10-15% cheaper', 'B-Corp certified, excellent origins', 3),
((select id from sf_venues where slug='blue-bottle'), (select id from sf_venues where slug='sightglass'),      '5-10% cheaper',  'Beautiful roastery, similar quality', 4),
((select id from sf_venues where slug='blue-bottle'), (select id from sf_venues where slug='home-brewing'),    '80-90% cheaper', 'Local roaster beans = $0.75/cup', 5);

-- Starbucks -> better coffee
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='starbucks'), (select id from sf_venues where slug='philz-coffee'),      'Same price, better', 'Handcrafted, no burnt taste, SF original', 1),
((select id from sf_venues where slug='starbucks'), (select id from sf_venues where slug='peets-coffee'),      '5-10% cheaper', 'Bay Area original, bolder roasts', 2),
((select id from sf_venues where slug='starbucks'), (select id from sf_venues where slug='verve-coffee'),      'Same price',    'Exceptional light roasts, better quality', 3),
((select id from sf_venues where slug='starbucks'), (select id from sf_venues where slug='home-brewing'),      '85-90% cheaper','Drip setup + beans = $0.50/cup', 4);

-- Salt & Straw -> cheaper ice cream
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='salt-and-straw'), (select id from sf_venues where slug='mitchells-ice-cream'),'25-35% cheaper','SF icon since 1953, ube and lucuma', 1),
((select id from sf_venues where slug='salt-and-straw'), (select id from sf_venues where slug='bi-rite-creamery'),   '15-25% cheaper','Organic cream, legendary salted caramel', 2),
((select id from sf_venues where slug='salt-and-straw'), (select id from sf_venues where slug='garden-creamery'),    '20-30% cheaper','Asian-inspired ube and pandan, $5-6', 3),
((select id from sf_venues where slug='salt-and-straw'), (select id from sf_venues where slug='humphry-slocombe'),   '10-15% cheaper','Wild flavors, Secret Breakfast bourbon', 4),
((select id from sf_venues where slug='salt-and-straw'), (select id from sf_venues where slug='tj-ice-cream'),       '70-80% cheaper','Great pints $3-4, ube and matcha', 5);

-- Whole Foods -> cheaper groceries
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='whole-foods'), (select id from sf_venues where slug='trader-joes'),     '25-35% cheaper', 'Great private-label, organic options', 1),
((select id from sf_venues where slug='whole-foods'), (select id from sf_venues where slug='grocery-outlet'),  '40-60% cheaper', 'Bargain organic + name-brand items', 2),
((select id from sf_venues where slug='whole-foods'), (select id from sf_venues where slug='costco-sf'),       '30-50% cheaper', 'In-city Costco, bulk staples', 3),
((select id from sf_venues where slug='whole-foods'), (select id from sf_venues where slug='duc-loi'),         '30-40% cheaper', 'Amazing produce prices', 4),
((select id from sf_venues where slug='whole-foods'), (select id from sf_venues where slug='smart-and-final'), '20-30% cheaper', 'Bulk pricing, no membership', 5);

-- Trader Joe's -> even cheaper
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='trader-joes'), (select id from sf_venues where slug='grocery-outlet'),  '25-40% cheaper', 'Even cheaper for name brands', 1),
((select id from sf_venues where slug='trader-joes'), (select id from sf_venues where slug='costco-sf'),       '20-35% cheaper', 'Better unit pricing on staples', 2),
((select id from sf_venues where slug='trader-joes'), (select id from sf_venues where slug='duc-loi'),         '20-30% cheaper', 'Much cheaper produce', 3);

-- DoorDash -> skip fees
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='doordash'), (select id from sf_venues where slug='direct-pickup'),      '30-40% cheaper', 'No delivery fee, no service fee, no markup', 1),
((select id from sf_venues where slug='doordash'), (select id from sf_venues where slug='restaurant-delivery'),'15-25% cheaper', 'Many SF restaurants deliver direct', 2),
((select id from sf_venues where slug='doordash'), (select id from sf_venues where slug='meal-prep'),          '60-70% cheaper', 'Batch cook Sunday, eat all week', 3),
((select id from sf_venues where slug='doordash'), (select id from sf_venues where slug='costco-prepared'),    '50-60% cheaper', '$5 rotisserie, $10 pizza', 4);

-- Uber Eats -> skip fees
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='uber-eats'), (select id from sf_venues where slug='direct-pickup'),     '25-35% cheaper', 'Skip all fees and menu markups', 1),
((select id from sf_venues where slug='uber-eats'), (select id from sf_venues where slug='restaurant-delivery'),'15-20% cheaper','Chinese and pizza places deliver direct', 2),
((select id from sf_venues where slug='uber-eats'), (select id from sf_venues where slug='meal-prep'),         '65-75% cheaper', 'Same meal at home costs $5-8', 3),
((select id from sf_venues where slug='uber-eats'), (select id from sf_venues where slug='costco-prepared'),   '50-60% cheaper', 'Hot food bar at wholesale prices', 4);

-- Instacart -> skip markup
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='instacart'), (select id from sf_venues where slug='trader-joes'),       '25-35% cheaper', 'No fees, no item markups', 1),
((select id from sf_venues where slug='instacart'), (select id from sf_venues where slug='costco-sf'),         '30-45% cheaper', 'Skip 15-20% Instacart Costco markup', 2),
((select id from sf_venues where slug='instacart'), (select id from sf_venues where slug='grocery-outlet'),    '40-55% cheaper', 'Already 40-60% off, no app fee', 3),
((select id from sf_venues where slug='instacart'), (select id from sf_venues where slug='walmart-plus'),      '15-25% cheaper', 'In-store prices delivered', 4),
((select id from sf_venues where slug='instacart'), (select id from sf_venues where slug='amazon-fresh'),      '10-15% cheaper', 'Free delivery over $35 with Prime', 5);

-- DashMart -> skip convenience markup
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='dashmart'), (select id from sf_venues where slug='walgreens'),          '20-30% cheaper', 'Same items, no delivery markup', 1),
((select id from sf_venues where slug='dashmart'), (select id from sf_venues where slug='target-sf'),          '30-40% cheaper', 'Better prices, BART accessible', 2),
((select id from sf_venues where slug='dashmart'), (select id from sf_venues where slug='grocery-outlet'),     '50-65% cheaper', 'Name-brand at fraction of price', 3),
((select id from sf_venues where slug='dashmart'), (select id from sf_venues where slug='dollar-tree'),        '60-70% cheaper', 'Basics at $1.25 vs $4-8', 4);

-- Boba Guys -> cheaper boba
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='boba-guys'), (select id from sf_venues where slug='plentea'),           '15-25% cheaper', 'Premium loose-leaf, quality-focused', 1),
((select id from sf_venues where slug='boba-guys'), (select id from sf_venues where slug='feng-cha'),          '10-20% cheaper', 'Cheese foam and classic boba', 2),
((select id from sf_venues where slug='boba-guys'), (select id from sf_venues where slug='sharetea'),          '15-25% cheaper', 'Reliable Taiwanese chain, $5-6', 3),
((select id from sf_venues where slug='boba-guys'), (select id from sf_venues where slug='homemade-boba'),     '80-90% cheaper', '$3 bag = 20+ drinks', 4);

-- Domino's -> better pizza
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='dominos'), (select id from sf_venues where slug='costco-pizza'),        '40-50% cheaper', '18" pizza $9.95, no membership for food court', 1),
((select id from sf_venues where slug='dominos'), (select id from sf_venues where slug='arinell-pizza'),       '20-30% cheaper', 'NY-style slices $3.50-4', 2),
((select id from sf_venues where slug='dominos'), (select id from sf_venues where slug='golden-boy-pizza'),    'Same price, way better', 'Focaccia squares, North Beach icon', 3),
((select id from sf_venues where slug='dominos'), (select id from sf_venues where slug='tj-frozen-pizza'),     '60-70% cheaper', 'Great frozen pizzas $4-6', 4);

-- Shake Shack -> cheaper burgers
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='shake-shack'), (select id from sf_venues where slug='in-n-out'),        '40-50% cheaper', 'Double-Double $5.25, the California GOAT', 1),
((select id from sf_venues where slug='shake-shack'), (select id from sf_venues where slug='super-duper'),     '15-25% cheaper', 'Local SF chain, organic beef, $9-11', 2),
((select id from sf_venues where slug='shake-shack'), (select id from sf_venues where slug='causwells'),       'Same price, better', 'One of SF best craft burgers', 3),
((select id from sf_venues where slug='shake-shack'), (select id from sf_venues where slug='roam-burgers'),    'Same price',    'Grass-fed, sustainable sourcing', 4);

-- China Live -> cheaper Chinese
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='good-mong-kok'),    '70-80% cheaper', 'Dim sum to-go, BBQ pork buns $4/3', 1),
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='yin-du-wonton'),    '50-60% cheaper', 'Hand-pulled noodles under $10', 2),
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='z-and-y'),          '30-40% cheaper', 'Sichuan masterclass, Obama ate here', 3),
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='san-tung'),         '35-45% cheaper', 'SF-famous dry-fried wings', 4);

-- Maruwu Seicha -> cheaper matcha
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='maruwu-seicha'), (select id from sf_venues where slug='stonemill-matcha'),'Same price', 'Ceremonial-grade matcha, great pastries', 1),
((select id from sf_venues where slug='maruwu-seicha'), (select id from sf_venues where slug='homemade-matcha'), '75-85% cheaper','Ippodo tin = $1.25/cup vs $6-8', 2);

-- Cocktail bars -> cheaper drinks
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='sf-cocktail-bars'), (select id from sf_venues where slug='li-po-lounge'),'40-50% cheaper','Chinese mai tais $8-10, Bourdain-approved', 1),
((select id from sf_venues where slug='sf-cocktail-bars'), (select id from sf_venues where slug='the-500-club'),'50-60% cheaper','Stiff drinks $6-8, classic SF dive', 2),
((select id from sf_venues where slug='sf-cocktail-bars'), (select id from sf_venues where slug='toronado'),    '30-40% cheaper','World-class craft beer, pints $6-9', 3),
((select id from sf_venues where slug='sf-cocktail-bars'), (select id from sf_venues where slug='tj-wine-beer'),'70-80% cheaper','Charles Shaw $3.49, pregame at home', 4);

-- Equinox -> cheaper fitness
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='equinox'), (select id from sf_venues where slug='sf-rec-gyms'),         '85-90% cheaper', 'City gyms $25-50/mo with pools', 1),
((select id from sf_venues where slug='equinox'), (select id from sf_venues where slug='planet-fitness'),      '90-95% cheaper', '$10-25/month, open 24/7', 2),
((select id from sf_venues where slug='equinox'), (select id from sf_venues where slug='24-hour-fitness'),     '70-80% cheaper', '$30-50/month, good equipment', 3),
((select id from sf_venues where slug='equinox'), (select id from sf_venues where slug='outdoor-fitness'),     '100% cheaper',  'Lyon St stairs, free bootcamps', 4);

-- SoulCycle -> cheaper cycling
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='soulcycle'), (select id from sf_venues where slug='peloton-home'),      '60-70% cheaper', '$44/mo unlimited vs $30-40/class', 1),
((select id from sf_venues where slug='soulcycle'), (select id from sf_venues where slug='bay-wheels'),        '95% cheaper',   '$20/mo real cycling in SF', 2),
((select id from sf_venues where slug='soulcycle'), (select id from sf_venues where slug='outdoor-fitness'),   '100% cheaper',  'Free outdoor workouts', 3);

-- Uber -> cheaper transport
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='uber'), (select id from sf_venues where slug='muni'),                   '85-95% cheaper', '$2.50/ride or $81/mo unlimited', 1),
((select id from sf_venues where slug='uber'), (select id from sf_venues where slug='bart'),                   '70-85% cheaper', '$2-7, fast for major corridors', 2),
((select id from sf_venues where slug='uber'), (select id from sf_venues where slug='bay-wheels'),             '80-90% cheaper', '$20/mo, often faster in traffic', 3),
((select id from sf_venues where slug='uber'), (select id from sf_venues where slug='lime-scooters'),          '60-70% cheaper', '$5-8 per trip', 4);

-- Lyft -> cheaper transport
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='lyft'), (select id from sf_venues where slug='muni'),                   '85-95% cheaper', '$2.50/ride, Muni Metro is underrated', 1),
((select id from sf_venues where slug='lyft'), (select id from sf_venues where slug='bart'),                   '70-85% cheaper', 'Fast rail, cheaper airport runs', 2),
((select id from sf_venues where slug='lyft'), (select id from sf_venues where slug='bay-wheels'),             '80-90% cheaper', 'Lyft owns Bay Wheels, $20/mo', 3),
((select id from sf_venues where slug='lyft'), (select id from sf_venues where slug='lime-scooters'),          '60-70% cheaper', '$5-8, fun for flat areas', 4);

-- Netflix -> free
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='netflix'), (select id from sf_venues where slug='sfpl-kanopy'),         '100% cheaper', 'Free Kanopy with SF library card', 1),
((select id from sf_venues where slug='netflix'), (select id from sf_venues where slug='tubi-pluto'),          '100% cheaper', 'Free ad-supported, good selection', 2);

-- Chevron -> cheaper gas
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='chevron-sf'), (select id from sf_venues where slug='costco-gas'),       '$0.60-0.90/gal cheaper', 'Cheapest gas in SF, Costco membership pays for itself', 1),
((select id from sf_venues where slug='chevron-sf'), (select id from sf_venues where slug='arco-sf'),          '$0.40-0.70/gal cheaper', 'Debit/cash only but huge savings', 2),
((select id from sf_venues where slug='chevron-sf'), (select id from sf_venues where slug='valero-sf'),        '$0.15-0.30/gal cheaper', 'Reliably below Chevron, accepts credit cards', 3),
((select id from sf_venues where slug='chevron-sf'), (select id from sf_venues where slug='safeway-gas'),      '$0.10-1.00/gal cheaper', 'Stack grocery reward points for big discounts', 4),
((select id from sf_venues where slug='chevron-sf'), (select id from sf_venues where slug='gasbuddy-app'),     '$0.05-0.25/gal cheaper', 'Find cheapest station + GasBuddy Pay card saves extra', 5);

-- Shell -> cheaper gas
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='shell-sf'), (select id from sf_venues where slug='costco-gas'),         '$0.50-0.80/gal cheaper', 'Worth the line, cheapest gas in the city', 1),
((select id from sf_venues where slug='shell-sf'), (select id from sf_venues where slug='arco-sf'),            '$0.35-0.60/gal cheaper', 'Debit/cash only, consistent savings', 2),
((select id from sf_venues where slug='shell-sf'), (select id from sf_venues where slug='valero-sf'),          '$0.15-0.30/gal cheaper', 'No-fuss savings, credit cards accepted', 3),
((select id from sf_venues where slug='shell-sf'), (select id from sf_venues where slug='safeway-gas'),        '$0.10-1.00/gal cheaper', 'Grocery rewards stack up fast', 4);

-- 76 -> cheaper gas
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='76-sf'), (select id from sf_venues where slug='costco-gas'),            '$0.50-0.70/gal cheaper', 'Costco gas is the move', 1),
((select id from sf_venues where slug='76-sf'), (select id from sf_venues where slug='arco-sf'),               '$0.30-0.50/gal cheaper', 'Bring your debit card, skip credit', 2),
((select id from sf_venues where slug='76-sf'), (select id from sf_venues where slug='valero-sf'),             '$0.15-0.25/gal cheaper', 'Solid budget option', 3);


-- ============================================================
-- SEED: Merchant Aliases
-- ============================================================
insert into merchant_aliases (alias_pattern, venue_slug) values
('chipotle', 'chipotle'), ('chipotle mexican', 'chipotle'), ('chipotle mexican grill', 'chipotle'),
('salt & straw', 'salt-and-straw'), ('salt and straw', 'salt-and-straw'), ('sq *salt', 'salt-and-straw'),
('doordash', 'doordash'), ('dd *doordash', 'doordash'), ('doordash*', 'doordash'), ('dashpass', 'doordash'),
('uber eats', 'uber-eats'), ('uber *eats', 'uber-eats'), ('ubereats', 'uber-eats'),
('uber', 'uber'), ('uber *trip', 'uber'), ('uber *ride', 'uber'),
('lyft', 'lyft'), ('lyft *ride', 'lyft'),
('instacart', 'instacart'), ('maplebear inc', 'instacart'),
('starbucks', 'starbucks'), ('starbucks store', 'starbucks'),
('blue bottle', 'blue-bottle'), ('blue bottle coffee', 'blue-bottle'),
('whole foods', 'whole-foods'), ('whole fds', 'whole-foods'), ('wholefds', 'whole-foods'),
('trader joe', 'trader-joes'), ('trader joes', 'trader-joes'),
('shake shack', 'shake-shack'),
('dominos', 'dominos'),
('sweetgreen', 'sweetgreen'), ('sweet green', 'sweetgreen'),
('netflix', 'netflix'), ('netflix.com', 'netflix'),
('soulcycle', 'soulcycle'), ('soul cycle', 'soulcycle'),
('equinox', 'equinox'),
('boba guys', 'boba-guys'),
('cava', 'cava'), ('cava grill', 'cava'),
('tin vietnamese', 'tin-vietnamese'), ('tin on kearny', 'tin-vietnamese'),
('dashmart', 'dashmart'), ('dd *dashmart', 'dashmart'),
('china live', 'china-live'),
('maruwu seicha', 'maruwu-seicha'), ('maruwu', 'maruwu-seicha'),
('chevron', 'chevron-sf'), ('chevron gas', 'chevron-sf'),
('shell', 'shell-sf'), ('shell oil', 'shell-sf'), ('shell gas', 'shell-sf'),
('76', '76-sf'), ('76 gas', '76-sf'), ('conoco', '76-sf'),
('arco', 'arco-sf'), ('arco gas', 'arco-sf'), ('ampm', 'arco-sf'),
('costco gas', 'costco-gas'), ('costco fuel', 'costco-gas'),
('safeway fuel', 'safeway-gas'), ('safeway gas', 'safeway-gas'),
('valero', 'valero-sf'), ('valero gas', 'valero-sf');
