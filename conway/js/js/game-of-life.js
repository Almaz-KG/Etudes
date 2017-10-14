Array.prototype.pushIfNotExist = function(element) { 
    if(!contain(this, element))
    	this.push(element);
};

function contain(cells, cell){
	for (var item of cells){
    	if(item.x == cell.x && item.y == cell.y)
    		return true;
    }

    return false;
}

class Cell {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	draw(contex, cellSize){
		DrawUtils.drawCell(contex, this.x, this.y, cellSize);
	}
}

class DrawUtils{
	
	static drawCell(contex, x, y, cellSize) {
		contex.fillStyle = "white";
		contex.fillRect(
			x * cellSize, 
			y * cellSize, 
			cellSize, 
			cellSize);
		contex.fillStyle = "black";
		contex.fillRect(
			x * cellSize + 0.5, 
			y * cellSize + 0.5, 
			cellSize - 0.5, 
			cellSize - 0.5);
	}

	static clear(contex){
		
		contex.fillStyle = "white";
		contex.fillRect(0, 0, window.innerWidth, window.innerHeight);

		//this.drawLine(contex, width, height, cellSize);
	}

	static drawLine(contex, width, height, cellSize){
		contex.strokeStyle = 'grey';
		for (var i = 0; i <= width / cellSize; i++){
			contex.beginPath();
			contex.moveTo(i * cellSize, 0);
			contex.lineTo(i * cellSize, height);
			contex.stroke();

			contex.beginPath();
			contex.moveTo(0, i * cellSize);
			contex.lineTo(width, i * cellSize);
			contex.stroke();
		}
	}

	static center(cellSize, cells){
		// var widht = window.innerWidth;
		// var height = window.innerHeight;

		// var xCount = widht / cellSize;
		// var yCount = height / cellSize;

		// var diffX = this.calcDiffX(xCount, cells);
		// var diffY = this.calcDiffY(yCount, cells);

		// for (var cell of cells){
		// 	cell.x = cell.x + diffX;
		// 	cell.y = cell.y + diffY;
		// }

		return cells;
	}
}

class StateUtils{

	static isEquals(currentState, initialState){
		if(currentState.length != initialState.length)
			return false;

		for(var cell of initialState){
			if(!contain(currentState, cell)){
				return false;
			}
		}

		return true;
	}

	static getNeighBoursPositions(x, y){
		return [
			{x: x - 1, y: y - 1}, 
			{x: x,     y: y - 1}, 
			{x: x + 1, y: y - 1}, 

			{x: x - 1, y: y}, 
			{x: x + 1, y: y}, 

			{x: x - 1, y: y + 1}, 
			{x: x    , y: y + 1}, 
			{x: x + 1, y: y + 1}, 
		];
	}

	static findCellByPosition(cells, x, y){
		for (var cell in cells){
			if(x == cells[cell].x && y == cells[cell].y)
				return cells[cell];
		}

		return null;
	}

	static checkAndGet(cells, x, y){
		for (var cell of cells){
			if(cell.x == x && cell.y == y)
				return 1;
		}
		return 0;
	}

	static neighboursCount(state, x, y){
		var result = 0;

		result += StateUtils.checkAndGet(state, x - 1, y - 1);
		result += StateUtils.checkAndGet(state, x,     y - 1);
		result += StateUtils.checkAndGet(state, x + 1, y - 1);

		result += StateUtils.checkAndGet(state, x - 1, y);
		result += StateUtils.checkAndGet(state, x + 1, y);

		result += StateUtils.checkAndGet(state, x - 1, y + 1);
		result += StateUtils.checkAndGet(state, x,     y + 1);
		result += StateUtils.checkAndGet(state, x + 1, y + 1);

		return result;
	}
}


class State {
 
