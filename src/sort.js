import {
    MinPriorityQueue
  } from '@datastructures-js/priority-queue';

//Durstenfeld shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function sort(data,locks={}){
    const num_assigned = {}
    const local_assignment = {}
    const person_queue = new MinPriorityQueue((person) => person.availability)
    
    for (const person in data) {
        if (!(person in locks && locks[person]!=null)){
        person_queue.enqueue({name:person,availability:data[person].length})
        }
        data[person].forEach((s)=>{
            num_assigned[s] = 0
            local_assignment[s] = []
        })
    }

    for (const p in locks){
        if (p in locks && locks[p]!=null){
            local_assignment[locks[p]].push(p)
            num_assigned[locks[p]]++
        }
    }

    while (!person_queue.isEmpty()){
        let same_priority_persons = []
        let person_1 = person_queue.dequeue()
        let person_1_name = person_1.name
        same_priority_persons.push(person_1_name)
        let check_next_1 = true
        while (check_next_1){
            if (!person_queue.isEmpty() && person_queue.front().availability === person_1.availability){
                person_1 = person_queue.dequeue()
                person_1_name = person_1.name
                same_priority_persons.push(person_1_name)
            }
            else{
                check_next_1 = false
            }
        }
        shuffleArray(same_priority_persons)
        same_priority_persons.forEach((person)=>{
            let temp_queue = new MinPriorityQueue((school) => school.assigned)
            let selections = [...data[person]]
            shuffleArray(selections)
            console.log(person)
            console.log(selections)
            console.log("---------------------")
            selections.forEach((school)=>{
                temp_queue.enqueue({name:school,assigned:num_assigned[school]})
            })
            let school_assigned = temp_queue.dequeue().name
            num_assigned[school_assigned] += 1
            local_assignment[school_assigned].push(person)
        })
    }

    return local_assignment
    
}

export function is_ideal_assignment(assignment){
    let ideal = true
    for (const school in assignment) {
        if (assignment[school].length<2){
            ideal = false
            break
        }   
    }
    return ideal
}

export async function find_ideal_assignment(data, locks={}) {
    return new Promise((resolve, reject) => {
      let isTimeout = false;
  
      // Set a timeout to stop the background execution after 30 seconds (30,000 milliseconds)
      const timeout = setTimeout(() => {
        // Stop the background execution
        //console.log("Background execution stopped.");
        isTimeout = true;
        resolve(null);
      }, 30000);
  
      // Perform your background tasks here
      //console.log("Running in the background...");
  
      function checkIdealAssignment() {
        if (isTimeout) {
          clearTimeout(timeout); // Clear the timeout
          return;
        }
  
        let assignment = sort(data, locks);
        if (is_ideal_assignment(assignment)) {
          clearTimeout(timeout); // Clear the timeout as the ideal assignment is found
          resolve(assignment);
        } else {
          // Continue checking for the ideal assignment
          setTimeout(checkIdealAssignment, 1000); // Adjust the delay as per your requirements
        }
      }
  
      checkIdealAssignment(); // Start checking for the ideal assignment
    });
  }