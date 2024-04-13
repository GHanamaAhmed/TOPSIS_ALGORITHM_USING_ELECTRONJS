import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dataContext } from "../context/dataContext";
import { performTOPSIS } from "../topsisAlgorithme";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const data: string[] = ["model", "price", "comfort", "seats", "color"];
export default function Parameters() {
  const [input, setInput] = useState("");
  const [critaria, setCrtaria] = useContext(dataContext);
  const [rows, setRows] = useState<any>();
  const [larg, setLarge] = React.useState<any>();
  const [desireColor, setDesireColor] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  useEffect(() => {
    const l = JSON.parse(localStorage.getItem("rows") as string);
    setRows(l);
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const calculateTopsis = () => {
    const evaluteMatrix = rows.map((e: any) => {
      let newE = { ...e };
      delete newE.id;
      delete newE.name;
      delete newE.model;
      newE = Object.values(newE).filter((num: any) => !isNaN(num));
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
  return (
    <div className="py-5 w-full h-screen flex flex-col gap-5 items-center justify-center">
      {critaria?.map((elm, i) => (
        <TextField
          key={i}
          type="number"
          onChange={(e) => {
            setCrtaria((prev) =>
              prev.map((el) => {
                if (el.name == elm.name) {
                  return {
                    ...elm,
                    weight: Number(e.currentTarget?.value),
                  };
                }
                return el;
              })
            );
          }}
          required
          id="outlined-required"
          label={elm.name}
          defaultValue={0}
        />
      ))}
      <FormControl className="w-1/2">
        <InputLabel id="demo-simple-select-label">Desire Color</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Desire Color"
          onChange={(e) => setDesireColor(e.target.value as string)}
        >
          <MenuItem value={"Red"}>Red</MenuItem>
          <MenuItem value={"Blue"}>Blue</MenuItem>
          <MenuItem value={"Gray"}>Gray</MenuItem>
        </Select>
      </FormControl>

      <div className="flex gap-5">
        <Button onClick={calculateTopsis} variant="contained">
          Calcul
        </Button>
        <Link to={"/topsis"}>Edit</Link>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Decision
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            the best car for you is : {larg}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
