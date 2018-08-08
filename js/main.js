var background;

function preload () { }

function create ()
{
    background = new Background();
}

function update() { 
    background.update();
}

class Background {
    constructor() {
        this.xscale = 300;
        this.yscale = 10;
        this.graphics = game.add.graphics(0, 0);
        this.beziers = [];
        this.true = [];
        var X, x, y = game.height / 2.0;
        var dx = game.width / this.xscale;
        for( var i=dx; i<game.width; i+=dx) {
            Array.prototype.push.apply( this.beziers, [
                (i - dx/2), y - this.yscale,
                (i - dx/2), y - this.yscale,
                i, y
            ]);
            Array.prototype.push.apply( this.true, [
                (i - dx/2), y - this.yscale,
                (i - dx/2), y - this.yscale,
                i, y
            ]);

        }
        Array.prototype.push.apply( this.beziers, [
            (game.width-dx/2), y - this.yscale,
            (game.width-dx/2), y - this.yscale,
            game.width, y
        ]);
        Array.prototype.push.apply( this.true, [
            (game.width-dx/2), y - this.yscale,
            (game.width-dx/2), y - this.yscale,
            game.width, y
        ]);

        this.draw();
    }

    draw() {
        this.graphics.clear();
        this.graphics.beginFill(0xFF33ff);
        this.graphics.moveTo( game.width, game.height/2 );
        this.graphics.lineTo( game.width, game.height );
        this.graphics.lineTo( 0, game.height );
        this.graphics.lineTo( 0, game.height/2 );
        for( var i=0; i<this.beziers.length; i+=6 ) {
            var bezier = this.beziers.slice( i, i+6 );
            this.graphics.bezierCurveTo( ...bezier );
        }
        this.graphics.endFill();
    }

    update() {
        var dx = game.width / ( 2 *this.xscale ) ;
        for( var i=0; i<this.beziers.length; i+=6 ) {
            var b = this.true[ i ];
            var min = b - dx;
            var max = b + dx;
            var B = this.beziers[ i ] + game.rnd.between( -2,2 ); 
            if( B < min )
                B = min;
            if( B > max )
                B = max;
            this.beziers[ i ] = B;
            this.beziers[ i + 2 ] = B;
        }
        this.draw();
    }
}
