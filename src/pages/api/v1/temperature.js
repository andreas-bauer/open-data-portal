// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//This file will be responsible for querying only the the temperature and the date columns.
import mysql from "mysql2/promise"

export default async function handler(req, res){
  
  try{

    //Connecting to the database
    const connection = await mysql.createConnection({
      host     : process.env.NEXT_PUBLIC_DB_HOST,
      user     : process.env.NEXT_PUBLIC_DB_USER,
      password : process.env.NEXT_PUBLIC_DB_PASSWORD,
      database : process.env.NEXT_PUBLIC_DB_DATABASE,
      ssl      : {"rejectUnauthorized":true},
      timezone : "+00:00"
    });

    await connection.connect();
    
    //Specifying mySQL query
    const query = "SELECT temperature, date FROM Data WHERE temperature IS NOT NULL;";

    //Executing the query
    const [data] = await connection.execute(query);
    
    //Disconnecting from the database
    connection.destroy();

    let unit = req.query.unit;
    if(!unit){
      unit = 'K'
    }

    console.log(data);
    
    res.status(200).json({ content: data});
  }
  catch(e) {
    console.error(e);
    res.status(500).json({ error: "Error fetching data from the database" });
  }
}


  