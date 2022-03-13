CREATE TABLE locations(
    location_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    latlng POINT NOT NULL /*!80003 SRID 4326 */,
    radius INT,

    PRIMARY KEY (location_id)
) ENGINE=INNODB;


CREATE TABLE sensors(
    sensor_id INT NOT NULL AUTO_INCREMENT,
    model_no VARCHAR(255),
    /* other meta data? */
    location_id INT,

    PRIMARY KEY (sensor_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=INNODB;


CREATE TABLE sensor_data(
    data_id INT NOT NULL AUTO_INCREMENT,
    temperature FLOAT,
    conductivity FLOAT,
    ph FLOAT,

    PRIMARY KEY (data_id)
) ENGINE=INNODB;


CREATE TABLE measurements(
     id INT NOT NULL AUTO_INCREMENT,
     measured_at TIMESTAMP NOT NULL,
     sensor_id INT NOT NULL,
     location_id INT NOT NULL,
     data_id INT NOT NULL,

     PRIMARY KEY (id),
     FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id),
     FOREIGN KEY (data_id) REFERENCES sensor_data(data_id),
     FOREIGN KEY (location_id) REFERENCES locations(location_id)
) ENGINE=INNODB;
