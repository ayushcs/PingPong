"use strict";

module.exports = function (
  context,
  state,
  props,
  player,
  secondPlayer,
  setState,
  score
) {
  let pi = Math.PI;
  let ai = secondPlayer;
  let r = Math.random();

  return {
    serve: function serve(side) {
      var phi = 0.1 * pi * (1 - 2 * r);
      setState({
        ballx:
          side === 1
            ? state.playerx + props.paddleWidth
            : state.player2x - props.ballSize,
        bally:
          (side === 1
            ? state.playery + props.ballSize
            : state.player2y + props.ballSize) + 50,
        velx: state.ballSpeed * Math.cos(phi) * side,
        vely: state.ballSpeed * Math.sin(phi),
      });
    },
    update: function update() {
      var bx = state.ballx;
      var by = state.bally;
      var vx = state.velx;
      var vy = state.vely;

      setState({
        ballx: bx + vx,
        bally: by + vy,
      });

      if (0 > by || by + props.ballSize > props.height) {
        var offset =
          state.vely < 0
            ? 0 - state.bally
            : props.height - (state.bally + props.ballSize);
        setState({
          bally: by + 2 * offset,
          vely: vy * -1,
        });
      }

      var pdle = state.velx < 0 ? player : ai;

      var AABBIntersect = function AABBIntersect(
        paddleX,
        paddleY,
        pWidth,
        pHeight,
        bx,
        by,
        bw,
        bh
      ) {
        return (
          paddleX < bx + bw &&
          paddleY < by + bh &&
          bx < paddleX + pWidth &&
          by < paddleY + pHeight
        );
      };
      if (
        AABBIntersect(
          pdle.position().x,
          pdle.position().y,
          props.paddleWidth,
          props.paddleHeight,
          state.ballx,
          state.bally,
          props.ballSize,
          props.ballSize
        )
      ) {
        var dir = state.velx < 0 ? 1 : -1;
        var n =
          (state.bally + props.ballSize - pdle.position().y) /
          (props.paddleHeight + props.ballSize);
        var ydir = (n > 0.5 ? -1 : 1) * dir;
        var phi = 0.25 * pi * (2 * n + dir) + r;
        var smash = Math.abs(phi) > 0.2 * pi ? 1.1 : 1;

        setState({
          ballx:
            pdle === player
              ? state.playerx + props.paddleWidth
              : state.player2x - props.ballSize,
          velx: smash * -1 * state.velx,
          vely: smash * ydir * state.velx * Math.sin(phi),
        });
      }

      if (0 > state.ballx + props.ballSize || state.ballx > props.width) {
        score(pdle.name());
        this.serve(pdle.name() === player.name() ? 1 : -1);
      }
    },
    draw: function draw() {
      context.beginPath();
      context.arc(state.ballx, state.bally, props.ballSize, 0, 2 * Math.PI);
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = "#fff";
      context.stroke();
    },
  };
};
