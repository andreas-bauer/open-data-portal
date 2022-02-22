// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//This file will be responsible for querying only the the temperature and the date columns.
import mysql from "mysql2/promise"
import moment from "moment"

const STATUS_OK = 200
const STATUS_BAD_REQUEST = 400
const STATUS_METHOD_NOT_ALLOWED = 405
const STATUS_SERVER_ERROR = 500

export default async function handler(req, res){
  
  // Only allow GET-requests for this endpoint. I do not know how to test this
  if (req.method !== "GET") {
    console.log(`Error: Method ${req.method} not allowed.`)
    res.status(STATUS_METHOD_NOT_ALLOWED)        // 405: method not allowed
        .json({ error:
            `Method ${req.method} is not allowed for this endpoint. Please read the documentation on how to query the endpoint.`
    });
    return;
}

  try{

    const startDate = moment(req.query.startDate, 'YYYY-MM-DD', true);
    const endDate = moment(req.query.endDate, 'YYYY-MM-DD', true);

    if(startDate.isValid() !== true || endDate.isValid() !== true){
      res.status(STATUS_BAD_REQUEST).json({error: "Invalid parameters. Please, read the documentation for valid parameters"})
      return;
    }
    if(startDate.isAfter(endDate)){
      res.status(STATUS_BAD_REQUEST).json({error: "Start date can't be after End date!"})
      return;
    }
    //Connecting to the database
    const connection = await mysql.createConnection({
      host     : process.env.NEXT_PUBLIC_DB_HOST,
      user     : process.env.NEXT_PUBLIC_DB_USER,
      password : process.env.NEXT_PUBLIC_DB_PASSWORD,
      database : process.env.NEXT_PUBLIC_DB_DATABASE,
      //ssl      : {"rejectUnauthorized":true},
      timezone : "+00:00"
    });

    await connection.connect();
    
    //Specifying mySQL query
    const query = "SELECT * FROM Data WHERE date(date) >= \"" + startDate.format("YYYY-MM-DD") + 
      "\" AND date(date) <= \"" + endDate.format("YYYY-MM-DD") + "\" ORDER BY date;";
    
      console.log(query);

    //Executing the query
    const [data] = await connection.execute(query);
    
    //Disconnecting from the database
    await connection.end();
    
    
    res.status(STATUS_OK).json(data);
  }
  catch(e) {
    console.error(e);
    res.status(STATUS_SERVER_ERROR).json({ error: "Error fetching data from the database" });
  }
}