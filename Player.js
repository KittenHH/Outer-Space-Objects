//this keeps track of all of the player bullets
const PlayerBullets = [];
//code for the player obj
class Player {
	constructor(X,Y,Colour,ScoreBoard,KeyCodes,name) {
		this.name = name;
		this.kC = [];
		this.kC = KeyCodes;
		this.IsDead = false;
		this.X = X;
		this.Y = Y;
		this.ScoreB = ScoreBoard;
		//arr of points around 0,0
		this.Points = [
		new Point(-15,0),new Point(15,-10)
		,new Point(10,-5),new Point(10,5),new Point(15,10)];
		//arr of points aroudn X,Y
		this.ExactPoints = [
			new Point(this.Points[0].x + this.X,this.Points[0].y + this.Y),
			new Point(this.Points[1].x + this.X,this.Points[1].y + this.Y),
			new Point(this.Points[2].x + this.X,this.Points[2].y + this.Y),
			new Point(this.Points[3].x + this.X,this.Points[3].y + this.Y),
			new Point(this.Points[4].x + this.X,this.Points[4].y + this.Y),
		];
		//this keeps track of all the exactl pixels the polygon is taking up
		this.Pixels = [1,2,3];
		this.Colour = Colour;
		//this is used to make the phyisics feel more accurate
		this.FacingAngle = 0;
		this.SpeedAngle = 0;
		//each one of these will be true when there respective kew is pressed
		this.KeyPress = [false,false,false,false];
		this.Speed = 0;
		//keeps track of where the bullets will appear from the ship
		this.FirePoint = new Point(this.X + this.Points[0].x,this.Y + this.Points[0].y);
		//sets a cooldown so you can spam
		this.Cooldown = 0;
		this.score = 0;
		this.powerUp = null;

		//KeyListener
		document.addEventListener('keydown', (e) => {
			switch(e.keyCode) {
				case this.kC[0]:
				this.KeyPress[0] = true;
				break;
				case this.kC[1]:
				this.KeyPress[1] = true;
				break;
				case this.kC[2]:
				this.KeyPress[2] = true;
				break;
				case this.kC[3]:
				this.KeyPress[3] = this.Speed = 0;
				break;
			}
		});
				document.addEventListener('keyup', (e) => {
			switch(e.keyCode) {
				case this.kC[0]:
				this.KeyPress[0] = false;
				break;
				case this.kC[1]:
				this.KeyPress[1] = false;
				break;
				case this.kC[2]:
				this.KeyPress[2] = false;
				break;
				case this.kC[3]:
				this.KeyPress[3] = false;
				break;
				case this.kC[4]:
				this.FireBullet();
				break;
			}
		});
			}			
			//draws the player triangle and runs all the nesicary functions
			draw() {
			this.PowerUp();
			if(this.IsDead) {return;}
			//this is the cool down so your cant spam bullets
			this.Cooldown = this.Cooldown - 1;
			//all main functions
			this.KeyInput();
			this.Phyics();
			this.OffScreenCheck();
			this.UpdateFirePos();
			this.UpdateExactPos();
			this.CreatePixelArr();
			this.UpdateScore();
			//draws the polygon
		ctx.save();
		ctx.translate(this.X ,this.Y);
			for(let i = 1; i < this.Points.length; i++) {
				ctx.beginPath();
   				ctx.moveTo(this.Points[i - 1].x,this.Points[i - 1].y);
   				ctx.lineTo(this.Points[i].x,this.Points[i].y);
   				ctx.strokeStyle = "white";
   				ctx.lineWidth = 2;
				ctx.stroke();
			}
		ctx.beginPath();
   			ctx.moveTo(this.Points[0].x,this.Points[0].y);
   			ctx.lineTo(
   			this.Points[this.Points.length - 1].x,this.Points[this.Points.length - 1].y);
			ctx.stroke();
			ctx.restore();
	}
			//adds / subtractes from the angel
			rotate(deg) {
				//adds to the total angle
				this.FacingAngle += (deg) * Math.PI / 180; 
				 if(this.FacingAngle > 360) {
				 	this.FacingAngle = 0;
				 }
				//moves all the points in the points linst 
				for(let i = 0;i < this.Points.length;i++) {
				let TempX = (this.Points[i].x * Math.cos(deg * Math.PI / 180)) 
				 - (this.Points[i].y * Math.sin(deg * Math.PI / 180));

				this.Points[i].y = (this.Points[i].x * Math.sin(deg* Math.PI / 180))
				 + (this.Points[i].y * Math.cos(deg * Math.PI / 180));  
				 
				this.Points[i].x = TempX;
			}
		}
			//checks if one of keys is down and runs there func
			KeyInput() {
				if(this.KeyPress[0]) {this.rotate(-5);}
				if(this.KeyPress[1]) {this.rotate(5);}
				if(this.KeyPress[2]) {this.Move();} else {this.SlowDown();}
				if(this.KeyPress[3]) {}
			}
			//updates the positions every frame
			Phyics() {
				this.X = this.X + Math.cos(this.SpeedAngle)*this.Speed;
				this.Y = this.Y + Math.sin(this.SpeedAngle)*this.Speed;
			}
			//updates vars in key press
			Move() {
				this.SpeedAngle = this.FacingAngle;
				if(this.Speed > -3){this.Speed = this.Speed - 0.05;}
			}
			//slows the ship down
			SlowDown() {
				if(this.Speed > -1) {return;}
				this.Speed = this.Speed + 0.02;
			}
			//prevents you from flying off the screen
			OffScreenCheck() {
				if(this.X < 0) {this.X = (window.innerWidth/10)*9.9}
				else if (this.X > (window.innerWidth/10)*9.9) {this.X = 0;}	
				if(this.Y < 0) {this.Y = (window.innerHeight/10)*9.9} 
				else if (this.Y > (window.innerHeight/10)*9.9) {this.Y = 0;}	
			}
			FireBullet() {
				if(this.Cooldown > 0) {return;}
				this.Cooldown = 15;
				PlayerBullets.push(
				new Bullet
				(this.FirePoint.x,this.FirePoint.y,this.FacingAngle,-12,this.name));
			}
			//changes the angele used to dires
			UpdateFirePos() {
			this.FirePoint.x = this.X + this.Points[0].x;
			this.FirePoint.y = this.Y + this.Points[0].y;
			}
			//gets the position of the the points of how they are on screen
			UpdateExactPos() {
			this.ExactPoints = [
			new Point(this.Points[0].x + this.X,this.Points[0].y + this.Y),
			new Point(this.Points[1].x + this.X,this.Points[1].y + this.Y),
			new Point(this.Points[2].x + this.X,this.Points[2].y + this.Y),
			new Point(this.Points[3].x + this.X,this.Points[3].y + this.Y),
			new Point(this.Points[4].x + this.X,this.Points[4].y + this.Y),
		];	
			}
			//creates an array of all the pixels the polygon is using	
			CreatePixelArr() {
			this.Pixels = [];
			let Point1 = this.ExactPoints[0];
			let Point2 = this.ExactPoints[1];
			this.Pixels = createLine(Point1,Point2,this.Pixels);
			Point1 = this.ExactPoints[1];
			Point2 = this.ExactPoints[2];
			this.Pixels = createLine(Point1,Point2,this.Pixels);
			Point1 = this.ExactPoints[2];
			Point2 = this.ExactPoints[3];
			this.Pixels = createLine(Point1,Point2,this.Pixels);
			Point1 = this.ExactPoints[3];
			Point2 = this.ExactPoints[4];
			this.Pixels = createLine(Point1,Point2,this.Pixels);
			Point1 = this.ExactPoints[4];
			Point2 = this.ExactPoints[0];
			this.Pixels = createLine(Point1,Point2,this.Pixels);
			}
			//checks if the player is touching a rock
			ColisionCheck() {
				for(let i = 0;i < ObjList.length; i++) {
					if(ObjList[i].isDead || ObjList[i].Type != "Rock") {continue;}
					//pythagoen theorm to see how close rock is to player
					let cur = ObjList[i];
					let dist = ((this.X-cur.x)**2 + (this.Y-cur.y)**2)**0.5;
					if(dist < cur.r*2){
					let isHit = PtoPCheck(cur.rPixels,this.Pixels);
					if(isHit) {this.PlayerDeath();}}
				}
			}
			UpdateScore() {
				this.ScoreB.innerHTML = this.name + " Score: " + this.score;
			}
			PlayerDeath() {
			this.IsDead = true;
			Effects.push(new Explosion(this.X,this.Y,15,8,true)) 
			}
			PowerUp() {
				if(this.powerUp == null) {return;}
				switch(this.powerUp.Type) {
					case "Sheild":
						this.powerUp.PlayerDraw(Obj);
					this.Pixels = this.powerUp.CreateHitBox(this.Pixels,this.ExactPoints);
					break;
				}
			}
			}
