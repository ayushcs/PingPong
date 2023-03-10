"use strict";

module.exports = function (context, state, props, keystate, setState) {
  let py = undefined;

  return {
    update: function update() {
      py = state.playery;
      if (keystate[props.upArrow]) {
        py = state.playery - props.paddleSpeed;
        setState({ playery: py < 0 ? 0 : py });
      }
      if (keystate[props.downArrow]) {
        py = state.playery + props.paddleSpeed;
        setState({
          playery:
            py > props.height - props.paddleHeight
              ? props.height - props.paddleHeight
              : py,
        });
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      setState({ playery: py });
    },
    draw: function draw() {
      context.fillRect(
        state.playerx,
        state.playery,
        props.paddleWidth,
        props.paddleHeight
      );
    },
    name: function name() {
      return "player";
    },
    position: function position(y) {
      if (y) {
        setState({ playery: y });
      }
      return {
        x: state.playerx,
        y: state.playery,
      };
    },
  };
};
