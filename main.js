let Obj;
let Obj0;
let Delay = 25;
let Mode = localStorage.getItem("Mode");
	//stores the X,Y points for the shape	
	class Point {
	constructor(X,Y) {
		this.x = X;
		this.y = Y;
	}	}
		function GameOverScreen() {
			ctx.fillStyle = "white";
			ctx.font = "50px Arial";
			ctx.fillText("Game Over", GridX*47, GridY*47);
			ctx.font = "20px Arial";
			ctx.fillText("Click to To Return to title", GridX*48, GridY*51);
		}
		function GameOverP2Mode() {
			ctx.fillStyle = "white";
			ctx.font = "50px Arial";
			if(Obj.IsDead) {ctx.fillText("Player 2 Wins",GridX*42, GridY*47);}
			else {ctx.fillText("Player 1 Wins",GridX*42, GridY*47);}
			ctx.font = "20px Arial";
			ctx.fillText("Click to To Return to title", GridX*48, GridY*51);
		}
		if(Mode	== "p2") {
		const p1cK = [65,68,87,83,67];
		Obj = new Player(GridX*45,GridY*50,"red",P1Score,p1cK,"P1");
		const p2cK = [37,39,38,40,32];
		Obj0 = new Player(GridX*55,GridY*50,"red",P2Score,p2cK,"P2");
		} else {
		const p1cK = [65,68,87,83,32];
		Obj = new Player(GridX*50,GridY*50,"red",P1Score,p1cK,"P1");
	}

		function Game() {
			ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
			//draws all of the players bullets
			for(let i = 0;i < PlayerBullets.length;i++){PlayerBullets[i].DrawBullet();}
			//draws all other Objs on screen
			DrawObject();
			if(Obj.IsDead == false){Obj.draw();}
			if(Mode == 'p2'){if(Obj0.IsDead == false){Obj0.draw();}}
			//every two seconds it adds a rock
			if(Frames % Delay == 1) {
				AddRock();
			}
			if(Frames % 6 == 1 && Frames > 10) {
			//	CreatPowerUp();
			}
			Frames = Frames + 1;
			Obj.ColisionCheck();
			if(Mode == 'p2'){Obj0.ColisionCheck();}
		}
		//this takes a line an returns an array of all the lines pixels
		function LineToPixels(X1,Y1,X2,Y2,Arr) {	
			//get distance between the points using pythagorean theorm
			let DistX;
			let DistY;
			//used for getting each pixel
			let x;
			let y;
			let BaseX;
			let BaseY;
			let endX;
			let endY;
			let Slope;
			let Adder = 1;
			//defines the varaibles
			if(X1 < X2) {DistX = X2 - X1; BaseX = X1; endX = X2;} 
			else {	DistX = X1 - X2; BaseX = X2; endX = X1;}
			DistY = Y2 - Y1; BaseY = Y1; endY = Y2;
			Slope = DistY/DistX;
			x = BaseX;
			y = BaseY;
			if(Slope > 1 || Slope < -1) {
				Adder = 0.1;
				Slope = Slope*0.1;
			} else if (Slope > 10 || Slope < -10) {
				Adder = 0.01;
				Slope = Slope*0.01;
			} else if(Slope == Infinity) {Adder = 0;}
			//loop to get pixels
			while(x <= endX) {
				Arr.push(new Point(x,y));
				x = x + Adder;
				y = y + Slope;
			}
			return Arr; 
		}
		//creates a line of pixels
		function createLine(P1, P2, Arr) {
			if(P1.x > P2.x) {
			Arr = LineToPixels(P2.x,P2.y,
			P1.x,P1.y,Arr);} else {		
			Arr = LineToPixels(P1.x,P1.y,
			P2.x,P2.y,Arr);}
			return Arr;
		}
		//loops threw two polygons to check if any pixels overlap
		function PtoPCheck(Arr1,Arr2) {
			let i = 0;
			let j = 0;
			let Stops = false;
			while(i < Arr1.length) {
				while(j < Arr2.length) {
					if((Arr1[i].x > Arr2[j].x - 2 && Arr1[i].x < Arr2[j].x + 2) 
						&&(Arr1[i].y > Arr2[j].y - 2 && Arr1[i].y < Arr2[j].y + 2)) {
						return true;
					}
					j = j + 1;
				}
				j = 0;
				i = i + 1;
			}
			return false;
		}
		function GameOver() {
			clearInterval(GameLoop);
			if(Mode == 'p1'){GameLoop = setInterval(GameOverScreen,15);}
			else {GameLoop = setInterval(GameOverP2Mode,15);}
		}
		//creates explosion
		function DeathAnimation(X,Y,R,L) {Effects.push(new Explosion(X,Y,R,L,false));}
		function DrawObject() {
			for(let i = 0;i < ObjList.length;i++) {
				switch(ObjList[i].Type) {
					case "Rock":
						ObjList[i].DrawRock();
					break;
					case "Sheild":
						ObjList[i].DrawSheild();
					break;
				}
			}
			for(let i = 0;i < Effects.length;i++) {Effects[i].Draw();}
		}
		GameLoop = setInterval(Game,15);