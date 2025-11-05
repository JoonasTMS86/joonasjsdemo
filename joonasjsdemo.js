const screenWidth                = 1910;
const screenHeight               = 909;
const rowStride                  = screenWidth * 4;
const bottomHalfOfScreen         = Math.floor(screenHeight / 2) + (screenHeight % 2);
const heightofBottomHalfOfScreen = screenHeight - bottomHalfOfScreen;
const scrollSpeed                = 2;
var gfxSlices                    = [];
var gfxSliceYOffsets             = [];
var testGfxScrolledWidth         = 0; // How much of the test graphics block we have scrolled into view.
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
	// Y positions: 0 to 200
	var dir = 0; // 0 = N, 1 = S
	var y = 100;
	var val = 1;
	var valDir = 0;
	var timeUnits = 9;
	var timeLeftUntilValueCanChange = timeUnits;
    for(var x = 0; x < screenWidth; x++) {
		gfxSliceYOffsets[x] = y;
		timeLeftUntilValueCanChange--;
		if(timeLeftUntilValueCanChange <= 0) {
			if(timeUnits > 0) {
				timeUnits--;
			}
			else {
				timeUnits = 9;
			}
			timeLeftUntilValueCanChange = timeUnits;
			if(dir == 0) {
				y -= val;
				if(valDir == 0) {
					val++;
					if(val >= 10) {
						valDir = 1;
					}
				}
				else {
					val--;
					if(val <= 0) {
						valDir = 0;
					}
				}
				if(y <= 0) {
					y = 0;
					valDir = 0;
					dir = 1;
				}
			}
			else {
				y += val;
				if(valDir == 0) {
					val++;
					if(val >= 10) {
						valDir = 1;
					}
				}
				else {
					val--;
					if(val <= 0) {
						valDir = 0;
					}
				}
				if(y >= 100) {
					y = 100;
					valDir = 0;
					dir = 0;
				}
			}
		}
	}
	// Height 227 * 4 RGB bytes * 1910 "slices" = 1,734,280 bytes
	for(var pos = 0; pos < 1734280; pos += 4) {
		gfxSlices[pos + 0] = 0;
		gfxSlices[pos + 1] = 0;
		gfxSlices[pos + 2] = 0;
		gfxSlices[pos + 3] = 0;
	}
};

function play(delta)
{
    if(imgData != null) ctx.putImageData(imgData, 0, 0);
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	for(var y = 0; y < 227; y++) {
		for(var x = 0; x < (screenWidth - scrollSpeed); x++) {
			gfxSlices[(y * 4) + (x * 908) + 0] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 0];
			gfxSlices[(y * 4) + (x * 908) + 1] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 1];
			gfxSlices[(y * 4) + (x * 908) + 2] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 2];
			gfxSlices[(y * 4) + (x * 908) + 3] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 3];
		}
	}
	for(var x = screenWidth - scrollSpeed; x < screenWidth; x++) {
		for(var y = 0; y < 227; y++) {
			if(testGfxScrolledWidth < 50) {
				gfxSlices[(y * 4) + (x * 908) + 0] = 255;
				gfxSlices[(y * 4) + (x * 908) + 1] = 0;
				gfxSlices[(y * 4) + (x * 908) + 2] = 0;
				gfxSlices[(y * 4) + (x * 908) + 3] = 1;
			}
			else {
				gfxSlices[(y * 4) + (x * 908) + 0] = 0;
				gfxSlices[(y * 4) + (x * 908) + 1] = 0;
				gfxSlices[(y * 4) + (x * 908) + 2] = 0;
				gfxSlices[(y * 4) + (x * 908) + 3] = 0;
			}
		}
	}

	var mem0 = gfxSliceYOffsets[0];
	var mem1 = gfxSliceYOffsets[1];
	var mem2 = gfxSliceYOffsets[2];
	for(var x = 0; x < screenWidth; x++) {
		for(var y = 0; y < 227; y++) {
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = 255;
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = 255;
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = 255;
		}
		if(x < (screenWidth - 3)) {
			gfxSliceYOffsets[x] = gfxSliceYOffsets[x + 3];
		}
		if(x == (screenWidth - 3)) {
			gfxSliceYOffsets[x] = mem0;
		}
		if(x == (screenWidth - 2)) {
			gfxSliceYOffsets[x] = mem1;
		}
		if(x == (screenWidth - 1)) {
			gfxSliceYOffsets[x] = mem2;
		}

		for(var y = 0; y < 227; y++) {
			if(gfxSlices[(y * 4) + (x * 908) + 3] == 0) {
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = 255;
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = 255;
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = 255;
			}
			else {
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = gfxSlices[(y * 4) + (x * 908) + 0];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = gfxSlices[(y * 4) + (x * 908) + 1];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = gfxSlices[(y * 4) + (x * 908) + 2];
			}
		}
	}

	var r, g, b, step;
	step = 128;
	for(var y = 0; y < heightofBottomHalfOfScreen; y++) {
		for(var x = 0; x < screenWidth; x++) {
			r = imgData.data[(y * rowStride) + (x * 4) + 0];
			g = imgData.data[(y * rowStride) + (x * 4) + 1];
			b = imgData.data[(y * rowStride) + (x * 4) + 2];
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
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 0] = r;
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 1] = g;
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 2] = b;
		}
	}
	if(testGfxScrolledWidth < 50) testGfxScrolledWidth++;
}
