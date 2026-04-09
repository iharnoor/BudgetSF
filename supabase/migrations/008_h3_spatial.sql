-- WealthLens: H3 Hexagonal Spatial Indexing for Venue Proximity
-- Adds real lat/lng coordinates and H3 hex indices (resolution 8)
-- to enable "find nearest cheaper alternative" queries

-- ============================================================
-- Add H3 index column
-- ============================================================
alter table sf_venues add column if not exists h3_index_res8 text;

create index idx_sf_venues_h3 on sf_venues(h3_index_res8);

-- ============================================================
-- Backfill real lat/lng coordinates for all venues
-- ============================================================

-- === FOOD: Mexican ===
update sf_venues set lat = 37.7599, lng = -122.4148 where slug = 'chipotle';          -- avg SF location (Mission)
update sf_venues set lat = 37.7509, lng = -122.4181 where slug = 'la-taqueria';        -- 2889 Mission St
update sf_venues set lat = 37.7525, lng = -122.4183 where slug = 'el-farolito';        -- 2779 Mission St
update sf_venues set lat = 37.7583, lng = -122.4191 where slug = 'taqueria-cancun';    -- 2288 Mission St
update sf_venues set lat = 37.7536, lng = -122.4179 where slug = 'farolito-guerrero';  -- 1206 Guerrero St
update sf_venues set lat = 37.7604, lng = -122.4216 where slug = 'taqueria-el-buen-sabor'; -- 699 Valencia St

-- === FOOD: Mediterranean ===
update sf_venues set lat = 37.7763, lng = -122.4214 where slug = 'souvla';             -- 517 Hayes St
update sf_venues set lat = 37.7649, lng = -122.4194 where slug = 'truly-mediterranean';-- 3109 16th St
update sf_venues set lat = 37.7530, lng = -122.4180 where slug = 'old-jerusalem';      -- 2976 Mission St
update sf_venues set lat = 37.7637, lng = -122.4680 where slug = 'sunrise-deli';       -- 2115 Irving St

-- === FOOD: Bowls/Salads ===
update sf_venues set lat = 37.7600, lng = -122.4150 where slug = 'sweetgreen';         -- avg SF location
update sf_venues set lat = 37.7610, lng = -122.4155 where slug = 'cava';               -- avg SF location
update sf_venues set lat = 37.7620, lng = -122.4200 where slug = 'senor-sisig';        -- food trucks, avg Mission
update sf_venues set lat = 37.7743, lng = -122.4200 where slug = 'rt-rotisserie';      -- 101 Oak St
update sf_venues set lat = 37.7946, lng = -122.4020 where slug = 'mixt';               -- 475 Sansome St (FiDi)

-- === FOOD: Vietnamese ===
update sf_venues set lat = 37.7946, lng = -122.3999 where slug = 'tin-vietnamese';     -- Kearny St, FiDi
update sf_venues set lat = 37.7833, lng = -122.4170 where slug = 'saigon-sandwich';    -- 560 Larkin St
update sf_venues set lat = 37.7843, lng = -122.4166 where slug = 'turtle-tower';       -- 645 Larkin St
update sf_venues set lat = 37.7840, lng = -122.4167 where slug = 'pho-2000';           -- 637 Larkin St
update sf_venues set lat = 37.7830, lng = -122.4152 where slug = 'hai-ky-mi-gia';      -- 707 Ellis St
update sf_venues set lat = 37.7862, lng = -122.4138 where slug = 'bun-mee';            -- 674 Geary St

