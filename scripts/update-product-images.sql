-- ============================================================================
-- UPDATE PRODUCT IMAGES WITH REAL URLs
-- Run this AFTER your products are already in the database
-- Using LOWER() for case-insensitive matching to handle inconsistent casing
-- ============================================================================

-- CLEANSERS (15)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71LxWdJNQML._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('Low pH Good Morning Gel Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61qK-FcG8TL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Krave Beauty') AND LOWER(name) = LOWER('Matcha Hemp Hydrating Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61MXLIxgS7L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('CeraVe') AND LOWER(name) = LOWER('Hydrating Facial Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61hpIcqEl7L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('La Roche-Posay') AND LOWER(name) = LOWER('Toleriane Hydrating Gentle Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61kMYrcD4tL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Heimish') AND LOWER(name) = LOWER('All Clean Balm');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71dS2uxHKPL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Then I Met You') AND LOWER(name) = LOWER('Living Cleansing Balm');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61gFXJeIr6L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Banila Co') AND LOWER(name) = LOWER('Clean It Zero Cleansing Balm Original');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71dNJph3SSL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Paula''s Choice') AND LOWER(name) = LOWER('CLEAR Pore Normalizing Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61XM6cXKUdL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Youth To The People') AND LOWER(name) = LOWER('Superfood Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51e0NJHN8fL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Round Lab') AND LOWER(name) = LOWER('1025 Dokdo Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61UE7M2RAIL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Innisfree') AND LOWER(name) = LOWER('Green Tea Amino Hydrating Cleansing Foam');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61GEGaPbBAL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Vanicream') AND LOWER(name) = LOWER('Gentle Facial Cleanser');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71CJPm0dYQL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Elf') AND LOWER(name) = LOWER('Holy Hydration! Makeup Melting Cleansing Balm');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61YWKY5dYZL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Beauty of Joseon') AND LOWER(name) = LOWER('Radiance Cleansing Balm');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51tFKrXNHcL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Stratia') AND LOWER(name) = LOWER('Velvet Cleansing Milk');

-- TONERS (15)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61gW4qwGBQL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Klairs') AND LOWER(name) = LOWER('Supple Preparation Unscented Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61aB5+5oC3L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('AHA/BHA Clarifying Treatment Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61Zxb7CfzPL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Paula''s Choice') AND LOWER(name) = LOWER('2% BHA Liquid Exfoliant');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51qZdRBvORL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Isntree') AND LOWER(name) = LOWER('Hyaluronic Acid Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61PeyPkDyVL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Pyunkang Yul') AND LOWER(name) = LOWER('Essence Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/41bJxaLirkL._SL1000_.jpg' WHERE LOWER(brand) = LOWER('Hada Labo') AND LOWER(name) = LOWER('Gokujyun Premium Lotion');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71HW9aCF-QL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Some By Mi') AND LOWER(name) = LOWER('AHA BHA PHA 30 Days Miracle Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51R6xXBPGQL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('The Ordinary') AND LOWER(name) = LOWER('Glycolic Acid 7% Toning Solution');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51zFLpWGP-L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Laneige') AND LOWER(name) = LOWER('Cream Skin Refiner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61ByNFLCPeL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Kikumasamune') AND LOWER(name) = LOWER('High Moist Lotion');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71P8WnKCBxL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Pixi') AND LOWER(name) = LOWER('Glow Tonic');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71kT+m2c5JL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Naturie') AND LOWER(name) = LOWER('Hatomugi Skin Conditioner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61HrMT0ivVL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Be Plain') AND LOWER(name) = LOWER('Bamboo Hydrating Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61PEgYKT6LL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('SKIN1004') AND LOWER(name) = LOWER('Madagascar Centella Toning Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61qrqvY2wIL._SL1200_.jpg' WHERE LOWER(brand) = LOWER('Keep Cool') AND LOWER(name) = LOWER('Soothe Bamboo Toner');

-- SERUMS/ESSENCES (20)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61rCy3F2zTL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('Advanced Snail 96 Mucin Power Essence');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61W65lFNNTL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('The Ordinary') AND LOWER(name) = LOWER('Niacinamide 10% + Zinc 1%');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71pxtoYMYzL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Good Molecules') AND LOWER(name) = LOWER('Hyaluronic Acid Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61m0BTDP5FL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Beauty of Joseon') AND LOWER(name) = LOWER('Glow Serum: Propolis + Niacinamide');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51kIcLPLBHL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Paula''s Choice') AND LOWER(name) = LOWER('C15 Super Booster');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51O+hGfPaEL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('IUNIK') AND LOWER(name) = LOWER('Propolis Vitamin Synergy Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61x7ZdF9FKL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Purito') AND LOWER(name) = LOWER('Centella Unscented Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61c+9nCBVpL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Timeless') AND LOWER(name) = LOWER('Vitamin C + E Ferulic Acid Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51p-ZkZRMuL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Skinceuticals') AND LOWER(name) = LOWER('C E Ferulic');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61BYuMDlG9L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('The Ordinary') AND LOWER(name) = LOWER('Hyaluronic Acid 2% + B5');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51YJJ+FKBRL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Missha') AND LOWER(name) = LOWER('Time Revolution First Treatment Essence');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61WKFCRFQ1L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('SK-II') AND LOWER(name) = LOWER('Facial Treatment Essence');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/41W-4BuVnvL._SL1200_.jpg' WHERE LOWER(brand) = LOWER('Rohto Melano CC') AND LOWER(name) = LOWER('Vitamin C Essence');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51yx3cQ7rKL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Tiam') AND LOWER(name) = LOWER('Vita B3 Source');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51n2AwcSQqL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('By Wishtrend') AND LOWER(name) = LOWER('Pure Vitamin C 21.5 Advanced Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61KSJI3+9IL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Drunk Elephant') AND LOWER(name) = LOWER('C-Firma Fresh Day Serum');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51bqJC7MjtL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('One Thing') AND LOWER(name) = LOWER('Centella Asiatica Extract');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61WR7Q0WDRL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Numbuzin') AND LOWER(name) = LOWER('No. 3 Super Glowing Essence Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51wKLIvJ7JL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Anua') AND LOWER(name) = LOWER('Heartleaf 77% Soothing Toner');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61qQv7v6URL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Torriden') AND LOWER(name) = LOWER('Dive-In Low Molecular Hyaluronic Acid Serum');

