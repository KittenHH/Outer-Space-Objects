let Diffuclty = -1;
let Decider = 1;

function FindAngle(X1,X2,Y1,Y2) {
	let rise;
	let run;
	if(Y1 < Y2) {rise = Y1 - Y2; console.log("a");} 
	else {rise = Y2 - Y1; console.log("b");}
	if(X1 > X2) {run = X1 - X2;} else {run = X2 - X1;}
	return Math.atan(rise/run);
}``

//this adds a rock into the array
function AddRock() {
	let x;
	let y;
	let a;
	//decides which corner to put the rock
	x = (GridX * Math.round(Math.random()*60)+20);
		if(Decider == 0) {
			y = GridY;
			Decider = 1;
		} else {
			y = GridY*100;
			Decider = 0;
		}

			a = FindAngle(Obj.X,x,Obj.Y,y);
			ObjList.push(new Rock(x,y,
			Math.round(Math.random()*20)+20,
			Math.round(Math.random()*16)+8,-1,a));
		}

//its actully just a polygon
class Rock {
	constructor(X,Y,R,N,Speed,Angle) {
		this.Type = "Rock";
		//this keeps track of how many pixels are on the polygon
		//keeps track of the origional pos for bug fix
		//pos
		this.x = X;
		this.y = Y;
		//radius
		this.r = R;
		//number of sides
		this.n = N;
		//a list of all the points
		this.Points = [];
		//this creates a list of all the points 
		//in the polygons exactpositions not relative to the center
		this.ExactPoints = [];
		//list of all pixels on screen
		this.rPixels = [];
		//creates the points
		this.GenerateShape();
		//keeps track of the rotation
		this.Deg = 0.01;
		//keeps track of the Speed and the way the Rock is going
		this.Speed = Diffuclty;
		this.SpeedAngle = Angle;
		//state of the Enemy
		this.state = 3;
		//is dead
		this.isDead = false;
		//how much health the rock has
		this.State = "white";
		//this prevents bugs from occuring
		this.Change = false;

	}
	//creates a list of all points in the polygon 
	GenerateShape() {
		for (let i = 0; i < this.n; i++) {
		let temp = new Point(
		this.r * Math.cos(2 * Math.PI * i / this.n + (Math.random()*(this.r/50))),
 	 	this.r * Math.sin(2 * Math.PI * i / this.n + (Math.random()*(this.r/50))))
 		this.Points.push(temp);
 	 	//adds exact points
 	 	this.ExactPoints.push(new Point(temp.x + this.x,temp.y + this.y));
		}
	}
	//indexs the points list and draws a line between each
	DrawRock() {
		if(this.isDead == true) {return;}
		this.Move()
		this.RoatatePoints();
		this.exactPoints();
		this.UpdatesPixels();
		if(this.Change) {this.OffScreen();} else {this.UnOffScreen();} 

		ctx.save();
		ctx.translate(this.x ,this.y);
		for(let i = 1; i < this.n; i++) {
			ctx.beginPath();
   			ctx.moveTo(this.Points[i - 1].x,this.Points[i - 1].y);
   			ctx.lineTo(this.Points[i].x,this.Points[i].y);
   			ctx.strokeStyle = this.State;
   			ctx.lineWidth = 2;
			ctx.stroke();
		}
		ctx.beginPath();
   		ctx.moveTo(this.Points[0].x,this.Points[0].y);
   		ctx.lineTo(this.Points[this.n - 1].x,this.Points[this.n - 1].y);
		ctx.stroke();
		ctx.restore();
	}
	//rotates the rock
	RoatatePoints() {
		for(let i = 0;i < this.n;i++) {
				let TempX = (this.Points[i].x * Math.cos(this.Deg))
				 - (this.Points[i].y * Math.sin(this.Deg));
				this.Points[i].y = (this.Points[i].y * Math.cos(this.Deg)) 
				 + (this.Points[i].x * Math.sin(this.Deg));
				 this.Points[i].x = TempX;
		}
	}
	//moves the rocks
	Move() {
		this.x = this.x - Math.cos(this.SpeedAngle)*this.Speed;
		this.y = this.y - Math.sin(this.SpeedAngle)*this.Speed;
	}
	//checks if off screen and reverses speed
	OffScreen() {
		if(this.y - this.r < 0 || this.y + this.r > GameCanvas.height) {
			this.ReverseSpeed();} 
			else if(this.x + this.r > GameCanvas.width || this.x - this.r < 0) {
			this.SpeedAngle = this.SpeedAngle + 90;
			if(this.SpeedAngle > 360){this.SpeedAngle += -360;}
			}
		} 
	//uhhhhh
	UnOffScreen() {
		if(this.y > GameCanvas.height/10 && this.y < (GameCanvas.height/10)*9) {
			this.Change = true;
		}	
	}
 	//changes directory
	ReverseSpeed() {
		this.SpeedAngle = 360 - (this.SpeedAngle + 90);
		}
	//loops therw exact points and updates there position
	exactPoints() {
		for(let i = 0;i < this.n;i++) {
			this.ExactPoints[i].x = this.Points[i].x + this.x;
			this.ExactPoints[i].y = this.Points[i].y + this.y;
		}
	}
	TakeDamage(A,from) {
		if(this.State == "white") {
		this.State = "#FFAC1C"; 
		this.Change = true;
		this.Speed += - 1;
		this.SpeedAngle = A;
	} 
		else {
			this.Death(from);
			}
	}
	Death(from) {
		Diffuclty = Diffuclty - 0.01;
		this.isDead = true;
		if(Delay > 10) {Delay += -1;}
		DeathAnimation(this.x,this.y,15,8);
		if(from == 'P1') {Obj.score += 100;} else {Obj0.score += 100;}
	}
	UpdatesPixels() {		
			this.rPixels = [];
			for(let i = 0;i < this.ExactPoints.length-1;i++) {
			let Point1 = this.ExactPoints[i];
			let Point2 = this.ExactPoints[i + 1];
			this.rPixels = createLine(Point1,Point2,this.rPixels);
			}
			this.rPixels = createLine(
		 	this.ExactPoints[0],
			this.ExactPoints[this.ExactPoints.length-1],
			this.rPixels);
		}
	//checks if touching anouther rock	
	ColisionCheck()	{
		for(let i = 0;i < ObjList.length; i++) {
			let cur = ObjList[i];
			if(cur.isDead || cur.Type != "Rock") {return;}
			//pythagorean theorm to get the distance
			let Dist = Math.sqrt((cur.x - this.x)**2 + (cur.y - this.y)**2);
			if(Dist == 0) {continue;}
			if(Dist < this.r + cur.r) {
				//swaps trajectories
				let temp = this.SpeedAngle;
				this.SpeedAngle = ObjList[i].SpeedAngle;
				ObjList[i].SpeedAngle = temp;
			}
		}
	}
	}