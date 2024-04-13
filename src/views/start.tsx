import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Start() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-5">
      <h1 className="font-customFont text-9xl">TOPSIS</h1>
      <Link to={"/parameters"}>
        <Button variant="contained">NEXT</Button>
      </Link>
    </div>
  );
}
