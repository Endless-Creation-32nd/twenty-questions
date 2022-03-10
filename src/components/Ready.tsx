/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Alert, Box, Button, Chip, InputAdornment, Snackbar, TextField } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { User } from "../types";

type ReadyProps = {
  users: Array<User>;
  gameDuration: number;
  appendUser: (name: string) => void;
  deleteUser: (id: number) => void;
  onChangeGameDuration: (duration: number) => void;
};

const Ready: React.FunctionComponent<ReadyProps> = ({
  users,
  gameDuration,
  appendUser,
  deleteUser,
  onChangeGameDuration,
}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onGameStart = () => {
    if (users.length === 0) {
      setError(true);
    } else {
      navigate("/game");
    }
  };

  return (
    <Wrapper>
      <Logo className="logo" />
      <Input
        value={input}
        size="small"
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        placeholder="참가자를 입력하세요"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            appendUser(input);
            setInput("");
          }
        }}
      />
      <UserList>
        {users.map((user) => (
          <UserChip label={user.name} onDelete={() => deleteUser(user.id)} />
        ))}
      </UserList>
      <DurationInput
        size="small"
        type="number"
        value={gameDuration}
        onChange={(e) => onChangeGameDuration(parseInt(e.target.value))}
        InputProps={{
          startAdornment: <InputAdornment position="start">게임시간</InputAdornment>,
          endAdornment: <InputAdornment position="end">초</InputAdornment>,
        }}
      ></DurationInput>
      <StartButton variant="contained" onClick={onGameStart}>
        시작하기
      </StartButton>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={error}
        autoHideDuration={3000}
        onClose={() => {
          setError(false);
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }} onClose={() => setError(false)}>
          참가자는 한 명 이상이어야 합니다!
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default Ready;

const Wrapper = styled(Box)(css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    width: 10rem;
    height: 10rem;
  }
`);

const Input = styled(TextField)(css`
  width: 20rem;
`);

const UserList = styled(Box)(css`
  width: 20rem;
  display: flex;
  flex-direction: column;
`);

const UserChip = styled(Chip)(css`
  display: flex;
  border-radius: 5px;
  justify-content: space-between;
  padding: 0 1rem;
  margin-top: 0.5rem;
`);

const StartButton = styled(Button)(css`
  margin-top: 2rem;
  width: 20rem;
  background: #73c05d;
  :hover {
    background-color: #319647;
  }
`);

const DurationInput = styled(TextField)(css`
  width: 20rem;
  margin-top: 4rem;
`);
