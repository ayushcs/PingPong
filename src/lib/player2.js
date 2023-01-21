"use strict";

module.exports = function (context, state, props, keystate, setState) {
  let py = undefined;

  return {
    update: function update() {
      py = state.player2y;
      if (keystate[props.player2up]) {
        py = state.player2y - props.paddleSpeed;
        setState({ player2y: py < 0 ? 0 : py });
      }
      if (keystate[props.player2down]) {
        py = state.player2y + props.paddleSpeed;
        setState({
          player2y:
            py > props.height - props.paddleHeight
              ? props.height - props.paddleHeight
              : py,
        });
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      setState({ player2y: py });
    },
    draw: function draw() {
      context.fillRect(
        state.player2x,
        state.player2y,
        props.paddleWidth,
        props.paddleHeight
      );
    },
    name: function name() {
      return "player2";
    },
    position: function position(y) {
      if (y) {
        setState({ player2y: y });
      }
      return {
        x: state.player2x,
        y: state.player2y,
      };
    },
  };
};
