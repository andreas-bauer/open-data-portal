export default function(value, fromUnit) {
    // Converts the provided temperature measurement from the given unit to Kelvin
    // Returns the temperature value in Kelvin if successful, else -1
    value = Number(value);
    if (isNaN(value))
        throw new Error(`ERROR: Provided temperature value '${value}' could not be parsed as a number.`);

    let ret;
    switch (fromUnit) {
        case 'K':
        case 'k':
            ret = value;
            break;
        case 'C':
        case 'c':
            ret = value + 273.15;
            break;
        case 'F':
        case 'f':
            ret = (value + 459.67) * 5/9;
            break;
        default:
            throw new Error(`ERROR: Provided temperature unit '${fromUnit}' is not supported. Read the documentation for valid parameters.`);
    }

    if (ret < 0)
        throw new Error(`ERROR: Provided temperature value '${value}' is below absolute zero.`);

    return ret;
}