import { NextApiRequest, NextApiResponse } from 'next';
import { findByLocationId } from 'src/db/measurements';
import {
    STATUS_OK,
    STATUS_METHOD_NOT_ALLOWED,
    STATUS_SERVER_ERROR
} from 'lib/httpStatusCodes';
import {z} from "zod";

const Params = z.object({
    id: z.preprocess(
        id => Number(z.string().parse(id)),
        z.number().positive()
    )
});

export default async (req: NextApiRequest, res: NextApiResponse ) => {
    if (req.method !== 'GET') {
        console.log('ERROR: Method not allowed.');
        res.status(STATUS_METHOD_NOT_ALLOWED)
            .json({ error: `Method ${req.method} is not allowed for this endpoint.` });
        return;
    }

    try {
        const id = Params.parse(req.query).id;
        const result = await findByLocationId(id);
        res.status(STATUS_OK).json(result);
    }
    catch (e) {
        /* unknown errors falls through here */
        console.log(e);
        res.status(STATUS_SERVER_ERROR)
            .json({ error: 'An unknown error occurred' });
    }
}