import { ZodError } from "zod";

const DECIMAL_COUNT = 3;
const FLOOR_FACTOR = Math.pow(10, DECIMAL_COUNT);

interface Unit {
    name: string;
    symbols: Array<string>;
    minValue: number;
    maxValue: number;
    toSiemensPerMeter: (v: number) => number;
    fromSiemensPerMeter: (v: number) => number;
}

export const UNITS : { [name: string]: Unit } = {
    SIEMENS_PER_METER: {
        name: "Siemens per meter",
        symbols: ["spm", "s/m"],
        minValue: 0,
        maxValue: 10,
        toSiemensPerMeter: v => v,
        fromSiemensPerMeter: v => v
    },
    MHO_PER_METER: {
        name: "Mho per meter",
        symbols: ["mhopm", "mho/m"],
        minValue: 0,
        maxValue: 10,
        toSiemensPerMeter: v => v,
        fromSiemensPerMeter: v => v
    },
    SIEMENS_PER_CENTIMETER: {
        name: "Siemens per centimeter",
        symbols: ["spcm", "s/cm"],
        minValue: 0,
        maxValue: 0.1,
        toSiemensPerMeter: v => Math.round((v * 100) * FLOOR_FACTOR) /FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v / 100) * FLOOR_FACTOR) /FLOOR_FACTOR,
    },
    MHO_PER_CENTIMETER: {
        name: "Mho per centimeter",
        symbols: ["mhopcm", "mho/cm"],
        minValue: 0,
        maxValue: 0.1,
        toSiemensPerMeter: v => Math.round((v * 100) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v / 100) * FLOOR_FACTOR) / FLOOR_FACTOR,
    },
    MILLISIEMENS_PER_METER: {
        name: "Millisiemens per meter",
        symbols: ["mspm", "ms/m"],
        minValue: 0,
        maxValue: 1E4,
        toSiemensPerMeter: v => Math.round((v / 1E3) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v * 1E3) * FLOOR_FACTOR) / FLOOR_FACTOR,
    },
    MILLISIEMENS_PER_CENTIMETER: {
        name: "Millisiemens per centimeter",
        symbols: ["mspcm", "ms/cm"],
        minValue: 0,
        maxValue: 100,
        toSiemensPerMeter: v => Math.round((v / 10) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v * 10) * FLOOR_FACTOR) / FLOOR_FACTOR,
    },
    MICROSIEMENS_PER_METER: {
        name: "Microsiemens per meter",
        symbols: ["uspm", "us/m"],
        minValue: 0,
        maxValue: 1E7,
        toSiemensPerMeter: v => Math.round((v / 1E6) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v * 1E6) * FLOOR_FACTOR) / FLOOR_FACTOR,
    },
    MICROSIEMENS_PER_CENTIMETER: {
        name: "Microsiemens per centimeter",
        symbols: ["uspcm", "us/cm"],
        minValue: 0,
        maxValue: 1E5,
        toSiemensPerMeter: v => Math.round((v / 1E4) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v * 1E4) * FLOOR_FACTOR) / FLOOR_FACTOR,
    },
    PARTS_PER_MILLION: {
        name: "Parts per million",
        symbols: ["ppm", "p/m"],
        minValue: 0,
        maxValue: 64000,
        toSiemensPerMeter: v => Math.round((v / 1E4 * 1.5625) * FLOOR_FACTOR) / FLOOR_FACTOR,
        fromSiemensPerMeter: v => Math.round((v * 1E4 / 1.5625) * FLOOR_FACTOR) / FLOOR_FACTOR,
    }
};

export class Conductivity {
    value: number;
    unit: Unit;

    constructor(value: number, unit: Unit = UNITS.SIEMENS_PER_METER) {
        this.value = value;
        this.unit = unit;
    }

    asSiemensPerMeter = () => this.unit.toSiemensPerMeter(this.value);
}

export const parseConductivity = (value: number, unit: string = 'spm') : Conductivity => {
    let conductivity : Conductivity | undefined = undefined;
    Object.values(UNITS).forEach(u => {
        if (u.symbols.includes(unit.toLowerCase())) {
            if (value < u.minValue)
                throw new ZodError([{
                    code: 'too_small',
                    path: [ 'conductivity' ],
                    type: 'number',
                    minimum: u.minValue,
                    inclusive: true,
                    message: `Value should be greater than or equal to ${u.minValue} ${u.name}.`
                }]);
            if (value > u.maxValue)
                throw new ZodError([{
                    code: 'too_big',
                    path: [ 'conductivity' ],
                    type: 'number',
                    maximum: u.maxValue,
                    inclusive: true,
                    message: `Value should be less than or equal to ${u.maxValue} ${u.name}.`
                }]);

            conductivity = new Conductivity(value, u);
        }
    });

    if (!conductivity) {
        let options : Array<string> = [];
        Object.values(UNITS).forEach(u => {
            options = options.concat(u.symbols);
        });
        throw new ZodError([{
            code: "invalid_enum_value",
            options,
            path: [ 'conductivity_unit' ],
            message: `Unexpected unit ${unit.toLowerCase()}. Expected${options.map(o => ' ' + o)}.`
        }]);
    }

    return conductivity;
}