-- MOISTURIZERS (20)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61pUq2GKXJL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('Oil-Free Ultra-Moisturizing Lotion');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61S7BrCBj7L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('CeraVe') AND LOWER(name) = LOWER('PM Facial Moisturizing Lotion');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/716g06aOBTL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Neutrogena') AND LOWER(name) = LOWER('Hydro Boost Water Gel');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61sVgFLfXEL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Illiyoon') AND LOWER(name) = LOWER('Ceramide Ato Concentrate Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61Bm8FNQ-5L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Kiehl''s') AND LOWER(name) = LOWER('Ultra Facial Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61lCn4Vg-HL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('La Roche-Posay') AND LOWER(name) = LOWER('Toleriane Double Repair Face Moisturizer');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51NyN+rTjZL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Belif') AND LOWER(name) = LOWER('The True Cream Aqua Bomb');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61hMvdpZURL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Etude House') AND LOWER(name) = LOWER('Soon Jung 2x Barrier Intensive Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61x9vVyGPsL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('First Aid Beauty') AND LOWER(name) = LOWER('Ultra Repair Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61NE4xjzShL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Peter Thomas Roth') AND LOWER(name) = LOWER('Water Drench Hyaluronic Cloud Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51eW8jxYHIL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Tatcha') AND LOWER(name) = LOWER('The Dewy Skin Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61JRl-a0OkL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Drunk Elephant') AND LOWER(name) = LOWER('Protini Polypeptide Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51qXdWPIYBL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('The Ordinary') AND LOWER(name) = LOWER('Natural Moisturizing Factors + HA');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51TuWYe9UbL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Round Lab') AND LOWER(name) = LOWER('1025 Dokdo Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51MJVzAZnUL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('iUNIK') AND LOWER(name) = LOWER('Centella Calming Gel Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71HqD8YEBKL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Vanicream') AND LOWER(name) = LOWER('Daily Facial Moisturizer');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51tWjJM-fLL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Stratia') AND LOWER(name) = LOWER('Liquid Gold');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51HVXeAolTL._SL1200_.jpg' WHERE LOWER(brand) = LOWER('Soon Jung') AND LOWER(name) = LOWER('10 Free Moist Emulsion');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51wVQ-GofTL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Glow Recipe') AND LOWER(name) = LOWER('Plum Plump Hyaluronic Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71hqYN0VQuL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Aveeno') AND LOWER(name) = LOWER('Calm + Restore Oat Gel Moisturizer');

