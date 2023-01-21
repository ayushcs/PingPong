/**
 * Created by Oakley Hall on 6/23/15.
 */

"use strict";

module.exports = function (context, state, props, setState) {
  let py = undefined;

  return {
    update: function update() {
      py = state.aiy;
      let desty = state.bally - (props.paddleHeight - props.ballSize) * 0.5;
      py = py + (desty - py) * 0.1;
      console.log({ py, bally: state.bally });
      setState({ aiy: py });
    },
    draw: function draw() {
      context.fillRect(
        state.aix,
        state.aiy,
        props.paddleWidth,
        props.paddleHeight
      );
    },
    name: function name() {
      return "ai";
    },
    position: function position() {
      return {
        x: state.aix,
        y: state.aiy,
      };
    },
  };
};
