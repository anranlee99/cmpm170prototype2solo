import "crisp-game-lib";

const title = " Color Cascade";

const description = `
  Match the color
`;

const colors = ["red", "blue", "green", "yellow"]; // Add more colors as needed
const balls: Ball[] = []; // Array of balls
interface Ball {
  pos: Vector;
  color: Color;
  speed: number;
}
interface Paddle {
  pos: Vector;
  width: number;
  height: number;
  color: Color;
}
const paddles: Paddle[] = [];
const paddleWidth = 15;
const spaceBetweenPaddles = 40 / 3;
const ballSpawns: number[] = [];
colors.forEach((color, index) => {
  const posX = spaceBetweenPaddles * (index) + paddleWidth * index;
  ballSpawns.push(posX + paddleWidth / 2);
  paddles.push({
    pos: vec(posX, 90),
    width: paddleWidth,
    height: 5,
    color: color as Color
  });
});
let difficulty = 0;
function update() {
  if (!ticks) {
    resetGame();
  }
  if(ticks % 1000 === 0){
    difficulty++;
  }


  // Ball spawning and logic
  if (ticks % 100 === 0) { // Adjust the frequency of ball spawning as needed
    const ballColorIndex = rndi(0, colors.length);
    const ballPosIndex = rndi(0, colors.length);
    const ballpos = rndi(-difficulty, difficulty);
    const speedincrease = rnd(0, difficulty)/10;
    balls.push({
      pos: vec(ballSpawns[ballPosIndex] + ballpos, 0),
      color: colors[ballColorIndex] as Color,
      speed: 0.5 + speedincrease // Adjust ball speed as needed
    });
  }

  if (input.isJustPressed) {

    //rotate in the opposite direction
    paddles.forEach((paddle, index) => {
      if (paddle.color === colors[0]) {
        paddle.color = colors[colors.length - 1] as Color;
      } else {
        paddle.color = colors[index - 1] as Color;
      }
    });
    paddles.forEach((paddle, index) => {
      colors[index] = paddle.color;
    });

  }

  for (const paddle of paddles) {
    color(paddle.color);
    rect(paddle.pos, paddle.width, paddle.height);
  }

  // Update and draw balls
  remove(balls, (ball) => {
    ball.pos.y += ball.speed; // Move the ball downwards
    

    for (const paddle of paddles){

      color(ball.color);
      // @ts-ignore
      const isColliding = char("O", ball.pos).isColliding.rect[paddle.color as Color];


      if (isColliding && paddle.color && ball.pos.y >= paddle.pos.y - paddle.height && ball.color === paddle.color) {
        play("coin"); // Play a sound effect on collision
        addScore(10 + difficulty*10); // Increase score
        return true; // Remove the ball from the array
      } else if (isColliding && paddle.color && ball.pos.y >= paddle.pos.y - paddle.height && ball.color !== paddle.color) {
        play("explosion"); // Play a sound effect on collision
        end("womp womp"); // End the game

      }
    }


    // Remove the ball if it goes off-screen
    return ball.pos.y > 99;
  });

}
function resetGame() {
  difficulty = 0;
  remove(balls, () => {
    return true;
  });
}
init({
  update,
  title,
  description,
  options: {

  },
});
