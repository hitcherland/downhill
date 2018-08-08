var background, mountains, text, subtext;
var globalSpeed = 0.00001;

function preload () { 
    game.time.advancedTiming = true;
}

function create ()
{
    mountains = [ 
        new Mountain( 0x333333, game.height * 0.1, game.height * 0.4, 0.01, 0.05, 1),
        new Mountain( 0x666666, game.height * 0.3, game.height * 0.6, 0.01, 0.01, 2),
        new Mountain( 0x999999, game.height * 0.7, game.height * 0.9, 0.1, 0.01, 4 )
    ];

    text = game.add.text( 0, 0, "MOUNTAINS", { 
        "font": "5vw sans-serif", 
        "boundsAlignH": "center",
        "boundsAlignV": "middle",
        "strokeThickness": 4,
        "stroke": "#ffffff",
    } );
    text.centerX = game.width / 2;
    text.centerY = game.height / 2;

    text2 = game.add.text( 0, 0, "- trouble writ in stone -", { 
        "font": "2.1vw monospace", 
        "boundsAlignH": "center",
        "boundsAlignV": "middle",
        "strokeThickness": 3,
        "stroke": "#ffffff",
    } );
    text2.centerX = game.width / 2;
    text2.top = text.bottom - text.height * 0.1;
}

function update() { 
    game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    mountains.map( x=> x.update() );
}

class Mountain {
    constructor( color, minLimit, maxLimit, hResolution, vResolution, speed ) {
        this.hResolution = game.width * hResolution || 1;
        this.vResolution = vResolution || 0.01;
        this.color = color;
        this.speed = speed * game.width || 0.01;
        this.minLimit = minLimit;
        this.maxLimit = maxLimit;
   
        this.graphics = game.add.graphics(0, 0);
        this.points = [ game.width, game.height, 0, game.height ];
        this.height = game.rnd.between( minLimit, maxLimit )
        this.steepness = game.rnd.between( -game.height * this.vResolution, game.height * this.vResolution );

        Array.prototype.push.apply( this.points,  );
        for( var i=0; i<game.width + this.hResolution; i+= this.hResolution) {
            this.addPoint( i );
        }
        this.draw();
    }


    addPoint( x ) {
        this.steepness = game.rnd.between( -game.height * this.vResolution, game.height * this.vResolution );
        Array.prototype.push.apply( this.points, [ x, this.height ] );
        this.height += this.steepness;
        if ( this.height < this.minLimit ) {
            this.height = 2 * this.minLimit - this.height;
        }

        if ( this.height >= this.maxLimit ) {
            this.height = 2 * this.maxLimit - this.height;
        }
    }


    draw() {
        this.graphics.clear();
        this.graphics.beginFill( this.color );
        this.graphics.drawPolygon( this.points );
        this.graphics.endFill();
    }

    update() {
        var l = this.points.length;
        var cull = 0;
        for( var i = 4; i < l; i+= 2 ) {
            this.points[ i ] -= game.time.elapsed * this.speed * globalSpeed;
            if( this.points[ i ] < -this.hResolution ) {
                cull = i - 4;
            }
        }
        var end = this.points[ l - 2 ];
        this.points.splice( 4, cull );
        var i = 1;
        while( end + this.hResolution * i < game.width + this.hResolution ) {
            this.addPoint( end + this.hResolution * i );
            i++;
        }
        this.draw();
    }
}
