import LoginContext from "./login-context";
import React from "react";

const loginValue = { loggedIn: null, userDetails: { name: "" } };

const LoginProvider = (props) => {
  return (
    <LoginContext.Provider value={loginValue}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
