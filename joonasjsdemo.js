// Each character is 227 x 227 and characters 32 - 127 (96 characters) are normally used in text.
const screenWidth                = 1910;
const screenHeight               = 909;
const rowStride                  = screenWidth * 4;
const bottomHalfOfScreen         = Math.floor(screenHeight / 2) + (screenHeight % 2);
const heightofBottomHalfOfScreen = screenHeight - bottomHalfOfScreen;
const scrollSpeed                = 5;
const characterWidth             = 227;
const scrollText                 = "Hi! I'm Joonas, the guy in the picture and the creator of this demo. Greetings to all software devs and other people of the IT industry. Greetings also to my family and friends all over the world. This scroll text will now loop. Bye.        ";
var imgData;
var scrollTextPos                = 0;
var gfxSlices                    = [];
var gfxScrolledWidth             = 0; // How much of the current graphics block we have scrolled into view.
var origImgBuffer                = document.getElementById("bgBuffer");
var origImgCtx                   = origImgBuffer.getContext("2d");
var origImgSdata                 = origImgCtx.createImageData(1910, 455);
var origImgSprite                = document.getElementById("bggfx");
var canvas                       = document.getElementById("myCanvas");
var ctx                          = canvas.getContext("2d");
var fontBuffer                   = document.getElementById("fontBuffer");
var fontCtx                      = fontBuffer.getContext("2d");
var fontSdata                    = fontCtx.createImageData(21792, 227);
var fontSprite                   = document.getElementById("font");
var gfxSliceYOffsets             = [
1, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 2, 3, 4, 5, 7, 8, 
9, 10, 12, 14, 15, 16, 18, 21, 
22, 24, 25, 26, 28, 29, 29, 30, 
32, 33, 33, 33, 34, 34, 35, 37, 
39, 41, 43, 44, 45, 46, 47, 48, 
49, 50, 50, 51, 53, 56, 57, 59, 
61, 62, 62, 63, 64, 65, 65, 66, 
67, 68, 68, 69, 70, 71, 73, 74, 
75, 76, 77, 78, 79, 80, 81, 82, 
82, 83, 85, 88, 89, 90, 91, 92, 
94, 96, 96, 97, 98, 98, 99, 100, 
101, 102, 102, 103, 103, 104, 105, 107, 
109, 110, 111, 112, 113, 113, 114, 114, 
115, 116, 118, 119, 119, 120, 122, 125, 
126, 127, 128, 128, 129, 129, 129, 130, 
130, 131, 132, 133, 133, 133, 134, 134, 
135, 135, 136, 136, 137, 138, 139, 140, 
141, 142, 143, 143, 144, 145, 146, 146, 
147, 148, 149, 150, 150, 151, 151, 152, 
153, 153, 153, 153, 153, 153, 154, 154, 
154, 154, 154, 154, 154, 154, 154, 155, 
155, 156, 156, 156, 156, 156, 157, 157, 
157, 157, 158, 158, 159, 159, 159, 159, 
159, 159, 159, 159, 160, 160, 161, 162, 
163, 164, 165, 165, 165, 166, 166, 166, 
166, 167, 167, 168, 168, 168, 168, 168, 
168, 168, 168, 168, 168, 169, 169, 169, 
170, 170, 171, 171, 171, 171, 171, 171, 
172, 172, 172, 173, 173, 174, 174, 174, 
174, 175, 175, 175, 175, 175, 175, 176, 
176, 177, 177, 177, 177, 177, 177, 177, 
177, 177, 178, 178, 178, 178, 178, 178, 
178, 178, 178, 178, 178, 178, 178, 178, 
178, 178, 178, 178, 178, 178, 178, 178, 
178, 178, 178, 178, 178, 178, 178, 179, 
179, 180, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 182, 182, 183, 183, 
183, 183, 183, 183, 183, 183, 183, 183, 
183, 183, 183, 183, 183, 183, 183, 183, 
183, 183, 183, 183, 183, 183, 183, 183, 
183, 183, 183, 183, 183, 183, 183, 183, 
183, 183, 183, 183, 183, 183, 183, 183, 
183, 182, 182, 182, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 181, 181, 181, 181, 181, 181, 
181, 181, 180, 180, 180, 180, 180, 180, 
180, 180, 180, 179, 179, 179, 178, 178, 
178, 178, 177, 176, 176, 175, 175, 174, 
174, 174, 174, 174, 173, 173, 172, 172, 
171, 171, 171, 170, 170, 169, 169, 169, 
169, 169, 169, 169, 169, 169, 168, 168, 
168, 168, 168, 168, 167, 167, 166, 166, 
165, 165, 164, 164, 164, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 162, 
162, 161, 161, 160, 160, 160, 159, 159, 
159, 158, 157, 157, 156, 156, 156, 156, 
156, 154, 153, 153, 152, 152, 151, 151, 
150, 150, 150, 149, 149, 147, 146, 146, 
145, 145, 145, 144, 143, 142, 142, 141, 
141, 140, 140, 139, 139, 138, 136, 135, 
134, 133, 133, 132, 132, 132, 131, 130, 
129, 128, 127, 126, 125, 124, 124, 123, 
122, 121, 120, 119, 118, 117, 117, 116, 
116, 115, 115, 114, 114, 113, 113, 112, 
112, 112, 111, 110, 109, 109, 108, 107, 
106, 105, 105, 104, 104, 103, 103, 103, 
103, 103, 102, 102, 101, 101, 100, 99, 
99, 98, 98, 97, 96, 96, 95, 95, 
95, 94, 94, 94, 93, 93, 92, 92, 
91, 89, 88, 88, 87, 87, 87, 87, 
87, 87, 86, 86, 85, 85, 85, 84, 
84, 84, 84, 84, 84, 83, 82, 82, 
81, 81, 81, 81, 80, 80, 79, 79, 
79, 79, 79, 78, 78, 77, 76, 75, 
75, 74, 74, 74, 73, 73, 73, 73, 
71, 70, 69, 69, 68, 68, 68, 67, 
67, 66, 66, 65, 65, 64, 64, 64, 
63, 63, 63, 62, 62, 61, 61, 60, 
60, 60, 59, 59, 58, 58, 58, 57, 
57, 56, 56, 55, 55, 55, 55, 54, 
54, 53, 53, 53, 52, 51, 50, 49, 
48, 48, 47, 47, 46, 46, 45, 45, 
44, 44, 43, 43, 42, 42, 42, 42, 
42, 41, 41, 40, 39, 39, 38, 38, 
37, 37, 37, 37, 37, 36, 35, 35, 
34, 34, 34, 33, 33, 33, 32, 32, 
31, 31, 31, 30, 30, 30, 29, 29, 
28, 28, 28, 28, 28, 28, 28, 28, 
27, 27, 27, 27, 27, 26, 26, 25, 
25, 24, 24, 24, 24, 24, 23, 23, 
23, 23, 22, 22, 22, 21, 21, 20, 
20, 20, 19, 19, 19, 19, 19, 19, 
18, 18, 18, 18, 17, 17, 16, 16, 
15, 15, 14, 14, 14, 13, 13, 13, 
13, 13, 13, 13, 13, 12, 12, 12, 
12, 12, 12, 12, 12, 12, 12, 12, 
12, 12, 11, 11, 10, 10, 10, 10, 
10, 10, 10, 10, 10, 10, 10, 10, 
10, 10, 10, 10, 9, 9, 9, 9, 
9, 9, 9, 9, 9, 9, 9, 9, 
9, 9, 9, 9, 9, 9, 9, 9, 
8, 8, 7, 7, 7, 7, 7, 7, 
7, 7, 7, 7, 7, 7, 7, 7, 
7, 7, 7, 7, 7, 7, 7, 7, 
7, 7, 7, 7, 6, 6, 5, 5, 
4, 4, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 3, 3, 3, 3, 3, 
3, 3, 3, 4, 4, 4, 4, 4, 
4, 4, 4, 4, 4, 4, 4, 4, 
4, 4, 5, 5, 6, 8, 10, 10, 
10, 10, 10, 10, 10, 10, 10, 10, 
10, 10, 10, 10, 10, 10, 10, 10, 
10, 10, 10, 10, 10, 10, 9, 9, 
9, 9, 9, 9, 9, 9, 9, 10, 
10, 11, 12, 12, 12, 12, 12, 12, 
12, 12, 12, 12, 12, 12, 12, 12, 
13, 13, 13, 13, 13, 13, 13, 13, 
13, 13, 13, 13, 13, 13, 13, 13, 
13, 13, 13, 14, 14, 15, 15, 15, 
15, 15, 15, 15, 15, 15, 15, 15, 
15, 15, 15, 15, 15, 15, 15, 15, 
15, 15, 15, 15, 15, 15, 15, 15, 
15, 15, 15, 15, 15, 14, 14, 14, 
14, 14, 14, 14, 14, 14, 14, 14, 
14, 14, 14, 14, 14, 14, 15, 15, 
15, 15, 15, 16, 16, 16, 16, 16, 
16, 16, 16, 16, 16, 16, 16, 16, 
16, 16, 16, 16, 16, 16, 16, 16, 
16, 16, 16, 16, 16, 16, 16, 16, 
16, 16, 16, 16, 16, 16, 16, 17, 
17, 18, 18, 18, 18, 18, 18, 18, 
18, 19, 19, 19, 19, 20, 20, 21, 
21, 22, 22, 23, 25, 26, 27, 27, 
28, 28, 28, 29, 29, 30, 30, 31, 
31, 32, 33, 33, 33, 33, 33, 33, 
33, 34, 34, 34, 35, 35, 35, 36, 
36, 36, 36, 36, 36, 36, 37, 37, 
37, 38, 38, 39, 40, 41, 42, 42, 
42, 42, 43, 43, 44, 46, 47, 48, 
49, 49, 49, 49, 49, 50, 50, 51, 
51, 51, 52, 52, 52, 52, 52, 52, 
52, 52, 52, 53, 53, 54, 54, 54, 
54, 55, 55, 56, 56, 57, 57, 58, 
59, 59, 60, 61, 62, 62, 63, 63, 
64, 64, 64, 65, 65, 66, 66, 66, 
66, 67, 67, 68, 68, 69, 69, 69, 
69, 69, 70, 70, 71, 72, 73, 75, 
78, 78, 78, 78, 78, 78, 78, 78, 
78, 79, 79, 79, 79, 79, 79, 80, 
80, 80, 81, 81, 82, 83, 83, 84, 
84, 84, 84, 84, 85, 85, 86, 86, 
87, 87, 88, 88, 89, 89, 90, 90, 
91, 92, 92, 93, 93, 94, 94, 94, 
95, 95, 95, 96, 96, 97, 98, 99, 
100, 101, 102, 102, 102, 102, 102, 102, 
102, 102, 102, 102, 102, 103, 103, 104, 
104, 105, 105, 106, 106, 106, 106, 106, 
107, 107, 108, 109, 109, 109, 109, 109, 
109, 109, 110, 110, 111, 111, 111, 111, 
112, 112, 113, 115, 115, 115, 115, 115, 
115, 115, 115, 115, 115, 115, 115, 116, 
116, 117, 118, 118, 119, 119, 120, 120, 
120, 120, 120, 121, 121, 121, 121, 122, 
122, 123, 123, 123, 123, 123, 124, 124, 
124, 125, 125, 126, 126, 127, 128, 129, 
129, 129, 129, 129, 130, 130, 130, 130, 
130, 130, 131, 131, 131, 131, 131, 131, 
131, 131, 131, 132, 132, 132, 133, 133, 
133, 133, 133, 133, 133, 133, 133, 133, 
134, 134, 135, 135, 135, 136, 136, 136, 
137, 137, 137, 137, 138, 138, 138, 138, 
138, 139, 139, 140, 140, 141, 141, 141, 
141, 141, 141, 141, 142, 142, 142, 142, 
142, 142, 142, 142, 143, 143, 144, 144, 
145, 145, 145, 146, 146, 146, 147, 147, 
148, 150, 150, 151, 151, 151, 151, 152, 
152, 153, 153, 153, 154, 154, 154, 154, 
155, 155, 156, 157, 157, 157, 158, 158, 
159, 159, 159, 159, 159, 159, 159, 159, 
159, 159, 159, 159, 158, 158, 158, 157, 
157, 157, 157, 157, 157, 157, 158, 158, 
159, 160, 162, 163, 163, 163, 163, 164, 
164, 165, 165, 165, 165, 166, 166, 166, 
166, 166, 165, 165, 165, 165, 165, 165, 
165, 165, 165, 164, 164, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 163, 163, 163, 163, 163, 
163, 163, 163, 164, 164, 165, 166, 166, 
166, 166, 166, 167, 167, 168, 168, 168, 
168, 168, 168, 168, 168, 168, 168, 168, 
168, 168, 168, 168, 168, 168, 168, 168, 
168, 168, 168, 168, 168, 168, 168, 168, 
168, 168, 168, 168, 168, 168, 168, 168, 
168, 168, 168, 167, 167, 166, 166, 166, 
166, 166, 166, 165, 165, 164, 163, 163, 
162, 162, 161, 161, 160, 160, 160, 160, 
160, 160, 160, 159, 159, 158, 157, 157, 
156, 156, 156, 156, 155, 155, 154, 154, 
153, 153, 153, 152, 152, 151, 151, 151, 
151, 151, 151, 151, 151, 150, 150, 150, 
149, 148, 148, 147, 146, 146, 145, 145, 
145, 144, 144, 144, 143, 142, 142, 141, 
141, 141, 140, 140, 139, 139, 139, 139, 
139, 138, 137, 136, 135, 134, 133, 133, 
132, 132, 132, 130, 129, 128, 128, 127, 
127, 127, 127, 126, 125, 124, 124, 123, 
122, 122, 121, 120, 119, 119, 118, 116, 
115, 115, 114, 114, 113, 112, 111, 111, 
110, 109, 108, 106, 105, 104, 102, 101, 
100, 99, 99, 98, 97, 96, 93, 91, 
90, 89, 89, 88, 88, 88, 87, 86, 
86, 85, 85, 84, 82, 81, 80, 79, 
78, 78, 77, 77, 76, 75, 74, 73, 
72, 71, 70, 69, 68, 67, 66, 66, 
64, 63, 62, 61, 60, 60, 59, 58, 
57, 57, 56, 56, 55, 54, 53, 52, 
51, 51, 50, 50, 49, 48, 47, 47, 
46, 45, 44, 44, 43, 43, 42, 41, 
41, 40, 40, 40, 40, 39, 38, 36, 
35, 34, 34, 33, 32, 31, 31, 30, 
29, 28, 27, 26, 24, 23, 22, 21, 
21, 17, 14, 12, 11, 11
];
var colorGradient = [];
var pixelDelta = [];

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