class Bullet {
	constructor(X,Y,Angle,Speed,From) {
		this.x = X;
		this.y = Y;
		this.angle = Angle;
		this.isDead = false;
		this.speed = Speed;
		this.from = From;
	}
	DrawBullet() {
		if(this.isDead) {return;}
		this.RockCollision();
		this.move();
		ctx.fillStyle = "white";
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.beginPath();
		ctx.arc(0, 0, 3, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
	//moves the obj based on the angle
	move() {
		this.x = this.x + Math.cos(this.angle)*this.speed;
		this.y = this.y + Math.sin(this.angle)*this.speed;
	}
	//checks if hitting a rock
	RockCollision() {
		for(let i = 0;i < ObjList.length;i++) {
			if(ObjList[i].isDead == false && ObjList[i].Type == "Rock") {			
			let curr = ObjList[i];
			//pythagorean theorm to get distance
			let DistX = curr.x - this.x;
			let DistY = curr.y - this.y;
			let Dist = Math.sqrt(DistX**2 + DistY**2)
			//if Distance is less then radius then its a hit
			if(Dist < curr.r*2) {
				Obj.score = Obj.score + 25;
			
				ObjList[i].TakeDamage(this.angle,this.from);
				this.isDead = true;
			}}
		}
	}
	OffScreen() {
		if(this.x > GameCanvas.width || this.x < 0
			|| this.y < 0 || this.y > GameCanvas.height) {
			this.isDead = true;
		}
	}
}