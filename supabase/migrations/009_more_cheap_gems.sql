-- WealthLens: More cheap SF hidden gems
-- Focuses on authentic, no-frills, locals-only spots

-- ============================================================
-- More $ tier food spots
-- ============================================================

insert into sf_venues (slug, name, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description, lat, lng) values
-- Dim Sum & Bakeries
('aa-bakery',            'AA Bakery & Cafe',       'food', 'chinese',    'Chinatown',   '1068 Stockton St',  1, '$2-5',   '{bakery,egg_tarts,bbq_pork_buns}',       false, 'Egg tarts $1.50, pork buns $2, no frills', 37.7953, -122.4094),
('eastern-bakery',       'Eastern Bakery',         'food', 'chinese',    'Chinatown',   '720 Grant Ave',     1, '$2-4',   '{bakery,mooncakes,since_1924}',           false, 'SF oldest bakery (1924), mooncakes & cocktail buns', 37.7938, -122.4064),
('delicious-dim-sum',    'Delicious Dim Sum',      'food', 'chinese',    'Chinatown',   '752 Jackson St',    1, '$3-6',   '{dim_sum,to_go,cash_only}',               false, 'Pork buns & shrimp dumplings $3-6, always a line', 37.7963, -122.4074),
('dim-sum-corner',       'New Lun Ting Cafe',      'food', 'chinese',    'Chinatown',   '670 Jackson St',    1, '$8-11',  '{congee,noodles,old_school}',              false, 'Old-school congee and noodles under $11', 37.7960, -122.4068),
('house-of-pancakes',    'House of Pancakes',      'food', 'chinese',    'Chinatown',   '635 Jackson St',    1, '$4-8',   '{scallion_pancakes,dumplings,cash_only}',  false, 'Scallion pancakes $4, pot stickers $6', 37.7959, -122.4065),

-- Richmond / Sunset hidden gems
('kingdom-of-dumpling',  'Kingdom of Dumpling',    'food', 'chinese',    'Sunset',      '1713 Taraval St',   1, '$8-12',  '{dumplings,xlb,neighborhood_gem}',        false, 'XLB and dumplings, Sunset favorite', 37.7432, -122.4831),
('dragon-beaux',         'Sichuan Home',           'food', 'chinese',    'Richmond',    '5037 Geary Blvd',   1, '$10-14', '{sichuan,spicy,authentic}',                false, 'Authentic Sichuan, huge portions under $14', 37.7812, -122.4615),
('ppq-dungeness',        'PPQ Dungeness Island',   'food', 'vietnamese', 'Sunset',      '2332 Clement St',   1, '$12-15', '{crab,noodles,huge_portions}',             false, 'Famous garlic noodles, generous portions', 37.7831, -122.4837),
('mandalay-restaurant',  'Mandalay Restaurant',    'food', 'burmese',    'Richmond',    '4348 California St', 1, '$10-13', '{burmese,tea_leaf_salad,unique}',          false, 'Tea leaf salad $10, unique Burmese food', 37.7858, -122.4629),
('burma-superstar-to-go','Burma Love To-Go',       'food', 'burmese',    'Richmond',    '309 6th Ave',       1, '$10-14', '{burmese,takeout,no_wait}',                false, 'Same food as Burma Superstar, no 2hr wait', 37.7837, -122.4635),

-- Tacos outside Mission
('taqueria-san-jose',    'Taqueria San Jose',      'food', 'mexican',    'Mission',     '2830 Mission St',   1, '$8-11',  '{tacos,burritos,24_hours}',                false, 'Open 24hrs, solid burritos any time', 37.7514, -122.4181),
('el-castillito',        'El Castillito',          'food', 'mexican',    'Mission',     '136 Church St',     1, '$9-12',  '{burritos,huge_portions}',                 false, 'Massive burritos, Church St location', 37.7678, -122.4290),
('los-coyotes',          'Los Coyotes',            'food', 'mexican',    'SoMa',        '3036 16th St',      1, '$8-11',  '{tacos,carne_asada,late_night}',           false, 'Carne asada tacos $3, open late', 37.7649, -122.4224),

-- Indian (missing category!)
('pakwan',               'Pakwan',                 'food', 'indian',     'Mission',     '3182 16th St',      1, '$8-12',  '{pakistani,biryani,naan}',                 false, 'Massive biryani plates under $12, BYOB', 37.7651, -122.4234),
('udupi-palace',         'Udupi Palace',           'food', 'indian',     'Valencia',    '1007 Valencia St',  1, '$10-14', '{south_indian,dosa,vegetarian}',           false, 'Giant dosas $10-12, all vegetarian', 37.7561, -122.4210),
('darbar-restaurant',    'Darbar Restaurant',      'food', 'indian',     'Tenderloin',  '44 O Farrell St',  1, '$9-13',  '{buffet,lunch_deal,north_indian}',         false, 'Lunch buffet $11.99, all you can eat', 37.7867, -122.4078),

