let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 7, refineLandmarks: false, flipHorizontal: false };

// Simulated database with 7 people
let peopleData = [
  { N: "Alice", A: 25, SCS: 700, CFO: 50000, DPV: 70000 },
  { N: "Bob", A: 35, SCS: 680, CFO: 30000, DPV: 50000 },
  { N: "Charlie", A: 40, SCS: 750, CFO: 80000, DPV: 120000 },
  { N: "David", A: 28, SCS: 720, CFO: 60000, DPV: 90000 },
  { N: "Eve", A: 30, SCS: 690, CFO: 40000, DPV: 60000 },
  { N: "Frank", A: 33, SCS: 710, CFO: 55000, DPV: 75000 },
  { N: "Grace", A: 27, SCS: 780, CFO: 65000, DPV: 95000 }
];

// Colors to randomly assign: Blue, Green, Red
let colorCycle = ["blue", "green", "red"];

// Frame counter for controlling reshuffle interval
let frameCounter = 0;

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // Set the canvas size to fit the window
  createCanvas(windowWidth, windowHeight);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);

  // Initial shuffle of data and colors
  shuffleDataAndColors();
}

function draw() {
  // Draw the webcam video, resizing to the canvas size
  image(video, 0, 0, width, height);

  // Update frame counter and reshuffle every 120 frames
  frameCounter++;
  if (frameCounter % 120 === 0) {
    shuffleDataAndColors();
  }

  // Draw a bounding box around each detected face and add labels
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let personData = peopleData[i % peopleData.length]; // Get random personal data from the shuffled array
    let color = colorCycle[i % colorCycle.length]; // Get random color from the shuffled array

    // Set the fill color for the bounding box and text based on the color
    if (color === "blue") {
      fill(0, 0, 255); // Blue
    } else if (color === "green") {
      fill(0, 255, 0); // Green
    } else if (color === "red") {
      fill(255, 0, 0); // Red
    }

    // Get the min and max x and y values to form the bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      minX = min(minX, keypoint.x);
      minY = min(minY, keypoint.y);
      maxX = max(maxX, keypoint.x);
      maxY = max(maxY, keypoint.y);
    }

    // Draw the bounding box with the random color
    noFill();
    stroke(color); // Apply the color to the bounding box
    strokeWeight(2);
    rect(minX, minY, maxX - minX, maxY - minY);

    // Display the person's information above the bounding box with matching color
    fill(color); // Set the text color to match the bounding box color
    noStroke();
    textSize(16);
    text(`N: ${personData.N}`, minX, minY - 80);
    text(`A: ${personData.A}`, minX, minY - 60);
    text(`SCS: ${personData.SCS}`, minX, minY - 40);
    text(`CFO: ${personData.CFO}`, minX, minY - 20);
    text(`DPV: ${personData.DPV}`, minX, minY);
  }
}

// Function to shuffle data and colors
function shuffleDataAndColors() {
  shuffle(colorCycle, true);
  shuffle(peopleData, true);
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

// Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}
