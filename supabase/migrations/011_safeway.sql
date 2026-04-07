-- WealthLens: Add Safeway grocery store

insert into sf_venues (slug, name, category, subcategory, neighborhood, address, price_tier, avg_price, tags, is_chain, description, lat, lng) values
('safeway',  'Safeway',  'groceries', 'supermarket', null, 'Multiple SF locations', 2, '$$', '{chain,rewards_program,pharmacy}', true, 'Widespread in SF, Club Card deals + gas rewards', 37.7645, -122.4320);

insert into merchant_aliases (alias_pattern, venue_slug) values
('safeway', 'safeway'), ('safeway store', 'safeway'), ('swy', 'safeway');
