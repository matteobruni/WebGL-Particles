import { resize, initCanvas } from "./helpers";
import { generateParticle } from "./particles";
import { initialization, updateParticles } from "./middleware";
import config from "./config";

const [gl, program] = initCanvas("canvas");

const screenSizeLocation = gl.getUniformLocation(program, "u_screenSize");
const timeUniformLocation = gl.getUniformLocation(program, "u_time");
const sizeUniformLocation = gl.getUniformLocation(program, "u_size");

const props = initialization.run({}, gl, program, config);

requestAnimationFrame(drawScene);

let updatingProps = {
  ...props,
  marking: { index: 0, count: 0, marked: new Array(config.count).fill(false) },
  generating: { index: 0, count: 0 },
};

function drawScene(time) {
  const width = gl.canvas.width;
  const height = gl.canvas.height;
  resize(gl.canvas);
  gl.viewport(0, 0, width, height);

  updatingProps = updateParticles.run(
    { ...updatingProps, time, width, height },
    gl,
    config
  );

  gl.useProgram(program);

  gl.uniform2f(screenSizeLocation, width, height);
  gl.uniform1f(timeUniformLocation, time);
  gl.uniform1f(sizeUniformLocation, config.size);

  gl.drawArrays(gl.POINTS, 0, config.count);

  requestAnimationFrame(drawScene);
}
