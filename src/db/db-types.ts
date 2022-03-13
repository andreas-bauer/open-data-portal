export type Point = {
    x: number,
    y: number,
}

export type Location = {
    location_id: number,
    name?: string,
    latlng: Point,
    radius?: number,
};

export type Sensor = {
    sensor_id: number,
    model_no?: string,
    location_id?: number,
};

export type SensorData = {
    data_id: number,
    temperature?: number,
    conductivity?: number,
    ph?: number,
};

export type Measurement = {
    id: number,
    measured_at?: Date,
    sensor_id: number,
    location_id: number,
    data_id: number,
};

export type JoinedResponse = Measurement & Sensor & SensorData & Location;