-- SUNSCREENS (15)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61C1GBEgLJL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Supergoop') AND LOWER(name) = LOWER('Unseen Sunscreen SPF 40');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71t7BaKmPEL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Biore') AND LOWER(name) = LOWER('UV Aqua Rich Watery Essence SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51d1hG8OfNL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Isntree') AND LOWER(name) = LOWER('Hyaluronic Acid Watery Sun Gel SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51R7W5T0-kL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Beauty of Joseon') AND LOWER(name) = LOWER('Relief Sun: Rice + Probiotics SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61dYq9G-mdL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('La Roche-Posay') AND LOWER(name) = LOWER('Anthelios Melt-in Milk SPF 100');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51YvPY9BXeL._SL1200_.jpg' WHERE LOWER(brand) = LOWER('Canmake') AND LOWER(name) = LOWER('Mermaid Skin Gel UV SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61kzpkBX-vL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Elta MD') AND LOWER(name) = LOWER('UV Clear Broad-Spectrum SPF 46');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61BZrjLTsLL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Purito') AND LOWER(name) = LOWER('Daily Go-To Sunscreen SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61s+K4ZDBWL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Skin Aqua') AND LOWER(name) = LOWER('Super Moisture Gel SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51VkJR4UJUL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Krave Beauty') AND LOWER(name) = LOWER('The Beet Shield SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61G5rRoGQ7L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Missha') AND LOWER(name) = LOWER('All Around Safe Block Essence Sun SPF 45');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51d-RmIf5HL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Round Lab') AND LOWER(name) = LOWER('Birch Juice Moisturizing Sun Cream SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61a9kPaLhDL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Bondi Sands') AND LOWER(name) = LOWER('Hydra UV Protect SPF 50+ Face Fluid');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61HjKcOpURL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Anessa') AND LOWER(name) = LOWER('Perfect UV Sunscreen Skincare Milk SPF 50+');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61pnMlMLbVL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('Aloe Soothing Sun Cream SPF 50+');

-- EYE CREAMS (5)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/71oXKKoAM8L._SL1500_.jpg' WHERE LOWER(brand) = LOWER('CeraVe') AND LOWER(name) = LOWER('Eye Repair Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61GZLfxDNVL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('The Ordinary') AND LOWER(name) = LOWER('Caffeine Solution 5% + EGCG');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61eWxLLvTXL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Kiehl''s') AND LOWER(name) = LOWER('Creamy Eye Treatment with Avocado');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51N-4Tq7TdL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Innisfree') AND LOWER(name) = LOWER('Green Tea Seed Eye Cream');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51YZq6WYLNL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Mizon') AND LOWER(name) = LOWER('Snail Repair Eye Cream');

-- MASKS (10)
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51kxWdGI3NL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Laneige') AND LOWER(name) = LOWER('Water Sleeping Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51OPMXS8-QL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Glow Recipe') AND LOWER(name) = LOWER('Watermelon Glow Sleeping Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61nLm9eV7WL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('COSRX') AND LOWER(name) = LOWER('Ultimate Nourishing Rice Overnight Spa Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51KXHcE6ZXL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Origins') AND LOWER(name) = LOWER('Drink Up Intensive Overnight Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51FaLj-LQFL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('I''m From') AND LOWER(name) = LOWER('Mugwort Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61E+YHmK9OL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Innisfree') AND LOWER(name) = LOWER('Super Volcanic Pore Clay Mask 2X');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51Hwa4RCDCL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Summer Fridays') AND LOWER(name) = LOWER('Jet Lag Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51x-C8xZ7qL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Herbivore') AND LOWER(name) = LOWER('Blue Tansy Resurfacing Clarity Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/51A2NWkILTL._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Farmacy') AND LOWER(name) = LOWER('Honey Potion Renewing Antioxidant Hydration Mask');
UPDATE products SET image_url = 'https://m.media-amazon.com/images/I/61gRo3YoxML._SL1500_.jpg' WHERE LOWER(brand) = LOWER('Kiehl''s') AND LOWER(name) = LOWER('Rare Earth Deep Pore Cleansing Masque');

-- Check how many were updated
SELECT 'Products with real images:' as status, COUNT(*) as count FROM products WHERE image_url LIKE '%amazon%';
SELECT 'Products still with placeholder:' as status, COUNT(*) as count FROM products WHERE image_url LIKE '%example.com%';
SELECT 'Products with no image:' as status, COUNT(*) as count FROM products WHERE image_url IS NULL;
