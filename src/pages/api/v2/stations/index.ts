import { NextApiRequest, NextApiResponse } from 'next';

import * as Station from "src/lib/database/station";
import * as Sensor from "src/lib/database/sensor";
import * as Location from "src/lib/database/location";
import { HTTP_STATUS as STATUS } from "src/lib/httpStatusCodes";
import { ZodError } from "zod";
import { zCreateStation } from 'src/lib/types/ZodSchemas';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      /* parse parameters */

      const stations = await Station.findById({
        id: 2,
        expandSensors: true,
      });

      console.log(stations);

      /* Returning the locations with STATUS.OK response code */
      res.status(STATUS.OK).json(stations);
    }

    catch (e) {
      if (e instanceof ZodError) {
        console.log("Error parsing query params:\n", e.flatten());
        res.status(STATUS.BAD_REQUEST)
          .json(e.flatten());
      }
      else {
        console.error(e);
        res.status(STATUS.SERVER_ERROR).json({ error: "Internal server error" });
      }
    }
  }

  else if (req.method === "POST") {
    try {
      /* parse request body */
      const { sensor_ids: sensorIds, location_name: locationName } = zCreateStation.parse(req.body);

      /* */
      for (const sensorId of sensorIds) {
        const sensor = await Sensor.findById({ id: sensorId });
        if (!sensor) {
          res.status(STATUS.BAD_REQUEST)
            .json({ error: `Sensor with id ${sensorId} not found` });
          return;
        }

        const location = await Location.findByName({ name: locationName });
        if (!location) {
          res.status(STATUS.BAD_REQUEST)
            .json({ error: `Location with name ${locationName} not found` });
          return;
        }

        await Station.createOne({ sensorId, locationName });
      }

      /* Returning the location with STATUS.CREATED response code */
      res.status(STATUS.CREATED).json({ sensorIds, locationName });
    }

    catch (e) {
      if (e instanceof ZodError) {
        console.log("Error parsing request body:\n", e.flatten());
        res.status(STATUS.BAD_REQUEST)
          .json(e.flatten());
      }
      else {
        console.error(e);
        res.status(STATUS.SERVER_ERROR).json({ error: "Internal server error" });
      }
    }
  }
};

export default handler;
