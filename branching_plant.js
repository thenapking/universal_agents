class BranchingPlant extends Plant {
  constructor(boundary, kill_dist, max_angle){
    super(boundary, kill_dist, max_angle);
    this.branches = []
  }

  assign_branch_ids(){
    console.log("assigning_branches")
    let current_branch_id = 0
    
    for(let i = this.segments.length-1; i > 0; i--){
      let segment = this.segments[i]


      current_branch_id = this.assign_branch_id(segment, current_branch_id)
      
    }
    return current_branch_id
  }

  assign_branch_id(segment, current_branch_id = 0){
    if(this.branches[current_branch_id] == null){ this.branches[current_branch_id] = [] }

    if(segment.thickness > 1){
      if(segment.parent != null){
        
        if(segment.branch_id === null){
          segment.branch_id = current_branch_id
          segment.type = "branch"
          this.branches[current_branch_id].push(segment)
          
          this.assign_branch_id(segment.parent, current_branch_id)
        }

        if(segment.parent.branch_id != null){
          current_branch_id++
        }

      } else {
        segment.branch_id = 0
        segment.type = "branch"
      }
    }

    return current_branch_id
  }

  remove_empty_branches(){
    console.log("removing empty branches")
    for(let i = this.branches.length-1; i > 0; i--){
      let branch = this.branches[i]
      if(branch == null || branch.length == 0){
        this.branches.splice(i, 1)
      }
    }
  }

  rewrite_branch_ids(){
    console.log("rewriting branches")
    for(let i = 0; i < this.branches.length; i++){
      let branch = this.branches[i]
      for(let j = 0; j < branch.length; j++){
        let segment = branch[j]
        segment.branch_id = i
      }
    }
  }

  create_branches(){
    console.log("creating branches")
    let results = []
    for(let i = 0; i < this.branches.length; i++){
      let branch = this.branches[i]
      let last_segment = branch[this.branches[i].length-1]
      let parent_branch_id = last_segment.parent.branch_id
      let branch_object = new Branch(i, parent_branch_id, this, this.branches[i])
      results.push(branch_object)
    }
    this.branches = results
  }
}
