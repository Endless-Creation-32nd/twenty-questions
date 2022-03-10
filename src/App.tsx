import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import Ready from "./components/Ready";
import { User } from "./types";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [gameDuration, setGameDuration] = useState(180);

  const appendUser = (name: string) => {
    setUsers(
      users.concat({
        id: Math.random(),
        name,
      })
    );
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const onChangeGameDuration = (gameDuration: number) => {
    setGameDuration(gameDuration);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Ready
            users={users}
            appendUser={appendUser}
            gameDuration={gameDuration}
            onChangeGameDuration={onChangeGameDuration}
            deleteUser={deleteUser}
          />
        }
      ></Route>
      <Route path="/game" element={<Game users={users} gameDuration={gameDuration} />}></Route>
    </Routes>
  );
}

export default App;
