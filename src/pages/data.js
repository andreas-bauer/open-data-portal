import useSWR from 'swr';
import {useContext} from 'react';
import { PreferenceContext } from './_app';
import {loadPreferences} from '../lib/loadPreferences.ts';
import { DataGrid } from '@mui/x-data-grid'; //Documentation can be found here: https://mui.com/api/data-grid/data-grid/

const fetcher = (url) => fetch(url).then(res => res.json());
const endpointUrl = "http://localhost:3000/api/v1?";

function urlWithParams(url, params){
    //A function that adds the given parameters to the given URL, params can be a string or an object for example.
    return url + new URLSearchParams(params);
}

function getColumns(){
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            editable: false
        },
        {
            field: 'pH',
            headerName: 'pH',
            width: 90,
            editable: false
        },
        {
            field: 'temperature',
            headerName: 'Temperature()',
            width: 110,
            editable: false
        },
        {
            field: 'conductivity',
            headerName: 'Conductivity',
            width: 110,
            editable: false
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 200,
            editable: false
        },
        {
            field: 'longitude',
            headerName: 'Longitude',
            width: 170,
            editable: false
        },
        {
            field: 'latitude',
            headerName: 'Latitude',
            width: 170,
            editable: false
        }
    ];

    return columns;
}
export async function getServerSideProps(context){
    //Since useContext(PreferenceContext) cannot be used:
    const preferences = loadPreferences(context.req.cookies.preferences);
    
    const params = {
        tempunit: preferences.temperature_unit.symbol,
        conductunit: preferences.conductivity_unit.symbol
    };

    let url = urlWithParams(endpointUrl, params);
    const data = await fetcher(url);
    
    return{
        props: {
            initialData: data
        }
    }
}

export default function App(props){
    const initialData = props.initialData;
    const preferences = useContext(PreferenceContext);

    const params = {
        tempunit: preferences.temperature_unit.symbol,
        conductunit: preferences.conductivity_unit.symbol
    };

    let url = urlWithParams(endpointUrl, params);

    const options = {fetcher: () => fetcher(url),
                    fallbackData: initialData,
                    refreshInterval: 1000 * 60};
    const { data, error } = useSWR(url, options);

    if (error) return <div>failed to load</div>;
    //if (!data) return <div>loading...</div>;Is this needed since there is already data?
    
      return(
          <div style={{ height: 750, width: '50%' }}>
              <DataGrid
                rows= {data}
                columns= {getColumns()}
              />
          </div>
      );
}

