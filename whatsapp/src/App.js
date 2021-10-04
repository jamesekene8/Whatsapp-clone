import "./App.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { useEffect, useState, useContext } from "react";
import Pusher from "pusher-js";
import axios from "./axios";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import LoginContext from "./store/login-context";
import LoginProvider from "./store/LoginProvider";

function App() {
  const [messages, setMessages] = useState([]);
  const loginCtx = useContext(LoginContext);
  useEffect(() => {
    axios.get("/messages/sync").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher("716d59a119015ea907ee", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <Switch>
      <LoginProvider>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/chatroom">
          <div className="app">
            <div className="app__body">
              <Sidebar />
              <Chat messages={messages} />
            </div>
          </div>
        </Route>
      </LoginProvider>
    </Switch>
  );
}

export default App;
