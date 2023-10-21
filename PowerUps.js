const Dir = 0;
function CreatPowerUp() {
		if(Dir == 0) {
			ObjList.push(new Sheild(0,
			Math.round(Math.random()*(GridY*85)+GridY*5),5,"Right",ObjList.length));
		}
}
//if the player touches this they can take 3 extra hits befor death
class Sheild {
	constructor(X,Y,SpeedX,EndP,Pos) {
		this.Type = "Sheild";
		this.pos = Pos;
		console.log
		this.x = X;
		this.y = Y;
		this.w = 25;
		this.h = 25;
		this.colour = "#33F8FF";
		this.speedX = 10;
		this.isDead = false;
		this.endP = EndP;
		this.a = 0;
		this.aChange = Math.random()/10;
		this.r = Math.round(
		(((this.x + this.w) - this.x)**2 + ((this.y + this.h) - this.y)**2)**0.5);
		this.Health = 3;
	}
	DrawSheild() {
		if(this.isDead) {return;}
		this.move();
		ctx.save();
		ctx.translate(this.x,this.y)
		ctx.rotate(this.a);
		ctx.strokeStyle = this.colour;
		ctx.strokeRect(this.w/-2,this.h/-2,this.w,this.h);
		ctx.restore();
		this.Colision();
	}
	move() {
		this.x += this.speedX;
		this.a += this.aChange;
	}
	//checks if touching player
	Colision() {
		let Dist = Math.round(((Obj.X - this.x)**2 + (Obj.Y - this.y)**2)**0.5);
		if(Dist < this.r) {
			this.isDead = true;
			Obj.powerUp = ObjList[this.pos];
		}
	}
	PlayerDraw(p) {
		let Dial = 1.15;
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 1;
		for(let i=0;i < this.Health;i++) {
			let j = 0;
			while(j < p.Points.length - 1) {
				ctx.moveTo(
					p.Points[j].x *Dial*(i+1), 
					p.Points[j].y *Dial*(i+1)
					);
				ctx.lineTo(
					p.Points[j + 1].x *Dial*(i+1),
					p.Points[j + 1].y *Dial*(i+1)
					);
				ctx.stroke();
				Obj.Pixels = LineToPixels(
					p.Points[j].x *Dial*(i+1),
					p.Points[j].y *Dial*(i+1),
					p.Points[j + 1].x *Dial*(i+1),
					p.Points[j + 1].y *Dial*(i+1),
					Obj.Pixels
					)
				j++;
			}
 				ctx.moveTo(
					p.Points[0].x *Dial*(i+1), 
					p.Points[0].y *Dial*(i+1)
					);
				ctx.lineTo(
					p.Points[4].x *Dial*(i+1),
					p.Points[4].y *Dial*(i+1)
					);
				ctx.stroke();
		}
	}
	CreateHitBox(p,points) {
		let j = 0;
		let Dial = 1.15;
		for(let i = 0;i<this.Health;i++) {
			while(j <points.length - 1) {
				p = LineToPixels(
					p[j].x *Dial*(i+1), 
					p[j].y *Dial*(i+1),
					p[j + 1].x *Dial*(i+1),
					p[j + 1].y *Dial*(i+1),
					p)
				j = j + 1;
			}
			j = 0;
		}
		return p;
	}
}