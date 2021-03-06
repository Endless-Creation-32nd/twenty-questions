/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { Alert, Avatar, Button, Grid, LinearProgress, Snackbar, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { User } from "../types";
import { useNavigate } from "react-router";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

type GameProps = {
  users: User[];
  gameDuration: number;
};

const Game: React.FunctionComponent<GameProps> = ({ users, gameDuration }) => {
  const [progress, setProgress] = useState<number>(100);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<Array<{ content: string; isCorrect: number }>>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const questionListRef = useRef<any>(null);

  const onCreateQuestion = (isCorrect: number) => {
    if (input === "") {
      setOpen(true);
      if (inputRef.current !== null) inputRef.current.focus();
      return;
    }
    setQuestions(questions.concat({ content: input, isCorrect }));
    setInput("");
    setCurrentUserIndex((currentUserIndex + 1) % users.length);
    if (inputRef.current !== null) inputRef.current.focus();
    console.log(inputRef.current);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (users.length === 0) {
      navigate("/");
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress <= 0) {
          return 0;
        }
        const diff = 10 / gameDuration;
        return Math.max(oldProgress - diff, 0);
      });
    }, 100);

    if (questions.length === 20 || progress === 0) {
      clearInterval(timer);
      setOpen(true);
    }

    return () => {
      clearInterval(timer);
    };
  }, [questions, progress]);

  useEffect(() => {
    questionListRef.current.scrollIntoView({ behavior: "smooth" });
  }, [questions]);

  return (
    <Wrapper progress={progress}>
      <AccessAlarmIcon className="logo" />
      {Math.floor((progress / 100) * gameDuration)}???
      <Box sx={{ width: "100%" }}>
        <Line variant="determinate" value={progress} progress={progress} />
      </Box>
      <UserList>
        {users.map((user, index) => (
          <UsetIcon focus={currentUserIndex === index}>{user.name[0]}</UsetIcon>
        ))}
      </UserList>
      <Grid container sx={{ flex: 1 }}>
        <Grid item container md={6} xs={12} sx={{ flexDirection: "column", justifyContent: "center" }}>
          {users.length !== 0 && (
            <Layout>
              {questions.length === 20 ? (
                <p className="alert">
                  <span>????????? ?????? ??????????????????!</span>
                </p>
              ) : progress === 0 ? (
                <p className="alert">
                  <span>????????? ?????? ???????????????!</span>
                </p>
              ) : (
                <>
                  <p className="title">
                    <span>{users[currentUserIndex].name}</span>??? ??????????????????!
                  </p>
                  <p className="title">
                    ?????????<span>{20 - questions.length}</span>??? ???????????????!
                  </p>
                </>
              )}
            </Layout>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <QuestionWrapper>
            <QuestionList>
              {questions.map((item) => (
                <Question isCorrect={item.isCorrect}>
                  {item.isCorrect === 0 ? (
                    <CheckIcon className="icon" />
                  ) : item.isCorrect === 1 ? (
                    <ClearIcon className="icon" />
                  ) : (
                    <QuestionMarkIcon className="icon" />
                  )}
                  {item.content}
                </Question>
              ))}
              <div ref={questionListRef}></div>
            </QuestionList>
            {!(questions.length === 20 || progress === 0) && (
              <InputWrapper>
                <TextField
                  inputRef={inputRef}
                  autoFocus
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="input"
                />
                <Button className="yes" onClick={() => onCreateQuestion(0)}>
                  ???
                </Button>
                <Button className="no" onClick={() => onCreateQuestion(1)}>
                  ?????????
                </Button>
                <Button className="draw" onClick={() => onCreateQuestion(2)}>
                  ???????????????
                </Button>
              </InputWrapper>
            )}
          </QuestionWrapper>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }} onClose={() => setOpen(false)}>
          {questions.length === 20 || progress === 0 ? "????????? ?????????????????????!" : "????????? ?????? ??????????????????!"}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default Game;

const Wrapper = styled<any>(Box)(
  ({ progress }) => css`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
      width: 2rem;
      height: 2rem;
      margin: 0.2rem 0;
      animation: ${progress < 50 && move}
        ${progress === 0 ? "0s" : progress < 10 ? "0.5s" : progress < 50 ? "1s" : "0s"} ease infinite;
    }
  `
);

const move = keyframes`
  0% {
    transform: rotate(0turn);
  }

  20% {
    transform: rotate(-0.1turn);
  }

  40% {
    transform: rotate(0.12turn);
  }

  60% {
    transform: rotate(-0.08turn);
  }

  80% {
    transform: rotate(0turn);
  }
`;

const Line = styled<any>(LinearProgress)(
  ({ progress }) => css`
    background-color: ${progress < 10 ? "#f9d0d0" : progress < 50 ? "#fff6d7" : "rgb(167, 202, 237)"};
    .MuiLinearProgress-bar {
      background-color: ${progress < 10 ? "#f95858" : progress < 50 ? "#f8db7b" : "#1976d2"};
    }
  `
);

const UserList = styled(Box)(css`
  margin: 1rem 0;
  display: flex;
  .MuiAvatar-root + .MuiAvatar-root {
    margin-left: 0.5rem;
  }
`);

const UsetIcon = styled<any>(Avatar)(
  ({ focus }) => css`
    background-color: ${focus ? "#9cabcb" : "#c7c7c7"};
  `
);

const Layout = styled(Box)(css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 900px) {
    .title {
      margin: 1rem;
    }
  }

  .title {
    font-size: 2rem;
    span {
      color: #4965a3;
    }
  }

  .alert {
    font-size: 2rem;
    span {
      color: #cc7777;
    }
  }
`);

const QuestionWrapper = styled(Box)(css`
  height: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  padding: 1rem;
`);

const QuestionList = styled(Box)(css`
  height: calc(100vh - 15.5rem);
  display: flex;
  flex-direction: column;
  overflow: auto;

  @media screen and (max-width: 900px) {
    height: calc(100vh - 30rem);
  }
`);

const Question = styled<any>(Box)(
  ({ isCorrect }) => css`
    display: flex;
    padding: 0.5rem;
    align-items: center;
    height: 1.2rem;
    border-radius: 5px;
    font-size: 1.2rem;
    background-color: ${isCorrect === 0 ? "#9ccba5" : isCorrect === 1 ? "#cc7777" : "#8f8f8f"};
    margin-bottom: 0.5rem;

    .icon {
      margin-right: 0.2rem;
    }
  `
);

const InputWrapper = styled(Box)(css`
  display: flex;
  z-index: 1000;
  background-color: white;
  position: sticky;
  bottom: 0;
  align-items: center;
  height: 2.5rem;
  padding: 1rem;
  .input {
    flex: 1;
    margin-right: 1rem;
  }

  .yes {
    width: 6rem;
    color: #36a049;
    :hover {
      background-color: #9ccba5;
      color: white;
    }
  }

  .draw {
    width: 6rem;
    color: #8f8f8f;
    :hover {
      background-color: #666565;
      color: white;
    }
  }

  .no {
    width: 6rem;
    color: #ca6060;
    :hover {
      background-color: #cc7777;
      color: white;
    }
  }
`);
