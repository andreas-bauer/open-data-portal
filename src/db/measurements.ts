import mysql, {RowDataPacket} from 'mysql2/promise';
import { endConnection, getConnectionPool } from './db-connection';
import { JoinedResponse, Measurement } from './db-types';
const SRID = 4326;

export const createOne = async (measurement: Measurement) => {
    const query = mysql.format(`
        
    `);
}

export const findById = async (id: number) => {
    const connection = await getConnectionPool();
    const query = mysql.format(`
        SELECT 
            'id', m.id,
            'measured_at', m.measured_at,
            JSON_OBJECT(
                'temperature', ROUND(sd.temperature, 2),
                'conductivity', ROUND(sd.conductivity, 2),
                'ph', ROUND(sd.ph, 2)
            ) AS data,
            JSON_OBJECT(
                'name', l.name,
                'latlng', JSON_OBJECT(
                    'lat', ST_Y(l.latlng),
                    'lng', ST_X(l.latlng)
                )
            ) AS location,
            JSON_OBJECT(
                'model_no', s.model_no
            ) AS sensor
        FROM measurements AS m
            JOIN sensors AS s ON m.sensor_id = s.sensor_id
            JOIN locations AS l ON m.location_id = l.location_id
            JOIN sensor_data AS sd ON m.data_id = sd.data_id
        WHERE
            m.id = ?
    `, [id]);

    const res = await connection.query(query);
    const rows = (res as RowDataPacket)[0];
    console.assert(rows.length === 1,
        `WARNING: measurements/findById() found more than one row with id: ${id}`);
    return rows[0];
}

export const findMany = async () => {
    const connection = await getConnectionPool();
    const query = mysql.format(`
        SELECT
            'id', m.id,
            'measured_at', m.measured_at,
            JSON_OBJECT(
                'temperature', ROUND(sd.temperature, 2),
                'conductivity', ROUND(sd.conductivity, 2),
                'ph', ROUND(sd.ph, 2)
            ) AS data,
            JSON_OBJECT(
                'name', l.name,
                'latlng', JSON_OBJECT(
                    'lat', ST_Y(l.latlng),
                    'lng', ST_X(l.latlng)
                )
            ) AS location,
            JSON_OBJECT(
                'model_no', s.model_no
            ) AS sensor
        FROM measurements AS m
             JOIN sensors AS s ON m.sensor_id = s.sensor_id
             JOIN locations AS l ON m.location_id = l.location_id
             JOIN sensor_data AS sd ON m.data_id = sd.data_id
        ORDER BY
            m.id;
    `);

    const res = await connection.query(query);
    return (res as RowDataPacket)[0];
}

export const findByLocationId = async (id: number) => {
    const connection = await getConnectionPool();
    const query = mysql.format(`
        SELECT 
            'id', m.id,
            'measured_at', m.measured_at,
            JSON_OBJECT(
                'temperature', ROUND(sd.temperature, 2),
                'conductivity', ROUND(sd.conductivity, 2),
                'ph', ROUND(sd.ph, 2)
            ) AS data,
            JSON_OBJECT(
                'name', l.name,
                'latlng', JSON_OBJECT(
                    'lat', ST_Y(l.latlng),
                    'lng', ST_X(l.latlng)
                )
            ) AS location,
            JSON_OBJECT(
                'model_no', s.model_no
            ) AS sensor
        FROM measurements AS m
            JOIN sensors AS s ON m.sensor_id = s.sensor_id
            JOIN locations AS l ON m.location_id = l.location_id
            JOIN sensor_data AS sd ON m.data_id = sd.data_id
        WHERE
            l.location_id = ?
        ORDER BY
            m.id;
    `, [id]);

    const res = await connection.query(query);
    return (res as RowDataPacket)[0];
}

export const findByLocationName = async (name: string, start_date: string, end_date: string) => {
    const connection = await getConnectionPool();
    const query = mysql.format(`
        SELECT 
            'id', m.id,
            'measured_at', m.measured_at,
            JSON_OBJECT(
                'temperature', ROUND(sd.temperature, 2),
                'conductivity', ROUND(sd.conductivity, 2),
                'ph', ROUND(sd.ph, 2)
            ) AS data,
            JSON_OBJECT(
                'name', l.name,
                'latlng', JSON_OBJECT(
                    'lat', ST_Y(l.latlng),
                    'lng', ST_X(l.latlng)
                )
            ) AS location,
            JSON_OBJECT(
                'model_no', s.model_no
            ) AS sensor
        FROM measurements AS m
            JOIN sensors AS s ON m.sensor_id = s.sensor_id
            JOIN locations AS l ON m.location_id = l.location_id
            JOIN sensor_data AS sd ON m.data_id = sd.data_id
        WHERE
            l.name = ?
            AND m.measured_at >= ? AND m.measured_at <= ?
        ORDER BY
            m.id;
    `, [name, start_date, end_date]);

    const res = await connection.query(query);
    return (res as RowDataPacket)[0];
}

export const findByGeolocation = async (lat: number, lng: number, rad: number, start_date: string, end_date: string) => {
    const connection = await getConnectionPool();
    const query = mysql.format(`
        SELECT 
            'id', m.id,
            'measured_at', m.measured_at,
            JSON_OBJECT(
                'temperature', ROUND(sd.temperature, 2),
                'conductivity', ROUND(sd.conductivity, 2),
                'ph', ROUND(sd.ph, 2)
            ) AS data,
            JSON_OBJECT(
                'name', l.name,
                'latlng', JSON_OBJECT(
                    'lat', ST_Y(l.latlng),
                    'lng', ST_X(l.latlng)
                )
            ) AS location,
            JSON_OBJECT(
                'model_no', s.model_no
            ) AS sensor
        FROM measurements AS m
            JOIN sensors AS s ON m.sensor_id = s.sensor_id
            JOIN locations AS l ON m.location_id = l.location_id
            JOIN sensor_data AS sd ON m.data_id = sd.data_id
        WHERE
            ST_Distance_Sphere(l.latlng, ST_GeomFromText('POINT(? ?)', ?, 'axis-order=lat-long')) <= ?
            AND m.measured_at >= ? AND m.measured_at <= ?
        ORDER BY
            m.id;
    `, [lat, lng, SRID, rad, start_date, end_date]);

    const res = await connection.query(query);
    return (res as RowDataPacket)[0];
}