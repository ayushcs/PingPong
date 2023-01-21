import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const defaultProps = {
  height: 500,
  width: 700,
  upArrow: 87,
  player2up: 38,
  player2down: 40,
  downArrow: 83,
  paddleHeight: 100,
  paddleWidth: 20,
  paddleSpeed: 5,
  ballSize: 10,
};

ReactDOM.render(
  <React.StrictMode>
    <App {...defaultProps} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
