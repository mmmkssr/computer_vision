// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/pqYYAImVv/";

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confianza = 0;

// Variables para animación relacionada con el carro de bombero
let flameX, flameY;
let flameSize = 50;
let flameVisible = false;
let flameOpacity = 255;

// Load the model first
function preload() {
  //cargar antes de comenzar a trabajar
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  // Posición inicial de la llama
  flameX = width / 2;
  flameY = height / 2 + 120;

  //flippedVideo = ml5.flipImage(video);
  // Start classifying
  classifyVideo();
}

function draw() {
  background(200, 182, 255);

  // Draw the video
  //image(video, 0, 0,);
  image(video, (width - 320) / 2, (height - 240) / 2);

  // Draw the label
  fill(157, 78, 221);
  textSize(25);
  textAlign(CENTER);
  text(label, width / 2, height - 40);

  //Texto confianza
  textSize(12);
  textAlign(LEFT);
  text(confianza, 10, height - 4);

  if (label == "carro" && confianza > 0.9) {
    filter(BLUR, 4);
    filter(GRAY);

    // Muestra la llama y realiza una animación de parpadeo
    flameVisible = true;

    // Controla el tamaño y opacidad de la llama para un efecto de parpadeo
    flameSize = 50 + sin(frameCount * 0.2) * 10; // Tamaño variable
    flameOpacity = 200 + sin(frameCount * 0.5) * 55; // Opacidad variable

    // Dibujar la llama
    fill(255, 100, 0, flameOpacity);
    ellipse(flameX, flameY, flameSize, flameSize);

    fill(255, 150, 0, flameOpacity);
    ellipse(flameX, flameY - 20, flameSize - 15, flameSize - 15);

    fill(255, 200, 0, flameOpacity);
    ellipse(flameX, flameY - 35, flameSize - 25, flameSize - 25);

    // Mensaje al detectar el carro
    fill(217, 4, 41);
    textSize(25);
    textAlign(CENTER);
    text("¡Bombero detectado!", width / 2, height / 2 + 200);
  } else {
    flameVisible = false;
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(video, gotResult);
}

// When we get a result
function gotResult(results, error) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  confianza = results[0].confidence;
  // Classifiy again!
  classifyVideo();
}
