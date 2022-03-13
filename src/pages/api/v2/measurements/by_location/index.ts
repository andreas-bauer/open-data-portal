import { NextApiRequest, NextApiResponse } from 'next';
import { findByLocationName, findByGeolocation } from 'src/db/measurements';
import {
    STATUS_OK,
    STATUS_METHOD_NOT_ALLOWED,
    STATUS_SERVER_ERROR, STATUS_BAD_REQUEST
} from 'lib/httpStatusCodes';
import {JoinedResponse} from "src/db/db-types";
import {z, ZodError} from "zod";

const GeoParams = z.object({
    lat: z.preprocess(
        lat => Number(z.string().parse(lat)),
        z.number().gte(-90).lte(90)
    ),
    lng: z.preprocess(
        lng => Number(z.string().parse(lng)),
        z.number().gte(-180).lte(180)
    ),
    rad: z.preprocess(
        rad => Number(z.string().default("200").parse(rad)),
        z.number().positive()
    )
});

const TimeParams = z.object({
    start_date: z.string().default('2022Z' /* new year 2022 */)
        .refine(str => new Date(str).getTime() > 0, 'Unable to parse string as Date')
        .refine(str => new Date(str) >= new Date('2022Z'), 'must be after 2022')
        .transform(str => new Date(str).toISOString()),
    end_date: z.string().default(new Date().toISOString() /* current time */)
        .refine(str => new Date(str).getTime() > 0, 'Unable to parse string as Date')
        .refine(str => new Date(str) <= new Date(), "can't be in the future")
        .transform(str => new Date(str).toISOString()),
}).refine(({start_date, end_date}) => end_date >= start_date, 'end_date must be before start_date');

export default async (req: NextApiRequest, res: NextApiResponse ) => {
    if (req.method !== 'GET') {
        console.log('ERROR: Method not allowed.');
        res.status(STATUS_METHOD_NOT_ALLOWED)
            .json({ error: `Method ${req.method} is not allowed for this endpoint.` });
        return;
    }

    try {
        const {start_date, end_date} = TimeParams.parse(req.query);
        if (req.query.name) {
            const names = <string> req.query.name;
            let result: JoinedResponse[] = [];
            for (const name of names.split(',')) {
                const rows: JoinedResponse[] = await findByLocationName(name, start_date, end_date);
                result.push(...rows);
            }
            result.sort((a, b) => a.id - b.id);
            res.status(STATUS_OK).json(result);
            return;
        }

        const { lat, lng, rad } = GeoParams.parse(req.query);
        console.log(lat, lng, rad)
        const result = await findByGeolocation(lat, lng, rad, start_date, end_date);
        res.status(STATUS_OK).json(result);
        return;
    }
    catch (e) {
        if (e instanceof ZodError) {
            console.log("Error parsing query params:\n", e.flatten())
            res.status(STATUS_BAD_REQUEST).json(e.flatten());
            return;
        }
        /* unknown errors falls through here */
        console.log(e);
        res.status(STATUS_SERVER_ERROR)
            .json({ error: 'An unknown error occurred' });
    }
}