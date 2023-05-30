import {Card, Grid, Tooltip} from '@mui/material';
import { shadows } from '@mui/system';
import {
    MinPriorityQueue, MaxPriorityQueue
  } from '@datastructures-js/priority-queue';

function DataDashboard(props){
    function mostFlexible(){
        const person_queue = new MaxPriorityQueue((person) => person.availability)
        for (const person in props.data) {
            person_queue.enqueue({name:person,availability:props.data[person].length})
        }
        let list = []

        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        return (<div>
         <Tooltip title={list[0].availability+" schools"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[0].name}</p></Tooltip>,&nbsp;
          <Tooltip title={list[1].availability+" schools"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[1].name}</p></Tooltip>,&nbsp; 
         <Tooltip title={list[2].availability+" schools"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[2].name}</p></Tooltip>,&nbsp; 
         <Tooltip title={list[3].availability+" schools"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[3].name}</p></Tooltip>,&nbsp; 
         <Tooltip title={list[4].availability+" schools"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[4].name}</p></Tooltip>&nbsp;
         </div>
        )
    }

    function leastFlexible(){
        const person_queue = new MinPriorityQueue((person) => person.availability)
        for (const person in props.data) {
            person_queue.enqueue({name:person,availability:props.data[person].length})
        }
        let list = []

        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        return (<div>
            <Tooltip title={list[0].availability+" school(s)"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[0].name}</p></Tooltip>,&nbsp;
             <Tooltip title={list[1].availability+" school(s)"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[1].name}</p></Tooltip>,&nbsp; 
            <Tooltip title={list[2].availability+" school(s)"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[2].name}</p></Tooltip>,&nbsp; 
            <Tooltip title={list[3].availability+" school(s)"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[3].name}</p></Tooltip>,&nbsp; 
            <Tooltip title={list[4].availability+" school(s)"} followCursor={true}><p style={{display:"inline-block",cursor:"pointer"}}>{list[4].name}</p></Tooltip>&nbsp;
            </div>)
    }

    function largestTeams(){
        const person_queue = new MaxPriorityQueue((person) => person.availability)
        for (const person in props.assignment) {
            person_queue.enqueue({name:person,availability:props.assignment[person].length})
        }
        let list = []

        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        return (<div>
        <Tooltip title={list[0].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>1. {list[0].name}</p></Tooltip>
        <Tooltip title={list[1].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>2. {list[1].name}</p></Tooltip>
        <Tooltip title={list[2].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>3. {list[2].name}</p></Tooltip>
        <Tooltip title={list[3].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>4. {list[3].name}</p></Tooltip>
        <Tooltip title={list[4].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>5. {list[4].name}</p></Tooltip>
         </div>
        )
    }

    function smallestTeams(){
        const person_queue = new MinPriorityQueue((person) => person.availability)
        for (const person in props.assignment) {
            person_queue.enqueue({name:person,availability:props.assignment[person].length})
        }
        let list = []

        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        list.push(person_queue.dequeue())
        return (<div>
        <Tooltip title={list[0].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>1. {list[0].name}</p></Tooltip>
        <Tooltip title={list[1].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>2. {list[1].name}</p></Tooltip>
        <Tooltip title={list[2].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>3. {list[2].name}</p></Tooltip>
        <Tooltip title={list[3].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>4. {list[3].name}</p></Tooltip>
        <Tooltip title={list[4].availability+" teachers"} followCursor={true}><p style={{cursor:"pointer"}}>5. {list[4].name}</p></Tooltip>
            </div>)
    }

    function calculateAverageTeachers(){
        let sum = 0.0
        let counter = 0.0
        for (const school in props.assignment){
            sum+=props.assignment[school].length
            counter++
        }
        return (sum/counter).toFixed(3)
    }

    return(
        <div style={{ width:800,margin:"auto",marginBottom:30}}>
            <h1 style={{marginBottom:40, marginTop:40}}>~ Tidbits of Knowledge ~</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>5 Most Flexible Teachers</p>
                    <h3>{mostFlexible()}</h3>
                    </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>Number of Unique Teacher Sign-Ups</p>
                    <h1 style={{display:"inline"}}>{Object.keys(props.data).length}</h1><h4 style={{display:"inline"}}>&nbsp;&nbsp;teachers</h4>
                    </div>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>Average Number of Teachers Per Team</p>
                    <h1 style={{display:"inline"}}>{calculateAverageTeachers()}</h1><h4 style={{display:"inline"}}>&nbsp;&nbsp;teachers/class</h4>
                    </div>
                    </Card>
                </Grid>
                <Grid item xs={8}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>5 Least Flexible Teachers</p>
                    <h3>{leastFlexible()}</h3>
                    </div>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>Top 5 Largest Teams</p>
                    <h3>{largestTeams()}</h3>
                    </div>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ boxShadow: 3 }} style={{borderRadius:20}}>
                    <div style={{margin:10}}>
                    <p>Top 5 Smallest Teams</p>
                    <h3>{smallestTeams()}</h3>
                    </div>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}
export default DataDashboard;