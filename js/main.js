var background, mountains, text, subtext;
var globalSpeed = 0.00001;

function preload () { 
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    game.time.advancedTiming = true;
}

function create ()
{
    mountains = [ 
        new Mountain({ "color": 0x333333, 
						"minLimit": 0.1,
						"maxLimit": 0.4,
						"hResolution": 0.01, 
						"vResolution": 0.05,
						"speed": 1
		}),
        new Mountain( 0x666666, 0.3, 0.6, 0.01, 0.01, 2),
        new Mountain( 0x999999, 0.7, 0.9, 0.1, 0.01, 4 )
    ];

    text = game.add.text( 0, 0, "MOUNTAINS", { 
        "font": "5vmin sans-serif", 
        "boundsAlignH": "center",
        "boundsAlignV": "middle",
        "strokeThickness": 4,
        "stroke": "#ffffff",
    } );

    text2 = game.add.text( 0, 0, "- trouble writ in stone -", { 
        "font": "2.1vmin monospace", 
        "boundsAlignH": "center",
        "boundsAlignV": "middle",
        "strokeThickness": 3,
        "stroke": "#ffffff",
    } );

    text.centerX = game.width / 2;
    text.centerY = game.height / 2;

    text2.centerX = game.width / 2;
    text2.top = text.bottom - text.height * 0.1;
}

function update() { 
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    mountains.map( x=> x.update() );
}

function resize() {
    mountains.map( x=> x.resize() );
	text.updateText();
	text2.updateText();
	text.centerX = game.width / 2;
	text.centerY = game.height / 2;

	text2.centerX = game.width / 2;
	text2.top = text.bottom - text.height * 0.1;

}

class Mountain {
    constructor( color, minLimit, maxLimit, hResolution, vResolution, speed ) {
		if( typeof( color ) == "object" ) {
			hResolution = color.hResolution;
			vResolution = color.vResolution;
			speed = color.speed;
			minLimit = color.minLimit;
			maxLimit = color.maxLimit;
			color = color.color;
		}	
        this.hResolution = hResolution || 0.01;
        this.vResolution = vResolution || 0.01;
        this.color = color || 0xff00ff;
        this.speed = speed || 0.01;
        this.minLimit = minLimit || 0;
        this.maxLimit = maxLimit || 1;
   
        this.graphics = game.add.graphics(0, 0);
        this.relPoints = [ 1, 1, 0, 1 ];
        this.height = game.rnd.realInRange( this.minLimit, this.maxLimit )
        this.steepness = game.rnd.realInRange( -this.vResolution, this.vResolution );

        for( var i=0; i< 1 + this.hResolution; i+= this.hResolution) {
            this.addPoint( i );
        }
        this.draw();
    }

	updatePointsFromRel() {
		this.points = this.relPoints.map( ( x, i ) => i % 2 == 0 ? x * game.width : x * game.height );
	}

    addPoint( x ) {
        this.steepness = game.rnd.realInRange( -this.vResolution, this.vResolution );
        Array.prototype.push.apply( this.relPoints, [ x, this.height ] );
        this.height += this.steepness;
        if ( this.height < this.minLimit ) {
            this.height = 2 * this.minLimit - this.height;
        }

        if ( this.height >= this.maxLimit ) {
            this.height = 2 * this.maxLimit - this.height;
        }
    }

    draw() {
		this.updatePointsFromRel();
        this.graphics.clear();
        this.graphics.beginFill( this.color );
        this.graphics.drawPolygon( this.points );
        this.graphics.endFill();
    }

    update() {
        var l = this.relPoints.length;
        var cull = 0;
        for( var i = 4; i < l; i+= 2 ) {
            this.relPoints[ i ] -= game.time.elapsed * this.speed * globalSpeed;
            if( this.relPoints[ i ] < -this.hResolution ) {
                cull = i - 4;
            }
        }
        var end = this.relPoints[ l - 2 ];
        this.points.splice( 4, cull );
        var i = 1;
        while( end + this.hResolution * i < 1 + this.hResolution ) {
            this.addPoint( end + this.hResolution * i );
            i++;
        }
        this.draw();
    }

	resize() {
        this.draw();
	}
}
