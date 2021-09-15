INSERT INTO users (name, email, password)
VALUES ('Peter Parker', web@developer.net, '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Clark Kent', superfly@krypton.com, '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bruce Wayne', sosad@mancake.com, '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Aunt Mays', 'description', 'https://source.unsplash.com/350x350/?person', 'https://source.unsplash.com/1600x900/?house', 93061, 6, 4, 4, 'Canada', '150 E 16th Ave', 'Vancouver', 'British Columbia', 'V5T 2T2', 'true'),
(2, 'The Farm', 'description', 'https://source.unsplash.com/350x350/?person', 'https://source.unsplash.com/1600x900/?house', 83011, 2, 2, 2,'Canada', '768 Richards St', 'Vancouver', 'British Columbia', 'V6B 5E3', 'true'),
(3, 'The Bat Cave', 'description', 'https://source.unsplash.com/350x350/?person', 'https://source.unsplash.com/1600x900/?house', 30061, 0, 1, 1, 'Canada', '4572 W 10th Ave', 'Vancouver', 'British Columbia', 'V6R 2J1', 'true');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 2, '2018-09-11', '2018-09-26'),
(2, 3, '2019-01-04', '2019-02-01'),
(3, 1, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 4, 'message'),
(2, 3, 2, 3, 'message'),
(3, 1, 3, 2, 'message');

