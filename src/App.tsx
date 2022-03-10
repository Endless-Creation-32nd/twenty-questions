import React from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import Ready from "./components/Ready";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Ready />}></Route>
      <Route path="/game" element={<Game />}></Route>
    </Routes>
  );
}

export default App;
