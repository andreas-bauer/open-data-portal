import { NextApiRequest, NextApiResponse } from 'next';
import { findMany } from 'src/db/measurements';
import {
    STATUS_OK,
    STATUS_BAD_REQUEST, STATUS_METHOD_NOT_ALLOWED,
    STATUS_SERVER_ERROR
} from 'lib/httpStatusCodes';

export default async (req: NextApiRequest, res: NextApiResponse ) => {
    if (req.method === 'GET') {
        try {
            const result = await findMany();
            res.status(STATUS_OK).json(result);
        } catch (e) {
            /* unknown errors falls through here */
            console.log(e);
            res.status(STATUS_SERVER_ERROR)
                .json({error: 'An unknown error occurred'});
        }
        return;
    }

    if (req.method === 'POST') {
        // createOne();
        return;
    }

    console.log('ERROR: Method not allowed.');
    res.status(STATUS_METHOD_NOT_ALLOWED)
        .json({ error: `Method ${req.method} is not allowed for this endpoint.` });
}