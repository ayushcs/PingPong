import "./App.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import player from "./lib/player";
import player2 from "./lib/player2";
import ball from "./lib/ball";

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

  const mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

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
      {mobileAndTabletCheck() ? (
        <div className="Note error"> Not Supported, Please use desktop</div>
      ) : (
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
      )}
    </>
  );
}

export default App;
