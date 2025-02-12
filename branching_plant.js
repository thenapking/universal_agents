class BranchingPlant extends Plant {
  constructor(boundary, kill_dist, max_angle) {
    super(boundary, kill_dist, max_angle);
    this.branches = [];
    this.simplifiedBranches = [];
  }
  
  create_branches(){
    this.assign_branch_ids();
    this.remove_empty_branches();
    this.rewrite_branch_ids();
    this.simplify_branches(10);
  }
  
  simplify_branches(threshold){
    this.simplifiedBranches = [];
    for (let i = 0; i < this.branches.length; i++){
      let branch = this.branches[i];
      

      if(i > 0){ 
        let last_segment = branch[branch.length - 1].parent;
        for(let j = 0; j < 3; j++){
          branch.push(last_segment);
          last_segment = last_segment.parent;
        }
      }

      let simplified = [];
      if(branch.length > 0){
        simplified.push(branch[0].position.copy());
        let lastPos = branch[0].position.copy();
        for (let j = 1; j < branch.length; j++){
          let currentPos = branch[j].position;
          if (p5.Vector.dist(currentPos, lastPos) > threshold){
            simplified.push(currentPos.copy());
            lastPos = currentPos.copy();
          }
        }
      }
      if(simplified.length > 1){
        this.simplifiedBranches.push(simplified);
      }
    }
  }
  
  draw_simplified(){
    noFill();
    stroke(0);
    strokeWeight(2)
    for(let pts of this.simplifiedBranches){
      if(pts.length < 4){
        beginShape();
        for(let pt of pts){
          vertex(pt.x, pt.y);
        }
        endShape();
      } else {
        beginShape();
        vertex(pts[0].x, pts[0].y);
        for(let i = 1; i <= pts.length - 3; i++){
          bezierVertex(pts[i].x, pts[i].y,
                       pts[i+1].x, pts[i+1].y,
                       pts[i+2].x, pts[i+2].y);
          i += 2;
        }
        endShape();
      }
    }
  }
  
  draw_branches(){
    noFill();
    for(let i = 0; i < this.branches.length; i++){
      this.draw_branch(i);
    }
  }
  
  draw_branch(i){
    let branch = this.branches[i];
    let last_segment = branch[branch.length - 1].parent;
    let parent_segment = last_segment.parent;
    beginShape();
    for (let j = 0; j < branch.length; j++){
      let s = branch[j];
      curveVertex(s.position.x, s.position.y);
    }
    curveVertex(last_segment.position.x, last_segment.position.y);
    if(parent_segment != null) { curveVertex(parent_segment.position.x, parent_segment.position.y); }
    endShape();
  }
  
  assign_branch_ids(){
    let current_branch_id = 0;
    for(let i = this.segments.length - 1; i > 0; i--){
      let segment = this.segments[i];
      current_branch_id = this.assign_branch_id(segment, current_branch_id);
    }
    return current_branch_id;
  }
  
  assign_branch_id(segment, current_branch_id = 0){
    if(this.branches[current_branch_id] == null){ this.branches[current_branch_id] = []; }
    if(segment.thickness > 1){
      if(segment.parent != null){
        if(segment.branch_id === null){
          segment.branch_id = current_branch_id;
          segment.type = "branch";
          this.branches[current_branch_id].push(segment);
          this.assign_branch_id(segment.parent, current_branch_id);
        }
        if(segment.parent.branch_id != null){
          current_branch_id++;
        }
      } else {
        segment.branch_id = 0;
        segment.type = "branch";
      }
    }
    return current_branch_id;
  }
  
  remove_empty_branches(){
    for(let i = this.branches.length - 1; i > 0; i--){
      let branch = this.branches[i];
      if(branch == null || branch.length < 5){
        this.branches.splice(i, 1);
      }
    }
  }
  
  rewrite_branch_ids(){
    for(let i = 0; i < this.branches.length; i++){
      let branch = this.branches[i];
      for(let j = 0; j < branch.length; j++){
        let segment = branch[j];
        segment.branch_id = i;
      }
    }
  }
}
