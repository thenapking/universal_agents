let groups = [];
let boundaries = [];
let numGroups = 7;
let minSize = 20;
let maxSize = 35;
const MIN_SIZE_C = 1;
const MAX_SIZE_C = 40;
const MIN_SIZE_D = 40
const MAX_SIZE_D = 120
const NUM_SEEDS_D = 100
let noiseScale = 0.025;
let STATE_INIT = 0;
let STATE_SEED = 1;
let STATE_GROW = 2;
let STATE_DONE = 3;
let current_state = STATE_INIT;
let NUM_SEEDS = 800

const CIRCLE_SPACING = 1.4;

let plants=[];

let W = 1000;
let H = 1200;
let CELL_SIZE = 50
let r = 5; // segment length, proportional w
let k = 20

let max_a = 0.01
let BRANCH_CUTOFF = 2

let palette_names, palette_name = "Pumpkin", palette;

function setup() {
  createCanvas(W, H);
  createBoundaries();
  // createEllipseGroups();
  // createCircularGroups();
  createLargeCircularGroup();

  pixelDensity(2);

  palette_names = Object.keys(palettes)
  palette = palettes[palette_name];
}

let t =0;
function draw() {
  background(palette.bg);
  stroke(palette.pen);


  fill(palette.bg);
  strokeWeight(1.5);

  for (let group of groups) {
    group.draw();
  }

  // t++
  // if(t>100) { noLoop(); }
  drawBranchingPlant();

  updateState();
}

function updateState(){
  switch(current_state){
    case STATE_INIT:
      let active = 0;

      for (let group of groups) {
        active += group.update();
      }

      if (active === 0) {
        console.log("All agents have come to rest.");
        current_state = STATE_SEED;
      }

      break;
    case STATE_SEED:
      console.log("Creating plant");
      // createPlant();
      createBranchingPlant();

      current_state = STATE_GROW;

      break;
    case STATE_GROW:
      // updateBranchingPlant();
      updatePlant();
      
      break;
    case STATE_DONE:

      noLoop();
      break;
  }
}

let large_circular_group;
function createLargeCircularGroup(){
  let center = createVector(width/2, height/2);
  large_circular_group = new CircularGroup(NUM_SEEDS_D, center, 0, [], MIN_SIZE_D, MAX_SIZE_D);
  large_circular_group.initialize();
  groups.push(large_circular_group);
}


function createPlant(){
  let kill_dist = 20
  let initial_radius = 5
  let max_angle = 0.01
  let max_dist = 60 // proportional to r and w
  let min_dist = 10

  for(let i = 0; i < 4; i++){
    console.log(`Creating plant ${i}`)
    let y = i<2 ? 0 : height
    let x = i%2==0 ? width*0.2 : width*0.8

    let xc = i%2==0 ? 0 : width
    let yc = i<2 ? height*0.075 : height*0.925
    let boundary = new Boundary("circle", {center: createVector(xc, yc), radius: W*0.8, mode: "contain"})
    plant = new Plant(boundary, kill_dist, min_dist, max_dist, max_angle)
    
    plant.initialize(x, y, initial_radius)

    for(let obj of circular_group.agents){
      plant.add_attractor(obj.pos.x, obj.pos.y, obj)
    }
    plant.create_trunk()
    plants.push(plant)
  }
}

function createBranchingPlant(){
  let kill_dist = 20
  let initial_radius = 5
  let max_angle = 0.01
  let max_dist = 100 // proportional to r and w
  let min_dist = 5
  
  for(let i = 0; i < 1; i++){
    console.log(`Creating plant ${i}`)
    let y = i<2 ? 0 : height
    let x = i%2==0 ? width*0.2 : width*0.8

    let xc = i%2==0 ? 0 : width
    let yc = i<2 ? height*0.075 : height*0.925
    let boundary = new Boundary("circle", {center: createVector(xc, yc), radius: W*2, mode: "contain"})
    plant = new Plant(boundary, kill_dist, min_dist, max_dist, max_angle)

    plant.initialize(x, y, initial_radius)
    for(let obj of large_circular_group.agents){
      plant.add_attractor(obj.pos.x, obj.pos.y, obj)
    }
    plant.create_trunk()
    plants.push(plant)
  }
}

function updatePlant(){
  for(let plant of plants){
    plant.grow()
    fill(palette.bg)
    stroke(palette.pen)
    plant.draw_attractors()
    plant.draw_segments(false)
  }
}

function updateBranchingPlant(){
  let active = 0
  for(let plant of plants){
    plant.grow()
    plant.draw_attractors()
    // noFill()
    // plant.draw_boundary()
    fill(palette.bg)
    stroke(palette.pen)
    // plant.draw_segments(false)
    if(plant.active){
      active++
    }
  }

  if(active === 0){
    for(let plant of plants){
      plant.create_branches() 
    }
    current_state = STATE_DONE
    console.log("All plants have finished growing.")
  }
}

function drawBranchingPlant(){
  for(let plant of plants){
    if(plant.active){
      plant.draw_segments(true)
    } else {
      plant.draw_segments(true)

      // plant.draw_simplified()
    }
  }
}



function keyPressed(){
  if(key == 's'){
    save("canopy.png");
  }
  
  if (key.toLowerCase() === "-" || key.toLowerCase() === "=") {  
    change_palette(key)
  } 
}
