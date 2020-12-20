import React, { useRef, useState, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passwordRef = useRef();
  const authContext = useContext(AuthContext);

  const switchModeHandler = () => {
    setIsLogin((prevState) => {
      console.log(prevState);
      return !prevState;
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) return;

    console.log(email, password);

    let requestBody = {
      query: `
        query {
          login(email: "${email}",password:"${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}",password:"${password}"}) {
              _id
              email
            }
          }
  
        `,
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }

        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (resData.data.login.token) {
          authContext.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "SignUp" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
