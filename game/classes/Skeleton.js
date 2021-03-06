function Skeleton(userId,data){
    var self = this;
    this.id = userId;
    this.com = new TrackingPoint();
    this.head = new TrackingPoint();
    this.torso = new TrackingPoint();
    this.lHand = new TrackingPoint();
    this.rHand = new TrackingPoint();
    this.lKnee = new TrackingPoint();
    this.rKnee = new TrackingPoint();
    this.radius = 0;
    this.handOffset = {x:0,y:0};
    this.handAngles = {l:0,r:0};
    this.handDistance = {l:0,r:0,t:0};
    this.maxDistance = {l:0,r:0,t:0};
    this.normDistance = {l:0,r:0,t:0};
    
    //Events
    this.pause = function(){};
    this.changeDir = function(point,dir){};
    //Main update from osc
    this.update = function(data){
        var chunk = {
            x: data[1].value,
            y: data[2].value,
            z: data[3].value,
            px: data[4].value,
            py: data[5].value
        };
        self.lHand.update(chunk);
        chunk = {
            x: data[6].value,
            y: data[7].value,
            z: data[8].value,
            px: data[9].value,
            py: data[10].value
        };
        self.rHand.update(chunk);
        chunk = {
            x: data[11].value,
            y: data[12].value,
            z: data[13].value,
            px: data[14].value,
            py: data[15].value
        };
        self.torso.update(chunk);
        chunk = {
            x: data[16].value,
            y: data[17].value,
            z: data[18].value,
            px: data[19].value,
            py: data[20].value
        };
        self.head.update(chunk);
        chunk = {
            x: data[21].value,
            y: data[22].value,
            z: data[23].value,
            px: data[24].value,
            py: data[25].value
        };
        self.lKnee.update(chunk);
        chunk = {
            x: data[26].value,
            y: data[27].value,
            z: data[28].value,
            px: data[29].value,
            py: data[30].value
        };
        self.rKnee.update(chunk);
        
        this.handDistance.l = self.lHand.pos.dist(self.torso.pos);
        this.handDistance.r = self.rHand.pos.dist(self.torso.pos);
        this.handDistance.t = this.handDistance.l+this.handDistance.r;
        if (this.handDistance.l>this.maxDistance.l) this.maxDistance.l = this.handDistance.l;
        if (this.handDistance.r>this.maxDistance.r) this.maxDistance.r = this.handDistance.r;
        if (this.handDistance.t>this.maxDistance.t) this.maxDistance.t = this.handDistance.t;
        this.normDistance = {l:this.handDistance.l/this.maxDistance.l,r:this.handDistance.r/this.maxDistance.r,t:this.handDistance.t/this.maxDistance.t};
        
        //console.log(this.normDistance);
    };
    this.sendState = function(){
        var lx = self.lHand.x/stageWidth;
        var ly = self.lHand.y/stageHeight;
        var rx = self.rHand.x/stageWidth;
        var ry = self.rHand.y/stageHeight;
    }
}

function TrackingPoint(){
    var self = this;
    var inset = 15;
    this.bounds = {xMin:inset,xMax:stageWidth-inset,yMin:inset,yMax:stageHeight-inset};
    this.x = null;
    this.y = null;
    this.z = null;
    this.px = null;
    this.py = null;
    this.pos = Physics.vector(0,0);
    this.old = [];
    this.update = function(data){
        self.old.unshift({x:self.x,y:self.y,z:self.z,px:self.px,py:self.py,pos:self.pos});
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.px = data.px;
        this.py = data.py;
        this.pos = Physics.vector(self.x,self.y);
        var xMap = data.x/400;
        var yMap = data.y/350;
        var pxMap = (data.px/640) * stageWidth;
        var pyMap = (data.py/480) * stageHeight;
        this.x = center.x + (xMap*(stageWidth/1.2));
        this.y = center.y - (yMap*(stageHeight/1.2));
        this.checkBounds();
        
        //self.old = self.old.slice(0,10);
    }
    this.getDelta = function(framesAgo){
        if(framesAgo==null){framesAgo=0};
        if(self.old[framesAgo]!=null){
            var deltaX = self.x - self.old[framesAgo].x;
            var deltaY = self.y - self.old[framesAgo].y;
            return {x:deltaX,y:deltaY};
        }
        return {x:0,y:0};
    }
    this.checkBounds = function(){
        if (this.x < this.bounds.xMin) {
           this.x = this.bounds.xMin;
        }else if (this.x > this.bounds.xMax){
            this.x = this.bounds.xMax;
        }
        if (this.y < this.bounds.yMin) {
            this.y = this.bounds.yMin;
        }else if (this.y > this.bounds.yMax){
            this.y = this.bounds.yMax;
        }
    }
}

function newSkeleton(userId,data){
    var skeleton = new Skeleton(userId);
    skeleton.update(data);
    return skeleton;
}
function destroySkeleton(skeleton){
    
}