window.onload = function() {
	fontCtx.drawImage(fontSprite, 0, 0);
	ctx.drawImage(origImgSprite, 0, 0);
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	origImgCtx.drawImage(origImgSprite, 0, 0);
	// Height 227 * 4 RGB bytes * 1910 "slices" = 1,734,280 bytes
	for(var pos = 0; pos < 1734280; pos += 4) {
		gfxSlices[pos + 0] = 0;
		gfxSlices[pos + 1] = 0;
		gfxSlices[pos + 2] = 0;
		gfxSlices[pos + 3] = 0;
	}
	for(var pos = 0; pos < (heightofBottomHalfOfScreen * 3); pos += 3) {
		colorGradient[pos + 0] = 0;
		colorGradient[pos + 1] = 0;
		colorGradient[pos + 2] = 255;
	}
	var step = 192;
	var halfStep = 0;
	for(var pos = 0; pos < heightofBottomHalfOfScreen; pos++) {
		pixelDelta[pos] = step;
		halfStep++;
		if(halfStep >= 2) {
			halfStep = 0;
			if(step > 1) step--;
		}
	}
};

function play(delta)
{
    if(imgData != null) ctx.putImageData(imgData, 0, 0);
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	origImgSdata = origImgCtx.getImageData(0, 0, origImgBuffer.width, origImgBuffer.height);

	for(var y = 0; y < 227; y++) {
		for(var x = 0; x < (screenWidth - scrollSpeed); x++) {
			gfxSlices[(y * 4) + (x * 908) + 0] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 0];
			gfxSlices[(y * 4) + (x * 908) + 1] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 1];
			gfxSlices[(y * 4) + (x * 908) + 2] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 2];
			gfxSlices[(y * 4) + (x * 908) + 3] = gfxSlices[(y * 4) + ((x + scrollSpeed) * 908) + 3];
		}
	}
	var currX = gfxScrolledWidth;
	var charXOffset = (scrollText.charCodeAt(scrollTextPos) - 32) * 227;
	var characterSdata = fontCtx.getImageData(charXOffset, 0, 227, 227); // Get the current alphanumeric character.
	for(var x = screenWidth - scrollSpeed; x < screenWidth; x++) {
		for(var y = 0; y < 227; y++) {
			if(currX < characterWidth) {
				// Take the pixels from the font for the current character.
				// Character indices 0 to 95 correspond to ASCII characters 32 to 127.
				// 'A' = ASCII code 65
				// Char index code 65 - 32 = 33, meaning:
				// X offset 33 * 227 = 7491 in the font image file.
				if(characterSdata.data[(y * 908) + (currX * 4) + 0] == 0) {
					gfxSlices[(y * 4) + (x * 908) + 0] = 0;
					gfxSlices[(y * 4) + (x * 908) + 1] = 0;
					gfxSlices[(y * 4) + (x * 908) + 2] = 0;
					gfxSlices[(y * 4) + (x * 908) + 3] = 0;
				}
				else {
					gfxSlices[(y * 4) + (x * 908) + 0] = characterSdata.data[(y * 908) + (currX * 4) + 0];
					gfxSlices[(y * 4) + (x * 908) + 1] = characterSdata.data[(y * 908) + (currX * 4) + 1];
					gfxSlices[(y * 4) + (x * 908) + 2] = characterSdata.data[(y * 908) + (currX * 4) + 2];
					gfxSlices[(y * 4) + (x * 908) + 3] = 1;
				}
			}
			else {
				gfxSlices[(y * 4) + (x * 908) + 0] = 0;
				gfxSlices[(y * 4) + (x * 908) + 1] = 0;
				gfxSlices[(y * 4) + (x * 908) + 2] = 0;
				gfxSlices[(y * 4) + (x * 908) + 3] = 0;
			}
		}
		currX++;
	}

	var mem0 = gfxSliceYOffsets[0];
	var mem1 = gfxSliceYOffsets[1];
	var mem2 = gfxSliceYOffsets[2];
	var mem3 = gfxSliceYOffsets[3];
	var mem4 = gfxSliceYOffsets[4];
	var mem5 = gfxSliceYOffsets[5];
	var mem6 = gfxSliceYOffsets[6];
	var mem7 = gfxSliceYOffsets[7];
	for(var x = 0; x < screenWidth; x++) {
		for(var y = 0; y < 227; y++) {
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0];
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1];
			imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2];
		}
		if(x < (screenWidth - 8)) {
			gfxSliceYOffsets[x] = gfxSliceYOffsets[x + 8];
		}
		if(x == (screenWidth - 8)) {
			gfxSliceYOffsets[x] = mem0;
		}
		if(x == (screenWidth - 7)) {
			gfxSliceYOffsets[x] = mem1;
		}
		if(x == (screenWidth - 6)) {
			gfxSliceYOffsets[x] = mem2;
		}
		if(x == (screenWidth - 5)) {
			gfxSliceYOffsets[x] = mem3;
		}
		if(x == (screenWidth - 4)) {
			gfxSliceYOffsets[x] = mem4;
		}
		if(x == (screenWidth - 3)) {
			gfxSliceYOffsets[x] = mem5;
		}
		if(x == (screenWidth - 2)) {
			gfxSliceYOffsets[x] = mem6;
		}
		if(x == (screenWidth - 1)) {
			gfxSliceYOffsets[x] = mem7;
		}

		for(var y = 0; y < 227; y++) {
			if(gfxSlices[(y * 4) + (x * 908) + 3] == 0) {
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = origImgSdata.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2];
			}
			else {
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 0] = gfxSlices[(y * 4) + (x * 908) + 0];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 1] = gfxSlices[(y * 4) + (x * 908) + 1];
				imgData.data[((gfxSliceYOffsets[x] + y) * rowStride) + (x * 4) + 2] = gfxSlices[(y * 4) + (x * 908) + 2];
			}
		}
	}

	var r, g, b, pos1, pos2, pos3;
	pos1 = 0;
	pos2 = 1;
	pos3 = 2;
	for(var y = 0; y < heightofBottomHalfOfScreen; y++) {
		for(var x = 0; x < screenWidth; x++) {
			r = imgData.data[(y * rowStride) + (x * 4) + 0];
			g = imgData.data[(y * rowStride) + (x * 4) + 1];
			b = imgData.data[(y * rowStride) + (x * 4) + 2];
			if(r > colorGradient[pos1]) {
				r -= pixelDelta[y];
				if(r < colorGradient[pos1]) r = colorGradient[pos1];
			}
			if(r < colorGradient[pos1]) {
				r += pixelDelta[y];
				if(r > colorGradient[pos1]) r = colorGradient[pos1];
			}
			if(g > colorGradient[pos2]) {
				g -= pixelDelta[y];
				if(g < colorGradient[pos2]) g = colorGradient[pos2];
			}
			if(g < colorGradient[pos2]) {
				g += pixelDelta[y];
				if(g > colorGradient[pos2]) g = colorGradient[pos2];
			}
			if(b > colorGradient[pos3]) {
				b -= pixelDelta[y];
				if(b < colorGradient[pos3]) b = colorGradient[pos3];
			}
			if(b < colorGradient[pos3]) {
				b += pixelDelta[y];
				if(b > colorGradient[pos3]) b = colorGradient[pos3];
			}
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 0] = r;
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 1] = g;
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 2] = b;
			imgData.data[((screenHeight - 1 - y) * rowStride) + (x * 4) + 3] = 255;
		}
		pos1 += 3;
		pos2 += 3;
		pos3 += 3;
	}
	if(gfxScrolledWidth < characterWidth) {
		gfxScrolledWidth += scrollSpeed;
	}
	else {
		gfxScrolledWidth -= characterWidth;
		scrollTextPos++;
		if(scrollTextPos >= scrollText.length) {
			scrollTextPos = 0;
		}
	}
}
