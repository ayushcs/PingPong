import "./App.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import player from "./lib/player";
import player2 from "./lib/player2";
import ball from "./lib/ball";

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function defineProperty(obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}

const defaultValue = {
  ballx: 40,
  bally: 150,
  ballSpeed: 2,
  velx: 0,
  vely: 0,
  player2x: 670,
  player2y: 100,
  playerx: 10,
  playery: 100,
  playerScore: 0,
  player2Score: 0,
};

function App(props) {
  //Room State
  const [gameDetails, setGameDetails] = useState(defaultValue);
  const [context, setContext] = useState(null);
  const [isGameReady, setReady] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  const [canvas, setCanvas] = useState(null);
  const [keyState, setKeyState] = useState({});

  const canvasRef = useRef(null);
  const loopRef = useRef(null);
  const playerFunc = useRef(null);
  const playerFunc2 = useRef(null);
  const ballFunc = useRef(null);

  useEffect(() => {
    playerFunc.current = player(
      context,
      gameDetails,
      props,
      keyState,
      updateGameDetails
    );
    playerFunc2.current = player2(
      context,
      gameDetails,
      props,
      keyState,
      updateGameDetails
    );
    ballFunc.current = ball(
      context,
      gameDetails,
      props,
      playerFunc.current,
      playerFunc2.current,
      updateGameDetails,
      score
    );
  }, [context, gameDetails, keyState]);

  const updateGameDetails = (data) => {
    const newData = { ...gameDetails, ...data };
    setGameDetails(newData);
  };
  const setUpCanvas = () => {
    if (canvasRef.current) {
      const canvasDom = canvasRef.current;
      const context = canvasDom.getContext("2d");
      context.font = "16px Arial";
      context.fillText(
        "Starting Game",
        canvasDom.width / 2 - 50,
        canvasDom.height / 2
      );
      setCanvas(canvas);
      setContext(context);
    }
  };

  const startGame = () => {
    if (loopRef.current) {
      return;
    }
    setKeyState({});
    if (!isGameStarted) {
      localStorage.setItem("player2Score", 0);
      localStorage.setItem("playerScore", 0);
    }
    setGameStarted(true);
    let tempKeyState = keyState;
    document.addEventListener("keydown", function (evt) {
      tempKeyState[evt.keyCode] = true;
      setKeyState(tempKeyState);
    });
    document.addEventListener("keyup", function (evt) {
      delete tempKeyState[evt.keyCode];
      setKeyState(tempKeyState);
    });
    document.addEventListener(
      "ontouchstart",
      function (e) {
        e.preventDefault();
      },
      false
    );
    document.addEventListener(
      "ontouchmove",
      function (e) {
        e.preventDefault();
      },
      false
    );

    loopRef.current = setInterval(function () {
      update();
      draw();
    }, 1);
    ballFunc.current.serve(1);
  };

  const touch = (evt) => {
    var yPos =
      evt.touches[0].pageY -
      evt.touches[0].target.offsetTop -
      props.paddleHeight / 2;
    playerFunc.current.position(yPos);
  };
  const draw = () => {
    if (context) {
      // draw background
      context.fillRect(0, 0, props.width, props.height);
      context.save();
      context.fillStyle = "#fff";

      // draw scoreboard
      context.font = "10px Arial";
      context.fillText("Player 1: " + (localStorage.playerScore ?? 0), 10, 10);
      context.fillText(
        "Player 2: " + (localStorage.player2Score ?? 0),
        500,
        10
      );

      //draw ball
      ballFunc.current.draw();

      //draw paddles
      playerFunc.current.draw();
      playerFunc2.current.draw();

      // draw the net
      let w = 4;
      let x = (props.width - w) * 0.5;
      let y = 0;
      let step = props.height / 20; // how many net segments
      while (y < props.height) {
        context.fillRect(x, y + step * 0.25, w, step * 0.5);
        y += step;
      }

      context.restore();
    }
  };
  const update = () => {
    playerFunc.current.update();
    playerFunc2.current.update();
    ballFunc.current.update();
  };

  const score = (name) => {
    let state = gameDetails;
    let scorer = { player: "player2", player2: "player" }[name];
    localStorage.setItem(
      scorer + "Score",
      localStorage[scorer + "Score"]
        ? Number(localStorage[scorer + "Score"]) + 1
        : 1
    );
    updateGameDetails(
      defineProperty({}, scorer + "Score", state[scorer + "Score"] + 1)
    );
    stopGame();
    setGameDetails(defaultValue);
    if (
      Number(localStorage.player2Score) >= Number(localStorage.playerScore) &&
      Number(localStorage.player2Score) === 3
    ) {
      setTimeout(function () {
        context.font = "30px Arial";
        context.fillText(
          "Player 2 Wins! Click Start to play again!",
          props.width / 2 - 255,
          props.height / 2
        );
      }, 0);

      localStorage.clear();
      setGameStarted(false);
    } else if (
      Number(localStorage.playerScore) >= Number(localStorage.player2Score) &&
      Number(localStorage.playerScore) === 3
    ) {
      setTimeout(function () {
        context.font = "30px Arial";
        context.fillText(
          "Player 1 Wins! Click Start to play again!",
          props.width / 2 - 255,
          props.height / 2
        );
      }, 0);

      localStorage.clear();
      setGameStarted(false);
    } else {
      setTimeout(function () {
        context.font = "30px Arial";
        context.fillText(
          (scorer === "player" ? "Player 1" : "Player 2") + " Wins!",
          props.width / 2 - 85,
          props.height / 2
        );
        context.restore();
      }, 0);
      setTimeout(() => {
        setUpCanvas();
        startGame();
      }, 1000);
    }
  };

  const stopGame = () => {
    // var _this2 = this;
    clearInterval(loopRef.current);
    loopRef.current = null;
    setTimeout(() => {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }, 0);
  };

  useEffect(() => {
    setUpCanvas();
  }, []);

  useEffect(() => {
    if (context) {
      setReady(true);
      context.reset();
      if (canvasRef.current) {
        context.font = "16px Arial";

        context.fillText(
          "Click Start",
          canvasRef.current.width / 2 - 40,
          canvasRef.current.height / 2
        );
      }
    }
  }, [context]);

  const stoptheGame = () => {
    setGameStarted(false);
    stopGame();
    context.font = "16px Arial";
    context.fillText(
      "Click Start",
      canvasRef.current.width / 2 - 40,
      canvasRef.current.height / 2
    );
  };

  return (
    <>
      <div className="gameCanvasParent">
        <canvas
          width={props.width}
          height={props.height}
          onTouchStart={touch}
          onTouchMove={touch}
          ref={canvasRef}
          className="gameCanvas"
        />
      </div>
      <div className="gameController">
        {isGameReady && (
          <>
            <button onClick={startGame} disabled={isGameStarted}>
              Start Game
            </button>
            <button onClick={stoptheGame} disabled={!isGameStarted}>
              Stop Game
            </button>
          </>
        )}
      </div>
      <pre className="Note">
        <b>Player 1: Up = W, Down = S, </b>
        <b>Player 2: Up = Up Arrow Key, Down = Down Arrow Key</b>
      </pre>
      <pre className="Note">
        <b>One who wins 3 round first Wins!!</b>
      </pre>
    </>
  );
}

export default App;