-- === FOOD: Coffee ===
update sf_venues set lat = 37.7820, lng = -122.4070 where slug = 'blue-bottle';        -- avg SF location
update sf_venues set lat = 37.7820, lng = -122.4090 where slug = 'starbucks';          -- avg SF location
update sf_venues set lat = 37.7645, lng = -122.4220 where slug = 'philz-coffee';       -- avg SF location (Mission)
update sf_venues set lat = 37.7812, lng = -122.4112 where slug = 'equator-coffees';    -- 986 Market St
update sf_venues set lat = 37.7771, lng = -122.4074 where slug = 'sightglass';         -- 270 7th St, SoMa
update sf_venues set lat = 37.7906, lng = -122.3940 where slug = 'red-bay-coffee';     -- Salesforce Transit Center
update sf_venues set lat = 37.7815, lng = -122.4095 where slug = 'peets-coffee';       -- avg SF location
update sf_venues set lat = 37.7609, lng = -122.4350 where slug = 'verve-coffee';       -- 2101 Market St, Castro
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'home-brewing';       -- generic "home"

-- === FOOD: Ice Cream ===
update sf_venues set lat = 37.7630, lng = -122.4200 where slug = 'salt-and-straw';     -- avg SF location
update sf_venues set lat = 37.7502, lng = -122.4340 where slug = 'mitchells-ice-cream';-- 688 San Jose Ave
update sf_venues set lat = 37.7616, lng = -122.4255 where slug = 'bi-rite-creamery';   -- 3692 18th St
update sf_venues set lat = 37.7585, lng = -122.4229 where slug = 'garden-creamery';    -- 3566 20th St
update sf_venues set lat = 37.7543, lng = -122.4131 where slug = 'humphry-slocombe';   -- 2790 Harrison St
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'tj-ice-cream';       -- generic TJ's

-- === FOOD: Boba ===
update sf_venues set lat = 37.7640, lng = -122.4210 where slug = 'boba-guys';          -- avg SF location
update sf_venues set lat = 37.8060, lng = -122.4130 where slug = 'plentea';            -- 2237 Mason St
update sf_venues set lat = 37.7425, lng = -122.4855 where slug = 'feng-cha';           -- 1946 Taraval St
update sf_venues set lat = 37.7961, lng = -122.4058 where slug = 'sharetea';           -- 240 Jackson St
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'homemade-boba';      -- generic "home"

-- === FOOD: Pizza ===
update sf_venues set lat = 37.7700, lng = -122.4150 where slug = 'dominos';            -- avg SF location
update sf_venues set lat = 37.7700, lng = -122.4050 where slug = 'costco-pizza';       -- 450 10th St (SoMa)
update sf_venues set lat = 37.7621, lng = -122.4220 where slug = 'arinell-pizza';      -- 509 Valencia St
update sf_venues set lat = 37.7997, lng = -122.4074 where slug = 'golden-boy-pizza';   -- 542 Green St
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'tj-frozen-pizza';    -- generic TJ's

-- === FOOD: Burgers ===
update sf_venues set lat = 37.7850, lng = -122.4070 where slug = 'shake-shack';        -- avg SF location
update sf_venues set lat = 37.8080, lng = -122.4177 where slug = 'in-n-out';           -- 333 Jefferson St
update sf_venues set lat = 37.7800, lng = -122.4100 where slug = 'super-duper';        -- avg SF location
update sf_venues set lat = 37.7986, lng = -122.4370 where slug = 'causwells';          -- 2346 Chestnut St
update sf_venues set lat = 37.7983, lng = -122.4375 where slug = 'roam-burgers';       -- 1785 Union St

-- === FOOD: Chinese ===
update sf_venues set lat = 37.7976, lng = -122.4066 where slug = 'china-live';         -- 644 Broadway
update sf_venues set lat = 37.7948, lng = -122.4093 where slug = 'good-mong-kok';      -- 1039 Stockton St
update sf_venues set lat = 37.7955, lng = -122.4070 where slug = 'z-and-y';            -- 655 Jackson St
update sf_venues set lat = 37.7637, lng = -122.4680 where slug = 'san-tung';           -- 1031 Irving St
update sf_venues set lat = 37.7979, lng = -122.4092 where slug = 'yin-du-wonton';      -- 731 Vallejo St

