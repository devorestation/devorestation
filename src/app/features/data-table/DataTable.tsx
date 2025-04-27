import { useAppDispatch } from "@/lib/hooks";
import { setData } from "@/lib/reforestation.slice";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMemo } from "react";

export default function DataTable(props) {
  const { data } = props;
  const dispatch = useAppDispatch();

  const columns: GridColDef[] = Object.keys(data).map((e) => {
    return {
      field: e,
      headerName: e,
      type: "number",
      editable: true,
      align: "left",
      headerAlign: "left",
    };
  });

  const rows: GridRowsProp = useMemo(() => {
    return [
      {
        id: 1,
        ...data,
      },
    ];
  }, [data]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={(updatedRow) => {
          console.log(updatedRow);
          dispatch(setData(updatedRow));
          return updatedRow;
        }}
      />
    </div>
  );
}
