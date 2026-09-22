-- ============================================================
-- Adi Anadi Restaurant — Seed Data
-- Run AFTER schema.sql
-- Passwords are BCrypt-hashed (strength 12)
-- Admin:    admin@adianadi.com     / Admin@123
-- Customer: jagannath@example.com  / Customer@123
-- ============================================================

USE restaurant_db;

-- ============================================================
-- Roles
-- ============================================================
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ADMIN');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'CUSTOMER');

-- ============================================================
-- Users
-- BCrypt hash for Admin@123
-- BCrypt hash for Customer@123
-- ============================================================
INSERT IGNORE INTO users (id, name, email, mobile, password_hash, is_active, created_at)
VALUES
(1, 'Adi Anadi Admin',  'admin@adianadi.com',      '9000000001',
 '$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE, NOW()),
(2, 'Jagannath Panda',  'jagannath@example.com',   '9876543210',
 '$2a$12$e0MYzXyjpJS7Py3JTvoouuFNGLOp.rDvTk57qOREOD4jHRaqRx5Aq', TRUE, NOW()),
(3, 'Priya Sharma',     'priya@example.com',        '9876543211',
 '$2a$12$e0MYzXyjpJS7Py3JTvoouuFNGLOp.rDvTk57qOREOD4jHRaqRx5Aq', TRUE, NOW());

-- ============================================================
-- User Roles
-- ============================================================
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1); -- admin  → ADMIN
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (2, 2); -- jagannath → CUSTOMER
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (3, 2); -- priya → CUSTOMER

-- ============================================================
-- Restaurant
-- ============================================================
INSERT IGNORE INTO restaurants
(id, name, logo_url, phone, email, address, opening_time, closing_time,
 min_guests, max_guests, advance_payment_required, advance_payment_percentage, created_at)
VALUES
(1, 'Adi Anadi Restaurant',
 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=200',
 '+91-674-2345678', 'info@adianadi.com',
 'Plot No. 42, Janpath, Bhubaneswar, Odisha - 751001',
 '11:00:00', '23:00:00',
 1, 200, FALSE, 0.00, NOW());

-- ============================================================
-- Time Slot Capacities
-- ============================================================
INSERT IGNORE INTO time_slot_capacities (restaurant_id, slot_time, max_guests) VALUES
(1, '11:00:00', 40),
(1, '11:30:00', 40),
(1, '12:00:00', 60),
(1, '12:30:00', 60),
(1, '13:00:00', 60),
(1, '13:30:00', 50),
(1, '14:00:00', 40),
(1, '18:00:00', 40),
(1, '18:30:00', 40),
(1, '19:00:00', 60),
(1, '19:30:00', 60),
(1, '20:00:00', 60),
(1, '20:30:00', 50),
(1, '21:00:00', 40),
(1, '21:30:00', 30),
(1, '22:00:00', 20);

-- ============================================================
-- ============================================================
-- Menu Categories
-- ============================================================
INSERT IGNORE INTO menu_categories (id, restaurant_id, name, description, display_order, is_active, created_at) VALUES
(1, 1, 'Veg Thalis',                   'Authentic vegetarian thali meals cooked with traditional Odia spices',                         1, TRUE, NOW()),
(2, 1, 'Non-Veg Thalis',               'Rich meat, chicken, egg and biryani special thalis',                                           2, TRUE, NOW()),
(3, 1, 'Bhitarkanika Seafood Special', 'Fresh estuarine and river fish, prawn, and crab specialities from Bhitarkanika',              3, TRUE, NOW());

