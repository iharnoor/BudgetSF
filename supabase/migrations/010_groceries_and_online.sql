-- WealthLens: Add Walmart, new online category

-- ============================================================
-- New venues (only ones that don't exist yet)
-- ============================================================

insert into sf_venues (slug, name, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description, lat, lng) values
('walmart-sf',       'Walmart',           'groceries', 'supermarket',      null, 'Multiple Bay Area locations',  1, '$',                '{everyday_low_price,one_stop}',           true,  'Everyday low prices, groceries + everything else', 37.7290, -122.4010),
('costco-delivery',  'Costco Same-Day',   'online',    'grocery_delivery', null, 'Delivery',                     1, 'Costco prices',    '{bulk,same_day,membership}',               true,  'Costco prices delivered same-day via Instacart', 37.7749, -122.4194),
('thrive-market',    'Thrive Market',     'online',    'organic_grocery',  null, 'Delivery',                     1, '25-50% off retail','{organic,wholesale,membership}',            false, 'Organic groceries at wholesale prices, ships free', 37.7749, -122.4194),
('misfits-market',   'Misfits Market',    'online',    'organic_grocery',  null, 'Delivery',                     1, 'Up to 40% off',   '{organic,ugly_produce,value}',              false, 'Ugly produce + organic staples, up to 40% off', 37.7749, -122.4194);

-- Move existing delivery venues to "online" category
update sf_venues set category = 'online' where slug in ('walmart-plus', 'amazon-fresh');

-- Merchant aliases
insert into merchant_aliases (alias_pattern, venue_slug) values
('walmart', 'walmart-sf'), ('wal-mart', 'walmart-sf'), ('wal mart', 'walmart-sf'),
('thrive market', 'thrive-market'),
('misfits market', 'misfits-market'), ('misfits', 'misfits-market');
