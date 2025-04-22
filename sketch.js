let song;
let fft;
let playButton;
let previousHeights = [];

//Preload Song 
function preload() {
  song = loadSound('Cocteau Twins - Heaven Or Las Vegas (Official Video).mp3');
}

//Setup
function setup() {
  //Create Canvas
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  fft = new p5.FFT();
  
  //Create Play button
  playButton = createButton("▶ Play");
  playButton.position(width / 2 - 40, height / 2 - 20);
  playButton.style("font-size", "20px");
  playButton.mousePressed(() => {
    if (!song.isPlaying()) {
      song.play();
      playButton.hide();
    }
  });
  for (let i = 0; i < 1024; i++) {
    previousHeights[i] = 0;
  }
}

//Visualizer
function draw() {
  background(0);
  
  //If song is playing, analyze frequency
  if (song.isPlaying()) {
    let spectrum = fft.analyze();
    noStroke();

    let half = spectrum.length / 2;
    for (let i = 0; i < half; i++) {
      let x = map(i, 0, half, 0, width / 2);
      let targetHeight = -height + map(spectrum[i], 0, 255, height, 0);

      let easedHeight = lerp(previousHeights[i], targetHeight, 0.1);

      previousHeights[i] = easedHeight;

      let hue   = map(i, 0, half, 0, 360);
      let sat   = 80;   
      let bright = 80;  
      fill(hue, sat, bright);

      
      rect(width / 2 - x, height, width / spectrum.length, easedHeight);
      rect(width / 2 + x, height, width / spectrum.length, easedHeight);
    }
  }
}

//Resize Canvas based on windo
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}