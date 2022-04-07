import { getConnectionPool } from "./connection";
import { RowDataPacket, OkPacket } from 'mysql2/promise';

export type Sensor = {
  id: number,
  name: string,
  firmware: string,
  type: string
}

export const createOne = async (
  { name, firmware, type }: { name?: string, firmware?: string, type: string },
) => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      INSERT INTO sensor (name, firmware, type)
      VALUES (?, ?, ?)
  `, [name, firmware, type]);
  return (<OkPacket>result).insertId;
};

export const findById = async (
  { id }: { id: number }
) => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      SELECT id, name, firmware, type
      FROM sensor
      WHERE id = ?
  `, [id]);
  return (<RowDataPacket>result)[0] as Sensor;
};

export const findByType = async (
  { type }: { type: string }
) => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      SELECT id, name, firmware, type
      FROM sensor
      WHERE type = ?
  `, [type]);
  return <RowDataPacket[]>result as Array<Sensor>;
};

export const findAll = async () => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      SELECT id, name, firmware, type
      FROM sensor
  `);
  return <RowDataPacket[]>result as Array<Sensor>;
};

export const updateFirmware = async (
  { id, firmware }: { id: number, firmware: string }
) => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      UPDATE sensor
      SET firmware = ?
      WHERE id = ?
  `, [firmware, id]);
  return (<OkPacket>result).changedRows;
};


export const findAllTypes = async () => {
  const connection = await getConnectionPool();
  const [result] = await connection.execute(`
      SELECT DISTINCT type
      FROM sensor
  `);
  return (<RowDataPacket[]>result).map(row => row.type) as Array<string>;
};