-- ============================================================
-- Menu Items
-- ============================================================
INSERT IGNORE INTO menu_items
(id, category_id, name, description, price, image_url, is_vegetarian, is_available, display_order, created_at)
VALUES
-- Veg Thalis
(1,  1, 'Veg Thali',                  'Traditional Odia vegetarian thali with steamed rice, dalma, seasonal veg tarkari, saag bhaja, tomato khatta, papad, salad and sweet', 99.00,  'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500', TRUE,  TRUE, 1, NOW()),
(2,  1, 'Paneer Thali',               'Special paneer curry cooked in rich gravy, served with aromatic rice, dalma, seasonal sabzi, roti, salad and dessert',                  129.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', TRUE,  TRUE, 2, NOW()),
(3,  1, 'Mashroom Thali',             'Spiced mushroom masala cooked with regional spices, served with steaming rice, dal, mixed vegetable, roti and salad',                   129.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', TRUE,  TRUE, 3, NOW()),

-- Non-Veg Thalis
(4,  2, 'Fish Thali',                 'Authentic Odia fresh fish curry (Machha Jhola/Besara) served with rice, dal, crispy fry, salad and chutney',                           99.00,  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', FALSE, TRUE, 1, NOW()),
(5,  2, 'Egg Thali',                  'Two eggs in spicy onion-tomato gravy served with fragrant steamed rice, dal, seasonal bhaja, salad and papad',                         99.00,  'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500', FALSE, TRUE, 2, NOW()),
(6,  2, 'Chicken Thali',              'Home-style chicken curry simmered in fragrant whole spices, served with steamed rice, dal, sabzi and salad',                            129.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', FALSE, TRUE, 3, NOW()),
(7,  2, 'Desi chicken Thali',         'Special country chicken (Desi Kukkuda) slow-cooked in traditional clay pot style with rich gravy, rice and accompaniments',            199.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', FALSE, TRUE, 4, NOW()),
(8,  2, 'Mutton Thali',               'Signature Odia Mati Handi mutton curry slow-cooked with whole spices, served with steamed rice, dal, salad and papad',                  229.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', FALSE, TRUE, 5, NOW()),
(9,  2, 'Special Thali Dum Biriyani', 'Royal aromatic dum biryani layered with marinated meat, fragrant basmati rice, served with raita, salan and sweet',                    149.00, 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500', FALSE, TRUE, 6, NOW()),

-- Bhitarkanika Seafood Special
(10, 3, 'Bhitarkania fish Thali',     'Fresh estuary fish from Bhitarkanika cooked in mustard and garlic gravy (Besara), served with steamed rice and accompaniments',         199.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', FALSE, TRUE, 1, NOW()),
(11, 3, 'Prawn Thali',                'Succulent fresh prawns in traditional spicy coconut gravy, served with fragrant steamed rice, dal and sides',                            229.00, 'https://images.unsplash.com/photo-1559742811-822873691df8?w=500', FALSE, TRUE, 2, NOW()),
(12, 3, 'Crab Thali',                 'Bhitarkanika mud crab cooked in authentic spicy Kankada Jhola, served with steaming hot rice and accompaniments',                       229.00, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500', FALSE, TRUE, 3, NOW());

-- ============================================================
-- Extra Items
-- ============================================================
INSERT IGNORE INTO extra_items (id, name, description, price, is_available, created_at) VALUES
(1, 'Extra Rice',   'Plain steamed rice — extra portion',                  60.00, TRUE, NOW()),
(2, 'Extra Roti',   'Additional whole wheat roti',                          15.00, TRUE, NOW()),
(3, 'Green Salad',  'Fresh cucumber, tomato, onion and green chilli salad', 50.00, TRUE, NOW()),
(4, 'Papad',        'Crispy roasted papad',                                 20.00, TRUE, NOW()),
(5, 'Water Bottle', 'Packaged drinking water 1 litre',                      20.00, TRUE, NOW()),
(6, 'Soft Drink',   'Can of Coke / Pepsi / Sprite',                         40.00, TRUE, NOW()),
(7, 'Raita',        'Chilled yogurt with cucumber and spices',               40.00, TRUE, NOW());

-- ============================================================
-- Sample Orders (various statuses)
-- ============================================================
INSERT IGNORE INTO orders
(id, order_number, customer_id, restaurant_id, guest_count, booking_date, booking_time,
 special_instructions, subtotal, extra_total, grand_total, status, rejection_reason, created_at)
VALUES
(1, 'ORD-10001', 2, 1, 10, '2026-09-25', '19:30:00',
 'Window seat preferred', 1790.00, 120.00, 1910.00, 'PENDING', NULL,
 '2026-09-21 13:32:00'),

(2, 'ORD-10002', 2, 1, 4, '2026-09-22', '20:00:00',
 NULL, 740.00, 80.00, 820.00, 'APPROVED', NULL,
 '2026-09-20 18:15:00'),

(3, 'ORD-10003', 3, 1, 6, '2026-09-23', '19:00:00',
 'Veg only please', 1020.00, 70.00, 1090.00, 'REJECTED',
 'Restaurant is fully booked for this time slot.',
 '2026-09-19 10:00:00'),

(4, 'ORD-10004', 3, 1, 2, '2026-09-21', '12:30:00',
 NULL, 460.00, 40.00, 500.00, 'COMPLETED', NULL,
 '2026-09-18 09:30:00'),

(5, 'ORD-10005', 2, 1, 8, '2026-09-26', '20:30:00',
 'Birthday celebration', 2160.00, 150.00, 2310.00, 'CANCELLED', NULL,
 '2026-09-21 11:00:00');

-- ============================================================
-- Order Items
-- ============================================================
INSERT IGNORE INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price) VALUES
-- ORD-10001
(1, 9,  'Special Thali Dum Biriyani', 5, 149.00, 745.00),
(1, 2,  'Paneer Thali',               3, 129.00, 387.00),
-- ORD-10002
(2, 6,  'Chicken Thali',              2, 129.00, 258.00),
(2, 1,  'Veg Thali',                  2,  99.00, 198.00),
(2, 4,  'Fish Thali',                 1,  99.00,  99.00),
(2, 5,  'Egg Thali',                  1,  99.00,  99.00),
-- ORD-10003
(3, 1,  'Veg Thali',                  4,  99.00, 396.00),
(3, 2,  'Paneer Thali',               2, 129.00, 258.00),
(3, 3,  'Mashroom Thali',             1, 129.00, 129.00),
-- ORD-10004
(4, 9,  'Special Thali Dum Biriyani', 1, 149.00, 149.00),
(4, 6,  'Chicken Thali',              1, 129.00, 129.00),
-- ORD-10005
(5, 8,  'Mutton Thali',               2, 229.00, 458.00),
(5, 7,  'Desi chicken Thali',         2, 199.00, 398.00),
(5, 11, 'Prawn Thali',                2, 229.00, 458.00);

-- ============================================================
-- Order Extra Items
-- ============================================================
INSERT IGNORE INTO order_extra_items (order_id, extra_item_id, item_name, quantity, unit_price, total_price) VALUES
-- ORD-10001
(1, 3, 'Green Salad',  2, 50.00, 100.00),
(1, 5, 'Water Bottle', 1, 20.00,  20.00),
-- ORD-10002
(2, 6, 'Soft Drink',   2, 40.00,  80.00),
-- ORD-10003
(3, 3, 'Green Salad',  1, 50.00,  50.00),
(3, 5, 'Water Bottle', 1, 20.00,  20.00),
-- ORD-10004
(4, 6, 'Soft Drink',   1, 40.00,  40.00),
-- ORD-10005
(5, 3, 'Green Salad',  3, 50.00, 150.00);

-- ============================================================
-- Order Status History
-- ============================================================
INSERT IGNORE INTO order_status_history (order_id, old_status, new_status, changed_by, reason, changed_at) VALUES
(1, NULL,       'PENDING',   2,    NULL,                                           '2026-09-21 13:32:00'),
(2, NULL,       'PENDING',   2,    NULL,                                           '2026-09-20 18:15:00'),
(2, 'PENDING',  'APPROVED',  1,    NULL,                                           '2026-09-20 18:40:00'),
(3, NULL,       'PENDING',   3,    NULL,                                           '2026-09-19 10:00:00'),
(3, 'PENDING',  'REJECTED',  1,    'Restaurant is fully booked for this time slot.','2026-09-19 10:30:00'),
(4, NULL,       'PENDING',   3,    NULL,                                           '2026-09-18 09:30:00'),
(4, 'PENDING',  'APPROVED',  1,    NULL,                                           '2026-09-18 10:00:00'),
(4, 'APPROVED', 'COMPLETED', 1,    NULL,                                           '2026-09-21 13:00:00'),
(5, NULL,       'PENDING',   2,    NULL,                                           '2026-09-21 11:00:00'),
(5, 'PENDING',  'CANCELLED', 2,    'Changed plans',                                '2026-09-21 11:30:00');
