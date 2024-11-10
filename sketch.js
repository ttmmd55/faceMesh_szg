let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 7, refineLandmarks: false, flipHorizontal: false };

// Simulated database with 7 people
let peopleData = [
  { N: "Laosi Niu", A: 39, SCS: 742, CFO: 6790, DPV: 47842 },
  { N: "Laoban Dai", A: 35, SCS: 432, CFO: 617890891, DPV: 831390 },
  { N: "Shuai Guo", A: 24, SCS: 542, CFO: 21736, DPV: 3179210 },
  { N: "Mei Lu", A: 28, SCS: 446, CFO: 745002, DPV: 93628114 },
  { N: "Penyou Xiao", A: 11, SCS: 830, CFO: 232, DPV: 745752 },
  { N: "Lingdao Su", A: 53, SCS: 311, CFO: 5324560, DPV: 6185732 },
  { N: "Jingli Zhong", A: 47, SCS: 395, CFO: 31754, DPV: 412022132 }
];

// Colors to cycle through: Blue, Green, Red
let colorCycle = ["blue", "green", "red"];

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
}

function draw() {
  // Draw the webcam video, resizing to the canvas size
  image(video, 0, 0, width, height);

  // Draw a bounding box around each detected face and add labels
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    let personData = peopleData[i % peopleData.length]; // Get corresponding personal data

    // Cycle through the colors: Blue, Green, Red
    let color = colorCycle[i % colorCycle.length];
    
    // Set the fill color for the bounding box
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

    // Draw the bounding box with the selected color
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