	constructor(cells){
		var canvas = document.getElementById("game-of-life-border");

		this.borderContex = canvas.getContext('2d');
		this.cellSize = 4;
		this.period = 0;
	 	this.borderContex.translate(0.5, 0.5);
	 	
	 	this.initialState = {};
	 	this.initialState.cells = [];
	 	Object.assign(this.initialState.cells, cells);

	 	this.cells = DrawUtils.center(this.cellSize, cells);
	 	this.draw();
	}

	draw(){
		DrawUtils.clear(this.borderContex);

		for (var cell of this.cells)
			cell.draw(this.borderContex, this.cellSize);
	}

	nextState(){
		this.cells = this.generateNextState(this.cells);
		return this;
	}


	generateNextState(cells){
		if(cells === null)
			return cells;

		var result = [];

		for (var cell of cells){
			var neighBours = StateUtils.getNeighBoursPositions(cell.x, cell.y);

			for (var nb of neighBours){
				var nbCount = StateUtils.neighboursCount(cells, nb.x, nb.y);

				if(nbCount == 3){
					result.pushIfNotExist(new Cell(nb.x, nb.y));
				}
			}

			var count = StateUtils.neighboursCount(cells, cell.x, cell.y);	
			if (count == 2 || count == 3)
				result.pushIfNotExist(cell);
		}

		this.period++;

		if(!this.initialState.period && StateUtils.isEquals(result, this.initialState.cells)){
			this.initialState.period = this.period;
			console.log("Period: " + this.initialState.period + " Life cells: " + result.length);	
		}

		return result;
	}

	drawNextState(){
		var nextState = this.nextState();

		if(nextState !== null)
			nextState.draw();
	}
}

class GameOfLife {
	constructor() {
		var cells = [

			// BLOCK
			// new Cell(2, 3),
			// new Cell(3, 3),
			// new Cell(2, 2),
			// new Cell(3, 2),

			// BAKEN
			// new Cell(3, 1),
			// new Cell(4, 1),
			// new Cell(4, 2),
			// new Cell(1, 3),
			// new Cell(1, 4),
			// new Cell(2, 4)
			
			// GLADER
			// new Cell(1, 1),
			// new Cell(2, 1),
			// new Cell(5, 2),
			// new Cell(1, 2),
			// new Cell(5, 1),
			// new Cell(1, 3),
			// new Cell(4, 3),
			// new Cell(5, 3)

			// PLANER
			// new Cell(1, 3),
			// new Cell(2, 3),
			// new Cell(3, 3),
			// new Cell(3, 2),
			// new Cell(2, 1),

			// GUN
			new Cell(4, 5), new Cell(4, 6), new Cell(5, 5), new Cell(5, 6), 
			new Cell(14, 5), new Cell(14, 6), new Cell(14, 7), new Cell(18, 6), 
			new Cell(15, 8), new Cell(16, 9), new Cell(17, 9), new Cell(19, 4), 
			new Cell(19, 8), new Cell(15, 4), new Cell(16, 3), new Cell(17, 3),  
			new Cell(20, 7), new Cell(20, 6), new Cell(20, 5), new Cell(21, 6),  
			new Cell(25, 5), new Cell(24, 5), new Cell(25, 4), new Cell(24, 4), new Cell(25, 3), new Cell(24, 3), 
			new Cell(26, 2), new Cell(26, 6), new Cell(28, 2), new Cell(28, 6), new Cell(28, 1), new Cell(28, 7), 
			new Cell(39, 3), new Cell(39, 4), new Cell(38, 3), new Cell(38, 4)
		];
		this.state = new State(cells);
		this.state.draw();
		this.isRunning = false;
	}
}

var gameOfLife = new GameOfLife();

function run(){
	if(gameOfLife.isRunning){
		gameOfLife.state.drawNextState();
		setTimeout(run, 100);
	}
}

function startButtonClicked(){
	if(gameOfLife.isRunning)
		return;

	gameOfLife.isRunning = true;
	run();
}

function stopButtonClicked(){
	if(!gameOfLife.isRunning)
		return;

	gameOfLife.isRunning = false;
}