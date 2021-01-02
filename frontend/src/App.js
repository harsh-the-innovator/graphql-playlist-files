import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import "./app.css";
import AuthContext from "./context/auth-context";

function checkExpiration() {
  const AuthData = localStorage.getItem("AuthData");

  // if the item doesn't exist, return null
  if (!AuthData) return null;

  const item = JSON.parse(AuthData);
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    console.log("cleared...");
    localStorage.clear();
    return true;
  }
  return false;
}

function setExpiration(token, userId, tokenExpiration) {
  const now = new Date();

  const item = {
    token: token,
    userId: userId,
    expiry: now.getTime() + tokenExpiration,
  };
  localStorage.setItem("AuthData", JSON.stringify(item));
}

function App() {
  const authData = JSON.parse(localStorage.getItem("AuthData"));
  const [token, setToken] = useState(() => {
    if (!authData) return null;
    const token = authData.token;
    if (token !== null && token.length > 0) return token;
    else return null;
  });
  const [userId, setUserId] = useState(() => {
    if (!authData) return null;
    const userId = authData.userId;
    console.log(userId);
    if (userId !== null && userId.length > 0) return userId;
    else return null;
  });
  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    setExpiration(token, userId, tokenExpiration);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.clear();
  };

  useEffect(() => {
    console.log("checking...");
    if (checkExpiration() === true) {
      console.log("in 1st");
      setToken(null);
      setUserId(null);
    }
    setInterval(function () {
      console.log("ccc...");
      if (checkExpiration() === true) {
        console.log("in set");
        setToken(null);
        setUserId(null);
      }
    }, 15000);
  }, []);

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{ token: token, userId: userId, login: login, logout: logout }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && <Redirect from="/auth" to="/events" exact />}
              {!token && <Route path="/auth" component={AuthPage} exact />}
              <Route path="/events" component={EventPage} exact />
              {token && (
                <Route path="/bookings" component={BookingPage} exact />
              )}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
