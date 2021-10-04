import React, { useContext, useRef } from "react";
import "./Login.css";
import LoginContext from "./store/login-context";
import { useHistory } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const nameInputRef = useRef();
  const loginCtx = useContext(LoginContext);

  const submitHandler = (e) => {
    const enteredName = nameInputRef.current.value;
    loginCtx.loggedIn = true;
    loginCtx.userDetails.name = enteredName;
    history.replace("/chatroom");
  };

  console.log(loginCtx.loggedIn);

  return (
    <div className="login">
      <h1>Welcome to WECHAT</h1>
      <input type="text" ref={nameInputRef} placeholder="Enter your name" />
      <button onClick={submitHandler}>Login</button>
    </div>
  );
};

export default Login;
