import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
// @ts-ignore
import { performTOPSIS } from "../topsisAlgorithme";
import { Criteria, dataContext } from "../context/dataContext";
import { Modal, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const roles = ["Market", "Finance", "Development"];
const initialRows: GridRowsProp = [
  {
    id: 1,
    name: "",
    price: 0,
    comfort: 0,
    seats: 0,
    // color: 5,
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "model" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [larg, setLarge] = React.useState<any>();
  const [open, setOpen] = React.useState<boolean>(false);
  // const [columns,setColumns]=React.useState<GridColDef[]>()
  const [critaria] = React.useContext(dataContext);
  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: "model", headerName: "model", width: 180, editable: true },

    {
      field: "price",
      headerName: "price",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "comfort",
      headerName: "comfort",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "seats",
      headerName: "seats",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "speed",
      headerName: "speed",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "color",
      headerName: "color",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        "RED",
        "BLUE",
        "YELLOW",
        "GREEN",
        "ORANGE",
        "PURPLE",
        "CYAN",
        "MAGENTA",
        "BROWN",
        "PINK",
        "WHITE",
        "BLACK",
      ],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  React.useEffect(() => {
    console.log(rows);
  }, [rows]);
  const calculateTopsis = () => {
    const evaluteMatrix = rows.map((e) => {
      let newE = { ...e };
      delete newE.id;
      delete newE.name;
      delete newE.model;
      newE = Object.values(newE).filter((num) => !isNaN(num));
      return newE;
    });
    const weights = critaria?.map((e) => e.weight);
    console.log(evaluteMatrix, weights);

    const topsis = new performTOPSIS(evaluteMatrix, weights, [
      true,
      true,
      true,
      false,
    ]);
    topsis.calc();
    console.log(topsis);
    let indexBest = topsis?.bestDistance.findIndex(
      (e: number) => e == Math.min(...topsis?.bestDistance)
    );
    setLarge(rows[indexBest]?.model);
    setOpen(true);
  };
  const save = () => {
    localStorage.setItem("rows", JSON.stringify(rows));
    alert("saved successfully")
  };
  React.useEffect(() => {
    const l = JSON.parse(localStorage.getItem("rows") as string);
    l && setRows(l);
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {" "}
      <Box
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Box>
      <div className="flex gap-3 w-full justify-center">
        <Button onClick={save} variant="contained" className="py-2">
          Save
        </Button>
        <Link to={"/parameters"}>
          <Button variant="contained" className="py-2">
            back
          </Button>
        </Link>
      </div>
    </div>
  );
}
