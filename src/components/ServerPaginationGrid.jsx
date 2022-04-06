import { useContext, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import DateRangeSelector from "src/components/DateRangeSelector";
import { useMeasurements } from "../lib/hooks/swr-extensions";
import { PreferenceContext } from "../pages/_app";
import {fetcher, urlWithParams} from "../lib/utilityFunctions";

const endpoint = "http://localhost:3000/api/v2/data?";

const ServerPaginationGrid = () => {
  /* Define pagination options, which can be modified in the grid */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  /* Define Start-date and End-date, which can be modified in the grid.*/
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  //let idk = new Date('2022-01-01');
  //let idk2 = new Date('2022-01-08');

  /* Get correct url for fetching the filtered data */
  const { preferences } = useContext(PreferenceContext);
  const url = useMemo(() => urlWithParams(endpoint, {
    temperature_unit: preferences.temperature_unit.symbol,
    conductivity_unit: preferences.conductivity_unit.symbol,
    location_name: preferences.location.symbol,
    page: page + 1, /* mui grid starts indexing at 0, api at 1 */
    page_size: pageSize,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
  }), [preferences, page, pageSize, startDate, endDate]);
  
  const { measurements, rowCount, isLoading } = useMeasurements(url, fetcher);

  const gridColumns = useMemo(() => [
    { field: "id", headerName: "ID", width: 70},
    { field: "ph", headerName: "pH", width: 90},
    {
      field: "temperature",
      headerName: `Temperature (${preferences.temperature_unit.symbol})`,
      width: 150,
    },
    {
      field: "conductivity",
      headerName: `Conductivity (${preferences.conductivity_unit.symbol})`,
      width: 150
    },
    {
      field: "date", width: 200,
      headerName: `Date (${Intl.DateTimeFormat().resolvedOptions().locale})`,
      valueGetter: date => new Date(date.value).toLocaleString(),
    },
    { field: "longitude", headerName: "Longitude", width: 150},
    { field: "latitude", headerName: "Latitude", width: 150},
  ], [preferences]);

  return (
    <div style={{ height: 750, width: "95%", maxWidth: 1000 }}>
      {startDate.toISOString().split('T')[0]}
      <br></br>
      {endDate.toISOString().split('T')[0]}<br></br>
      {url}
      <DataGrid
        rows={measurements}
        columns={gridColumns}
        rowCount={rowCount}
        loading={isLoading}
        components={{ LoadingOverlay: LinearProgress }}
        pagination
        paginationMode={"server"}
        page={page}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        onPageChange={page => setPage(page)}
        onPageSizeChange={pageSize => setPageSize(pageSize)}
      />

      <DateRangeSelector
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
      />
    </div>
  );
};

export default ServerPaginationGrid;
