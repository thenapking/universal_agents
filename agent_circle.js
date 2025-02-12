class CircularGroup extends Group {
  constructor(n, center, radius, boundaries, minSize, maxSize) {
    super(n, center, radius, boundaries);
    this.minSize = minSize;
    this.maxSize = maxSize;
  }

  initialize() {
    for (let i = 0; i < this.n; i++) {
      let x = random(this.center.x*0.2, this.center.x*1.8)
      let y = random(this.center.y*0.2, this.center.y*1.8)
      this.agents.push(new CircularAgent(createVector(x, y), this.minSize, this.maxSize));
    }
  }

  update(){
    let active = 0;
    for (let agent of this.agents) {
      this.enforce_boundaries(agent);
      let sep = agent.separation(this.agents);
      agent.set_size();
      agent.applyForce(sep);
      agent.update();
      if (agent.active) active++;
    }
    return active;
  }
}

class CircularAgent extends Agent {
  constructor(pos, minSize, maxSize) {
    super(pos);
    this.minSize = minSize;
    this.maxSize = maxSize;
  }

  set_size() {
    let nz = noise(this.pos.x * noiseScale, this.pos.y * noiseScale);
    this.size = lerp(this.minSize, this.maxSize, nz);
  }

  draw() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

let circular_group;

function createCircularGroups(){
  let boundsArr = [];
  for(let bound of boundaries){
    let center = bound.center.copy();
    let radius = bound.radius*CIRCLE_SPACING;
    let boundary = new Boundary("circle", {center: center, radius: radius, mode: "exclude"});
    boundsArr.push(boundary);
  }
  let center = createVector(width/2, height/2);
  circular_group = new CircularGroup(NUM_SEEDS, center, 0, boundsArr, MIN_SIZE_C, MAX_SIZE_C);
  circular_group.initialize();
  groups.push(circular_group);
}