-- === FOOD: Japanese/Matcha ===
update sf_venues set lat = 37.7750, lng = -122.4100 where slug = 'maruwu-seicha';      -- SF generic
update sf_venues set lat = 37.7621, lng = -122.4218 where slug = 'stonemill-matcha';   -- 561 Valencia St
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'homemade-matcha';    -- generic "home"

-- === GROCERIES ===
update sf_venues set lat = 37.7850, lng = -122.4050 where slug = 'whole-foods';        -- avg SF location
update sf_venues set lat = 37.7750, lng = -122.4200 where slug = 'trader-joes';        -- avg SF location
update sf_venues set lat = 37.7700, lng = -122.4250 where slug = 'grocery-outlet';     -- avg SF location
update sf_venues set lat = 37.7700, lng = -122.4050 where slug = 'costco-sf';          -- 450 10th St
update sf_venues set lat = 37.7565, lng = -122.4165 where slug = 'smart-and-final';    -- 1245 S Van Ness
update sf_venues set lat = 37.7583, lng = -122.4191 where slug = 'duc-loi';            -- 2200 Mission St

-- === DELIVERY (virtual — use city center) ===
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'doordash';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'uber-eats';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'instacart';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'dashmart';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'direct-pickup';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'restaurant-delivery';
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'meal-prep';
update sf_venues set lat = 37.7700, lng = -122.4050 where slug = 'costco-prepared';    -- same as Costco
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'walmart-plus';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'amazon-fresh';

-- === RETAIL ===
update sf_venues set lat = 37.7800, lng = -122.4150 where slug = 'walgreens';          -- avg SF
update sf_venues set lat = 37.7854, lng = -122.4030 where slug = 'target-sf';          -- 789 Mission St
update sf_venues set lat = 37.7700, lng = -122.4200 where slug = 'dollar-tree';        -- avg SF

-- === BARS ===
update sf_venues set lat = 37.7800, lng = -122.4100 where slug = 'sf-cocktail-bars';   -- generic
update sf_venues set lat = 37.7940, lng = -122.4076 where slug = 'li-po-lounge';       -- 916 Grant Ave
update sf_venues set lat = 37.7649, lng = -122.4236 where slug = 'the-500-club';       -- 500 Guerrero St
update sf_venues set lat = 37.7719, lng = -122.4296 where slug = 'toronado';           -- 547 Haight St
update sf_venues set lat = 37.7750, lng = -122.4200 where slug = 'tj-wine-beer';       -- generic TJ's

-- === FITNESS ===
update sf_venues set lat = 37.7850, lng = -122.4100 where slug = 'equinox';            -- avg SF
update sf_venues set lat = 37.7800, lng = -122.4050 where slug = 'soulcycle';           -- avg SF
update sf_venues set lat = 37.7694, lng = -122.4862 where slug = 'sf-rec-gyms';        -- avg rec center
update sf_venues set lat = 37.7750, lng = -122.4150 where slug = 'planet-fitness';
update sf_venues set lat = 37.7780, lng = -122.4120 where slug = '24-hour-fitness';
update sf_venues set lat = 37.7694, lng = -122.4862 where slug = 'outdoor-fitness';    -- Golden Gate Park area
update sf_venues set lat = 37.7700, lng = -122.4300 where slug = 'peloton-home';       -- home
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'bay-wheels';         -- citywide

-- === TRANSPORTATION (virtual — city center) ===
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'uber';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'lyft';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'muni';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'bart';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'lime-scooters';

-- === SUBSCRIPTIONS (virtual) ===
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'netflix';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'sfpl-kanopy';
update sf_venues set lat = 37.7749, lng = -122.4194 where slug = 'tubi-pluto';


-- ============================================================
-- Add distance_meters to venue_alternatives for proximity sorting
-- ============================================================
alter table venue_alternatives add column if not exists max_distance_meters int;

comment on column sf_venues.h3_index_res8 is 'H3 hex index at resolution 8 (~460m edge). Computed from lat/lng by edge function.';
comment on column venue_alternatives.max_distance_meters is 'Optional max walking distance in meters between the two venues.';
