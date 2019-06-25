(function(window) {
  var Minesweeper = window.Minesweeper = window.Minesweeper || {};
  var GRID_NUM_ROWS;
  var GRID_NUM_COLS;
  var NUM_MINES;

  var DIFFICULTY = 1;
  var SAFE = 0;

  var canvas;
  var ctx;
  var mouse;
  var initialized = false;

  var cells;
  var cellWidth;
  var cellHeight;
  var gridWidth;
  var gridHeight;
  var gridValid;
  var fontSize;

  var flags;

  var COLORS = {
	  valid:	"#ccc",
	  invalid: "#aaa",
	  flag:	"#f00",
	  bomb:	"#000",
	  numbers: ["#aaa", "#00f", "#0a0", "#f00", "#008", "#800", "#080", "#000", "#555"]
  };

  function setCanvas(w, h) {
	  canvas.width = w;
	  canvas.height = h;
  }

  function initGrid() {
	  cells = [];
	  mouse = {x:0, y:0};
	  gridValid = true;
	  flags = 0;
	  buildGrid();
	  draw();
  }

  function setEasy() {
	  DIFFICULTY = 1;
	  initGrid();
  }

  function setMedium() {
	  DIFFICULTY = 2;
	  initGrid();
  }

  function setHard() {
	  DIFFICULTY = 3;
	  initGrid();
  }

  function buildGrid() {
	  switch(DIFFICULTY) {
	  case 1:
		  GRID_NUM_ROWS = 8;
		  GRID_NUM_COLS = 8;
		  NUM_MINES = 10;
		  setCanvas(320, 320);
		  break;
	  case 2:
		  GRID_NUM_ROWS = 16;
		  GRID_NUM_COLS = 16;
		  NUM_MINES = 40;
		  setCanvas(400, 400);
		  break;
	  case 3:
	  default:
		  GRID_NUM_ROWS = 16;
		  GRID_NUM_COLS = 30;
		  NUM_MINES = 99;
		  setCanvas(750, 400);
		  break;
	  }
	  cellWidth = Math.floor(canvas.width / GRID_NUM_COLS);
	  cellHeight = Math.floor(canvas.height / GRID_NUM_ROWS);
	  gridWidth = cellWidth * GRID_NUM_COLS;
	  gridHeight = cellHeight * GRID_NUM_ROWS;
	  document.getElementById("mines").innerHTML = NUM_MINES;

	  for(var i = 0; i < GRID_NUM_ROWS * GRID_NUM_COLS; i++) {
		  var cell = {};
		  if(i >= NUM_MINES) {
			  cell.code = SAFE;
			  cell.isBomb = false;
		  }
		  else {
			  cell.code = SAFE;
			  cell.isBomb = true;
		  }
		  cell.isFlag = false;
		  cell.valid = true;
		  cells.push(cell);
	  }
	  cells = shuffleArray(cells);

	  var xPos = 0;
	  var yPos = 0;
	  for(var i = 0; i < cells.length; i++) {
		  cells[i].x = xPos;
		  cells[i].y = yPos;
		  xPos += cellWidth;
		  if(xPos >= canvas.gridWidth) {
			  xPos = 0;
			  yPos += cellHeight;
		  }
	  }
  }

  function draw() {
	  document.getElementById("flags").innerHTML = flags;
	  ctx.clearRect(0, 0, gridWidth, gridHeight);
	  var xPos = 0;
	  var yPos = 0;
	  for(var i = 0; i < cells.length; i++) {
		  var cell = cells[i];
		  if(cell.valid) {
			  if(cell.isFlag) {
				  ctx.fillStyle = COLORS.flag;
			  }
			  else {
				  ctx.fillStyle = COLORS.valid;
			  }
			  ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
		  }
		  else {
			  if(cell.isBomb) {
				  ctx.fillStyle = COLORS.bomb;
				  ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
			  }
			  else {
				  ctx.fillStyle = COLORS.invalid;
				  ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
				  if(cell.code != SAFE) {
					  ctx.fillStyle = COLORS.numbers[cell.code];
					  ctx.fillText(cell.code, xPos + cellWidth/2 - fontSize/4, yPos + cellHeight/2 + fontSize/4);
				  }
			  }
		  }

		  ctx.strokeRect(xPos, yPos, cellWidth, cellHeight);
		  xPos += cellWidth;
		  if(xPos >= gridWidth) {
			  xPos = 0;
			  yPos += cellHeight;
		  }
	  }
  }

  function getMousePos(e) {
	  var rect = canvas.getBoundingClientRect();
	  var root = document.documentElement;

	  mouse.x = e.clientX - rect.left - root.scrollLeft;
	  mouse.y = e.clientY - rect.top - root.scrollTop;

	  var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	  if (!is_chrome) {
		  mouse.x += window.pageXOffset;
		  mouse.y += window.pageYOffset;
	  }
	  mouse.x = Math.floor(mouse.x);
	  mouse.y = Math.floor(mouse.y);
  }

  function updateGrid(e) {
	  getMousePos(e);

	  if (e.button == 0) {
		  excavate();
	  }
	  else if (e.button == 2) {
		  setFlag();
	  }
	  else {
		  return;
	  }

	  var win = checkWin();
	  if (win) {
		  finishBoard();
	  }

	  draw();

	  if (!gridValid) {
		  alert("You died in a horrible bombing incident.");
		  initGrid();
	  }
	  else if (win) {
		  alert("You survived sweeping through a mine field.");
		  initGrid();
	  }
  }

  function setFlag() {
	  var cellNum = clickedCell();
	  if (cellNum != null) {
		  if (cells[cellNum].valid) {
			  cells[cellNum].isFlag = !cells[cellNum].isFlag;
			  if (cells[cellNum].isFlag) {
				  flags++;
			  }
			  else {
				  flags--;
		  	}
		  }
  	}
  }

  function excavate() {
	  var cellNum = clickedCell();
	  if(cellNum != null) {
		  if(cells[cellNum].isFlag) {
			  return;
		  }
		  else {
			  cells[cellNum].valid = false;
			  if(!cells[cellNum].isBomb) {
				  var neighbours = getNeighbours(cellNum);
				  cells[cellNum].code = getBombCount(neighbours);
				  if(cells[cellNum].code == SAFE) {
					  expand(neighbours);
				  }
			  }
			  else {
				  gridValid = false;
			  }
		  }
	  }
  }

  function clickedCell() {
	  var xPos = 0;
	  var yPos = 0;

	  for(var i = 0; i < cells.length; i++) {
		  if(mouse.x < xPos || mouse.x > (xPos + cellWidth) || mouse.y < yPos || mouse.y > (yPos + cellHeight)) {
		  }
		  else {
			  return i;
		  }
		  xPos += cellWidth;
		  if (xPos >= gridWidth) {
			  xPos = 0;
			  yPos += cellHeight;
		  }
	  }

	  return null;
  }

  function checkWin() {
	  var win = true;
	  for(var i = 0; i < cells.length; i++) {
		  if(cells[i].valid && !cells[i].isBomb) {
			  win = false;
			  break;
		  }
	  }

	  return win;
  }

  function finishBoard() {
	  flags = NUM_MINES;
	  for(var i = 0; i < cells.length; i++) {
		  if(cells[i].isBomb) {
			  cells[i].isFlag = true;
		  }
	  }
  }

  function getNeighbours(index) {
	  var neighbours = [];
	  var newIndex = index - GRID_NUM_COLS - 1;
	  if(index % GRID_NUM_COLS != 0 && newIndex >= 0) {
		  neighbours.push(newIndex);
	  }
	  newIndex = index - GRID_NUM_COLS;
	  if(newIndex >= 0) {
      neighbours.push(newIndex);
    }
	  newIndex = index - GRID_NUM_COLS + 1;
	  if(index % GRID_NUM_COLS != GRID_NUM_COLS - 1 && newIndex >= 0) {
      neighbours.push(newIndex);
    }

	  newIndex = index - 1;
	  if(index % GRID_NUM_COLS != 0 && newIndex >= 0) {
      neighbours.push(newIndex);
    }

    newIndex = index + 1;
    if(index % GRID_NUM_COLS != GRID_NUM_COLS - 1 && newIndex < cells.length) {
      neighbours.push(newIndex);
    }

	  newIndex = index + GRID_NUM_COLS - 1;
	  if(index % GRID_NUM_COLS != 0 && newIndex < cells.length) {
      neighbours.push(newIndex);
    }

    newIndex = index + GRID_NUM_COLS;
    if(newIndex < cells.length) {
      neighbours.push(newIndex);
    }

    newIndex = index + GRID_NUM_COLS + 1;
    if(index % GRID_NUM_COLS != GRID_NUM_COLS - 1 && newIndex < cells.length) {
      neighbours.push(newIndex);
    }

	  return neighbours;
  }

  function getBombCount(arr) {
	  var bombCount = 0;
	  for(var i = 0; i < arr.length; i++) {
		  if(cells[arr[i]].isBomb) {
			  bombCount++;
		  }
	  }
	  return bombCount;
  }

  function expand(arr) {
	  for(var i = 0; i < arr.length; i++) {
		  var neighbours = getNeighbours(arr[i]);
		  if(cells[arr[i]].valid && getBombCount(neighbours) == SAFE) {
			  cells[arr[i]].valid = false;
			  expand(neighbours);
		  }
		  else {
			  cells[arr[i]].valid = false;
			  cells[arr[i]].code = getBombCount(neighbours);
		  }
	  }
  }

  function shuffleArray(o){
	  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  }

  Minesweeper.init = function () {
    if (initialized) return;
	  canvas = document.getElementById("canvas");
	  ctx = canvas.getContext("2d");
	  ctx.textAlign = "center";
	  ctx.font = "bold 16px arial";
	  fontSize = 16;
    initGrid();
	  canvas.onmouseup = updateGrid;
    document.getElementById("btn-easy").onclick = setEasy;
    document.getElementById("btn-medium").onclick = setMedium;
    document.getElementById("btn-hard").onclick = setHard;
  }

})(window);
