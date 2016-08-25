var canvas = document.getElementsByTagName('canvas')[0];
var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

var GRAY = { r: 0.75, g: 0.75, b: 0.75 };
var ROTATION_SPEED = 0.025;

var VERTEX_SHADER =
'attribute vec3 position; \n' +
'attribute vec3 color; \n' +
'uniform mat4 modelMatrix; \n' +
'uniform mat4 viewMatrix; \n' +
'uniform mat4 projectionMatrix; \n' +
'varying vec3 vColor; \n' +
'\n' +
'void main() { \n' +
' gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1); \n' +
' vColor = color; \n' +
'}';

var FRAGMENT_SHADER =
'#ifdef GL_ES \n' +
'precision mediump float; \n' +
'#endif \n' +
'\n' +
'varying vec3 vColor; \n' +
'void main() { \n' +
' gl_FragColor = vec4(vColor, 1.0); \n' +
'}';

var UNIFORM_NAMES = [
  'modelMatrix',
  'viewMatrix',
  'projectionMatrix'
];

var VERTICES = new Float32Array([
	-1.0, -1.0, -1.0,
	 1.0, -1.0, -1.0,
	-1.0,  1.0, -1.0,
	-1.0,  1.0, -1.0,
	 1.0, -1.0, -1.0,
	 1.0,  1.0, -1.0,

	-1.0, -1.0, 1.0,
	 1.0, -1.0, 1.0,
	-1.0,  1.0, 1.0,
	-1.0,  1.0, 1.0,
	 1.0, -1.0, 1.0,
	 1.0,  1.0, 1.0,

	1.0, -1.0, -1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0, -1.0,
	1.0,  1.0, -1.0,
	1.0, -1.0,  1.0,
	1.0,  1.0,  1.0,

	-1.0, -1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0, -1.0,
	-1.0,  1.0, -1.0,
	-1.0, -1.0,  1.0,
	-1.0,  1.0,  1.0,

	 1.0, 1.0, -1.0,
	 1.0, 1.0,  1.0,
	-1.0, 1.0, -1.0,
	 1.0, 1.0,  1.0,
	-1.0, 1.0,  1.0,
	-1.0, 1.0, -1.0,

	 1.0, -1.0, -1.0,
	 1.0, -1.0,  1.0,
	-1.0, -1.0, -1.0,
	 1.0, -1.0,  1.0,
	-1.0, -1.0,  1.0,
	-1.0, -1.0, -1.0,
]);

var COLORS = new Float32Array([
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,

	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,

	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0,

	1.0, 1.0, 0.0,
	1.0, 1.0, 0.0,
	1.0, 1.0, 0.0,
	1.0, 1.0, 0.0,
	1.0, 1.0, 0.0,
	1.0, 1.0, 0.0,

	0.0, 1.0, 1.0,
	0.0, 1.0, 1.0,
	0.0, 1.0, 1.0,
	0.0, 1.0, 1.0,
	0.0, 1.0, 1.0,
	0.0, 1.0, 1.0,

	1.0, 0.0, 1.0,
	1.0, 0.0, 1.0,
	1.0, 0.0, 1.0,
	1.0, 0.0, 1.0,
	1.0, 0.0, 1.0,
	1.0, 0.0, 1.0
]);

var modelMatrix = newModelMatrix();
var viewMatrix = newViewMatrix();
var projectionMatrix = newProjectionMatrix();
var program = programFromCompiledShadersAndUniformNames(
	gl,
	VERTEX_SHADER,
	FRAGMENT_SHADER,
	UNIFORM_NAMES
);

gl.useProgram(program);
gl.uniformMatrix4fv(program.uniformsCache['modelMatrix'], false, modelMatrix);
gl.uniformMatrix4fv(program.uniformsCache['viewMatrix'], false, viewMatrix);
gl.uniformMatrix4fv(program.uniformsCache['projectionMatrix'], false, projectionMatrix);
configureVerticesForCube(gl, program, VERTICES);
configureColorsForCube(gl, program, COLORS);

drawCube();
requestAnimationFrame(animateCube);

function animateCube() {
	rotateCube(modelMatrix);
	gl.uniformMatrix4fv(program.uniformsCache['modelMatrix'], false, modelMatrix);
	drawCube();
	requestAnimationFrame(animateCube);
}

function drawCube() {
	clearGl();
	gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function rotateCube(modelMatrix) {
	mat4.rotateX(modelMatrix, modelMatrix, ROTATION_SPEED);
	mat4.rotateY(modelMatrix, modelMatrix, ROTATION_SPEED);
	mat4.rotateZ(modelMatrix, modelMatrix, ROTATION_SPEED);
}

function clearGl() {
	gl.enable(gl.DEPTH_TEST);
	gl.clearColor(GRAY.r, GRAY.g, GRAY.b, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function configureVerticesForCube(gl, program, vertices) {
	configureBuffer(gl, program, vertices, 3, 'position');
}

function configureColorsForCube(gl, program, colors) {
	configureBuffer(gl, program, colors, 3, 'color');
}

function newModelMatrix() {
  var modelMatrix = mat4.create();
  return modelMatrix;
}

function newViewMatrix() {
  var viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  return viewMatrix;
}

function newProjectionMatrix() {
  var projectionMatrix = mat4.create();
	mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, 2.0, -2.0);
  return projectionMatrix;
}

function programFromCompiledShadersAndUniformNames(gl, vertexShader, fragmentShader, uniformNames) {
	var compiledVertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
	var compiledFragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
	var program = linkShader(gl, compiledVertexShader, compiledFragmentShader);
	cacheUniformLocations(gl, program, uniformNames);
	return program;
}

function cacheUniformLocations(gl, program, uniformNames) {
	uniformNames.forEach(function(uniformName) {
		cacheUniformLocation(gl, program, uniformName);
	});
}

// https://nickdesaulniers.github.io/RawWebGL/#/40
function compileShader(gl, type, shaderSrc) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

// https://nickdesaulniers.github.io/RawWebGL/#/41
function linkShader(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

// modified from https://nickdesaulniers.github.io/RawWebGL/#/51
function configureBuffer(gl, program, data, elemPerVertex, attributeName) {
	var attributeLocation = gl.getAttribLocation(program, attributeName);
  var buffer = gl.createBuffer();
  if (!buffer) { throw new Error('Failed to create buffer.'); }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attributeLocation, elemPerVertex, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributeLocation);
}

// http://mrdoob.com/projects/glsl_sandbox/
function cacheUniformLocation(gl, program, label) {
	if (!program.uniformsCache) {
		program.uniformsCache = {};
	}

	program.uniformsCache[label] = gl.getUniformLocation(program, label);
}