-- Breakfast & Brunch (cheap)
('joes-cable-car',       'Joes Cable Car',         'food', 'breakfast',  'Excelsior',   '4320 Mission St',   1, '$8-12',  '{burgers,breakfast,old_school}',           false, 'Old-school burgers and breakfast since 1965', 37.7282, -122.4341),
('art-s-cafe',           'Arts Cafe',              'food', 'breakfast',  'Sunset',      '747 Irving St',     1, '$8-12',  '{diner,pancakes,huge_portions}',           false, 'Classic diner, giant pancakes, under $12', 37.7638, -122.4635),
('lucky-penny',          'Lucky Penny',            'food', 'breakfast',  'Noe Valley',  '2670 Geary Blvd',   1, '$9-13',  '{diner,24_hours,classic}',                 false, 'Classic SF diner, open late', 37.7818, -122.4435),

-- Japanese cheap eats
('sushi-zone',           'Sushi Zone',             'food', 'japanese',   'Castro',      '1815 Market St',    1, '$10-15', '{sushi,omakase_value,tiny}',               false, 'Tiny 6-seat sushi bar, incredible value', 37.7698, -122.4270),
('katsu-curry',          'Muracci Japanese Curry',  'food', 'japanese',   'FiDi',        '307 Kearny St',     1, '$10-13', '{curry,katsu,fast}',                       false, 'Japanese curry and katsu under $13', 37.7913, -122.4041),
('izakaya-sozai',        'Izakaya Sozai',          'food', 'japanese',   'Sunset',      '1500 Irving St',    1, '$10-14', '{izakaya,ramen,neighborhood}',             false, 'Sunset hidden gem, great ramen $12', 37.7637, -122.4744),

-- Korean
('namu-stonepot',        'Namu Stonepot',          'food', 'korean',     'Divisadero',  '499 Divisadero St', 1, '$10-14', '{bibimbap,stonepot,healthy}',              false, 'Korean stonepot bowls, filling and cheap', 37.7747, -122.4373),
('toyose',               'Toyose',                 'food', 'korean',     'Sunset',      '3814 Noriega St',   1, '$10-15', '{late_night,hidden,cash_only}',            false, 'Hidden behind garage door, amazing Korean late-night', 37.7536, -122.5005),

-- Thai
('lers-ros',             'Lers Ros Thai',          'food', 'thai',       'Tenderloin',  '730 Larkin St',     1, '$10-14', '{thai,spicy,authentic}',                   false, 'Best authentic Thai in SF, big portions', 37.7831, -122.4175),
('osha-thai',            'Osha Thai Noodle Cafe',  'food', 'thai',       'Tenderloin',  '696 Geary St',      1, '$10-13', '{noodles,pad_thai,quick}',                 false, 'Quick Thai noodles, solid pad thai $11', 37.7860, -122.4142),

-- Sandwiches & Deli
('ikes-sandwiches',      'Ikes Love & Sandwiches', 'food', 'sandwiches', null,          'Multiple SF locations', 1, '$10-13', '{sandwiches,dutch_crunch,local}',       false, 'Dutch crunch sandwiches, massive portions', 37.7749, -122.4194),
('roxie-food-center',    'Roxie Food Center',      'food', 'sandwiches', 'Mission',     '1901 San Jose Ave', 1, '$8-11',  '{deli,sandwiches,neighborhood}',           false, 'Huge deli sandwiches under $11', 37.7434, -122.4373),
('lucca-deli',           'Lucca Ravioli Co',       'food', 'italian',    'Mission',     '1100 Valencia St',  1, '$8-12',  '{deli,ravioli,italian,since_1925}',        false, 'Fresh ravioli and Italian deli since 1925', 37.7535, -122.4209),

-- Late Night
('grubstake',            'Grubstake',              'food', 'late_night', 'Polk Gulch',  '1525 Pine St',      1, '$10-14', '{late_night,portuguese,burgers}',           false, 'Late-night burgers in a converted train car', 37.7887, -122.4207),
('naan-n-curry',         'Naan N Curry',           'food', 'indian',     'Tenderloin',  '336 O Farrell St', 1, '$8-12',  '{late_night,naan,curry,24_hours}',         false, 'Cheap curry and naan, open super late', 37.7860, -122.4107);

-- ============================================================
-- Venue alternatives for new spots
-- ============================================================

-- China Live -> more cheap Chinese
insert into venue_alternatives (expensive_venue_id, cheaper_venue_id, estimated_savings, reason, sort_order) values
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='delicious-dim-sum'), '80-85% cheaper', 'Legendary dim sum to-go $3-6, always worth the line', 5),
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='aa-bakery'),         '85-90% cheaper', 'Egg tarts $1.50, BBQ pork buns $2', 6),
((select id from sf_venues where slug='china-live'), (select id from sf_venues where slug='house-of-pancakes'), '75-85% cheaper', 'Scallion pancakes $4, cash only', 7);

-- ============================================================
-- Merchant aliases for new spots
-- ============================================================
insert into merchant_aliases (alias_pattern, venue_slug) values
('pakwan', 'pakwan'),
('udupi', 'udupi-palace'),
('lers ros', 'lers-ros'),
('ikes', 'ikes-sandwiches'), ('ike''s', 'ikes-sandwiches'),
('naan n curry', 'naan-n-curry'), ('naan curry', 'naan-n-curry'),
('toyose', 'toyose'),
('sushi zone', 'sushi-zone'),
('grubstake', 'grubstake');
