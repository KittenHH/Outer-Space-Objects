//each line in the explosion animation
class line {
	constructor(X1,Y1,X2,Y2,Angle) {
		this.x1 = X1;
		this.y1 = Y1;
		this.x2 = X2;
		this.y2 = Y2;
		this.a = Angle;
	}
}
class Explosion {
	constructor(X,Y,R,L,e) {
		this.tick = 0;
		this.x = X;
		this.y = Y;
		this.r = R;
		this.timer = 10;
		if(e) {this.timer = 20;}
		this.finished = false;
		//this the amount of lines
		this.l = L
		this.lines = [];
		this.GenrateLines();
		this.EndGame = e;
	}
	Draw() { 
		if(this.finished) {return;}
		ctx.save();
		ctx.translate(this.x,this.y);
		//explosions will be a series of lines expanding
		for(let i = 0;i < this.lines.length;i++) {
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.moveTo(this.lines[i].x1,this.lines[i].y1);
			ctx.lineTo(this.lines[i].x2,this.lines[i].y2);
			ctx.stroke();
			this.UpdateLines(i);
		}
		ctx.restore();
		this.tick = this.tick +1;
		if(this.tick == 10) {
			if(this.EndGame) {GameOver();
			ctx.clearRect(0,0,window.innerWidth,window.innerHeight);}
			 else {Effects.push(new Score(100,this.x,this.y,30));}
			this.finished = true;}
	}
	GenrateLines() {
		let Angle = 360/this.l;
		for(let i = 0;i < this.l-2;i++) {
			this.lines.push(new line(
				Math.cos(Angle*i)*this.r,
				Math.sin(Angle*i)*this.r,
				Math.cos(Angle*i)*(this.r*2),
				Math.sin(Angle*i)*(this.r*2),
				Angle*i
				));
		}
	}
	UpdateLines(pos) {
		this.lines[pos].x2 += Math.cos(this.lines[pos].a)*(this.r/3);
		this.lines[pos].y2 += Math.sin(this.lines[pos].a)*(this.r/3);
	}
}
class Score {
	constructor(value,X,Y,Size) {
		this.v = value;
		this.x = X;
		this.y = Y;
		this.timer = 30;
		this.finished = false;
		this.size = Size;
	}
	Draw() {
		if(this.finished) {return;}
		this.y = this.y -1;
		this.timer += -1;
		if(this.timer == 0) {this.finished = true;}
		ctx.textAlign = "center";
		ctx.font = this.size + "px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(this.v, this.x, this.y);
	}
}