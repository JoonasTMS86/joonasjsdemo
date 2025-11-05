const screenWidth                = 1910;
const screenHeight               = 909;
const rowStride                  = screenWidth * 4;
const bottomHalfOfScreen         = Math.floor(screenHeight / 2) + (screenHeight % 2);
const heightofBottomHalfOfScreen = screenHeight - bottomHalfOfScreen;
var canvas                       = document.getElementById("myCanvas");
var ctx                          = canvas.getContext("2d");
var imgData;

let Application = PIXI.Application,
	Container = PIXI.Container,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	TextureCache = PIXI.utils.TextureCache,
	Sprite = PIXI.Sprite;
let app = new Application(
{
	width: screenWidth, 
	height: screenHeight,
	antialiasing: false, 
	transparent: false, 
	resolution: 1,
	forceCanvas: true
}
);
loader
	.load(setup);

function setup() 
{
	state = play;
	app.ticker.add(delta => gameLoop(delta));
}

function updateStatus()
{
	requestAnimationFrame(updateStatus);
}

function gameLoop(delta)
{
	state(delta);
}

/*
	Make those pixels of the sprite that are of the given key RGB color, transparent.
*/
async function doSpriteTransparency(givenbufferctx, givenbuffer, givenpic, keyR, keyG, keyB)
{
	const sizeofit = 4 * givenbuffer.width * givenbuffer.height;
	for(var tpPos = 0; tpPos < sizeofit; tpPos += 4)
	{
		if(givenpic.data[tpPos] == keyR && givenpic.data[tpPos+1] == keyG && givenpic.data[tpPos+2] == keyB) givenpic.data[tpPos+3] = 0;
	}
	givenbufferctx.putImageData(givenpic, 0, 0);
}

window.onload = function() {
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for(var y = 0; y < screenHeight; y++) {
        for(var x = 0; x < screenWidth; x++) {
            imgData.data[(y * rowStride) + (x * 4) + 0] = 255;
            imgData.data[(y * rowStride) + (x * 4) + 1] = 255;
            imgData.data[(y * rowStride) + (x * 4) + 2] = 255;
            imgData.data[(y * rowStride) + (x * 4) + 3] = 255;
        }
    }
};

function play(delta)
{
    if(imgData != null) ctx.putImageData(imgData, 0, 0);
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	var r, g, b, step;
	step = 128;
	for(var pos = 0; pos < (heightofBottomHalfOfScreen * rowStride); pos += 4) {
		r = imgData.data[pos + 0];
		g = imgData.data[pos + 1];
		b = imgData.data[pos + 2];
		if(r > 0) {
			r -= step;
			if(r < 0) r = 0;
		}
		if(r < 0) {
			r += step;
			if(r > 0) r = 0;
		}
		if(g > 0) {
			g -= step;
			if(g < 0) g = 0;
		}
		if(g < 0) {
			g += step;
			if(g > 0) g = 0;
		}
		if(b > 255) {
			b -= step;
			if(b < 255) b = 255;
		}
		if(b < 255) {
			b += step;
			if(b > 255) b = 255;
		}
		imgData.data[pos + (bottomHalfOfScreen * rowStride) + 0] = r;
		imgData.data[pos + (bottomHalfOfScreen * rowStride) + 1] = g;
		imgData.data[pos + (bottomHalfOfScreen * rowStride) + 2] = b;
	}
}
