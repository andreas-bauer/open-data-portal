INSERT INTO locations
(name, latlng, radius)
VALUES
    ('Stockholm', ST_GeomFromText('POINT(59.329323 18.068581)', 4326), 188),
    ('Oslo', ST_GeomFromText('POINT(59.913868 10.752245)', 4326), 454),
    ('Köpenhamn', ST_GeomFromText('POINT(55.675758 12.569020)', 4326), 180);

INSERT INTO sensors
    (model_no, location_id)
VALUES
    ('USB', 1),
    ('ETH', 2),
    ('BTH', 3);

INSERT INTO sensors
    (model_no)
VALUES
    ('TBLT');

INSERT INTO sensor_data
    (temperature, conductivity, ph)
VALUES
    (20.6, 28425, 7.5),
    (20.3, 32345, 7.1),
    (20.5, 33254, 6.5),
    (19.6, 32345, 7.9),
    (22.6, 35674, 8.6),
    (20.9, 34572, 7.5),
    (21.9, 32457, 7.1),
    (20.1, 38456, 7.2),
    (19.4, 38253, 7.2),
    (20.6, 29436, 7.5),
    (17.3, 14325, 6.3),
    (17.5, 14728, 6.6),
    (17.7, 14545, 6.5);

INSERT INTO measurements
    (measured_at, sensor_id, location_id, data_id)
VALUES
    ('2022-03-01T12:00:00', 1, 1, 1),
    ('2022-03-01T12:00:00', 2, 2, 2),
    ('2022-03-01T12:00:00', 3, 3, 3),
    ('2022-03-01T12:01:00', 1, 1, 4),
    ('2022-03-01T12:02:00', 2, 2, 5),
    ('2022-03-01T12:05:00', 3, 3, 6),
    ('2022-03-01T12:02:00', 1, 1, 7),
    ('2022-03-01T12:04:00', 2, 2, 8),
    ('2022-03-01T12:10:00', 3, 3, 9),
    ('2022-03-01T12:03:00', 1, 1, 10);