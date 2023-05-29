import React,{useState,useEffect} from 'react'
import logo from './sorting-hat.png';
import './App.css';
import './index.css'
import {sort, find_ideal_assignment} from './sort.js'
import { cleanData } from './data-cleaning';
import { CSVLink } from "react-csv";
import { useCSVReader,lightenDarkenColor,formatFileSize } from 'react-papaparse';


import { IconButton, CircularProgress, Tooltip, Button} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { shadows } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import DataDashboard from './components/DataDashboard';

const GREY = '#CCC';
const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = '#686868';

const styles = {
  zone: {
    alignItems: 'center',
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  },
  file: {
    background: 'linear-gradient(to bottom, #EEE, #DDD)',
    borderRadius: 20,
    display: 'flex',
    height: 120,
    width: 120,
    position: 'relative',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: '0.5em',
    justifyContent: 'center',
    display: 'flex',
  },
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: '0.5em',
  },
  progressBar: {
    bottom: 14,
    position: 'absolute',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  zoneHover: {
    borderColor: GREY_DIM,
  },
  default: {
    borderColor: GREY,
  },
  remove: {
    height: 23,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 23,
  },
};

function App() {
  // Papaparse stuff
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  const [assignment, setAssignment] = useState(null)
  const [data, setData] = useState(null)
  const [idealSearch, setIdealSearch] = useState(false)
  const [searchFailed, setSearchFailed] = useState(false)
  const [exportAssignment, setExportAssignment] = useState([])
  const [filename, setFileName] = useState("cdl_teaching_assignments.csv")
  const [locks, setLocks] = useState({})
  const [dataInv, setDataInv] = useState(null)

  useEffect(()=>{
    if (data === null){
      setAssignment(null)
      setSearchFailed(false)
      setLocks({})
      setDataInv(null)
    }
    else{
      let temp_lock = {}
      for (const p in data){
        temp_lock[p] = null
      }
      setLocks({...temp_lock})
      let temp_datainv = {}
      for (const person in data) {
        data[person].forEach((s)=>{
          if (s in temp_datainv){
            temp_datainv[s].push(person)
          }
          else{
            temp_datainv[s] = [person]
          }
        })
      setDataInv({...temp_datainv})
    }

    }
  },[data])

  useEffect(() => {
    if (idealSearch === true) {
      setSearchFailed(false)
      const runBackground = async () => {
        try {
          const result = await find_ideal_assignment(data,locks);
          setAssignment(result);
          if (result === null){
            setSearchFailed(true)
          }
          setIdealSearch(false);
        } catch (error) {
          console.log("ERROR :(")
        }
      };
  
      runBackground();
    }
  }, [idealSearch, data,locks]);

  // Generate exportable CSV if assignment is made
  useEffect(()=>{
    let assignment_csv = []
    if(assignment!=null){
      for (const school in assignment) {
        let temp = []
        temp.push(school)
        let new_temp = temp.concat(assignment[school])
        assignment_csv.push(new_temp)
      }
      setExportAssignment(assignment_csv)
      const dateTimeOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      let currentDate = new Date();
      setFileName("cdl_teaching_assignments_"+currentDate.toLocaleString(undefined, dateTimeOptions)+".csv")
    }
  },[assignment])

  // Lock Teacher onClick function
  function lockTeacher(teacher, school){
    let temp_lock = {...locks}
    temp_lock[teacher] = school
    setLocks({...temp_lock})
  }

  // Unlock Teacher onClick function
  function unlockTeacher(teacher){
    let temp_lock = {...locks}
    temp_lock[teacher] = null
    setLocks({...temp_lock})
  }
  

  return (
    <div style={{textAlign:'center',marginTop:'30px'}}>
        <img src={logo} style={{width:130}}></img>
        <h1 style={{fontSize:"3rem",marginTop:"-10px"}}>Sorting Hat <span style={{fontSize:"1rem"}}>by CDL</span></h1>
        {data===null? <p style={{fontSize:"1.3rem",marginTop:"-20px"}}>Let the Sorting now begin.</p> : assignment===null&&!idealSearch&&!searchFailed?<p style={{fontSize:"1.3rem",marginTop:"-20px"}}>The hat is full of knowledge.</p>:idealSearch||searchFailed?<p style={{fontSize:"1.3rem",marginTop:"-20px"}}>Hmm, difficult... Very difficult...</p>:<p style={{fontSize:"1.3rem",marginTop:"-20px"}}>The hat became motionless once more.</p>}
        {data && <Tooltip title="Create Assignment" followCursor={true}><IconButton aria-label="create assignment" size="large" onClick={()=>{setAssignment(assignment => ({...sort(data, locks)})); setSearchFailed(false)}}>
          <AutoFixHighIcon fontSize="inherit" />
        </IconButton></Tooltip>}
        {data && 
        <Tooltip title="Search Ideal Assignment" followCursor={true}><IconButton aria-label="find ideal assignment" size="large" onClick={()=>{setIdealSearch(true)}}>
          <AutoAwesomeIcon fontSize="inherit" />
        </IconButton></Tooltip>}
        {assignment != null && 
      (
      <CSVLink data={exportAssignment} filename={filename}>
      <Tooltip title="Export Assignment as CSV" followCursor={true}><IconButton aria-label="Export Assignment" size="large">
        <FileDownloadIcon fontSize="inherit" />
      </IconButton></Tooltip></CSVLink>)}
      {data != null && 
      (<Tooltip title="Clear Data" followCursor={true}><IconButton aria-label="clear data" size="large" onClick={()=>{setData(null)}}>
        <DeleteIcon fontSize="inherit" />
      </IconButton></Tooltip>)}
        {searchFailed && <p style={{fontStyle:"italic"}}>- Unfortunately, the hat was unable to find an ideal sorting. -</p>}
        {data === null? <p>Upload a CSV file that meets the following&nbsp;
          <Popup contentStyle={{width:500, marginLeft:10}}trigger={<a href='#' style={{color:"#511660"}}>requirements</a>} position="right bottom">
            <div style={{margin:10}}>
              <h3>Room of Requirements</h3>
              <p>Each row of the CSV file should be a comma separated list of a school and people who signed up to teach at the school. <br></br> For example:<br></br><code>School A, Person1, Person2, Person3<br></br>School B, Person4, Person2, Person5<br></br>School C, Person1, Person3, Person5</code></p>
            </div>
            </Popup>.</p>: assignment == null&&!idealSearch? searchFailed?<p style={{marginBottom:400}}>Create an assignment or search again for an ideal assignment.</p>:<p style={{marginBottom:400}}>Create an assignment or search for an ideal assignment.</p> : !idealSearch?<p style={{fontStyle:"italic", marginBottom:20}}>- Ta Da! -</p>:<p></p>}
        {idealSearch && (
        <div style={{marginTop:"50px"}}>
          <CircularProgress color="secondary"/>
          <p style={{fontStyle:"italic",marginBottom:200}}>Scouring through the multiverse...</p>
          </div>)}
        {data===null && 
        (<div style={{width:"400px",height:"300px",margin:'auto', cursor:"pointer"}}>
           <CSVReader
           onUploadAccepted={(results) => {
             console.log('---------------------------');
             console.log(results);
             setData(cleanData(results))
             console.log('---------------------------');
             setZoneHover(false);
           }}
           onDragOver={(event) => {
             event.preventDefault();
             setZoneHover(true);
           }}
           onDragLeave={(event) => {
             event.preventDefault();
             setZoneHover(false);
           }}
         >
           {({
             getRootProps,
             acceptedFile,
             ProgressBar,
             getRemoveFileProps,
             Remove,
           }) => (
             <>
               <div
                 {...getRootProps()}
                 style={Object.assign(
                   {},
                   styles.zone,
                   zoneHover && styles.zoneHover
                 )}
               >
                 {acceptedFile ? (
                   <>
                     <div style={styles.file}>
                       <div style={styles.info}>
                         <span style={styles.size}>
                           {formatFileSize(acceptedFile.size)}
                         </span>
                         <span style={styles.name}>{acceptedFile.name}</span>
                       </div>
                       <div style={styles.progressBar}>
                         <ProgressBar />
                       </div>
                       <div
                         {...getRemoveFileProps()}
                         style={styles.remove}
                         onMouseOver={(event) => {
                           event.preventDefault();
                           setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                         }}
                         onMouseOut={(event) => {
                           event.preventDefault();
                           setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                         }}
                       >
                         <Remove color={removeHoverColor} />
                       </div>
                     </div>
                   </>
                 ) : (
                   'Drop CSV file into the hat here... 🔮'
                 )}
               </div>
             </>
           )}
         </CSVReader>
         </div>
         )
         }
         {data!=null && assignment!=null && !idealSearch &&
         <div style={{width:800, margin:"auto", marginBottom:30}}>
              <TableContainer component={Paper} sx={{ boxShadow: 3 }} style={{borderRadius:25}}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{borderColor:"white",fontFamily:"Open Sans", fontWeight:"bold", textAlign:"center"}}l>Schools</TableCell>
                    <TableCell style={{borderColor:"white",fontFamily:"Open Sans", fontWeight:"bold",textAlign:"center"}} colSpan={3} align="right">Assigned Teachers</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {Object.entries(assignment).map(([school, assigned_teachers]) => {return(
                  <TableRow
                    key={school}
                  >
                    <TableCell style={{borderColor:"white",fontFamily:"Open Sans"}}>
                      <Popup trigger={assigned_teachers.length>=2?<Button style={{marginLeft:10, color:"black"}}>✅ {school}</Button>:<Button style={{marginLeft:10, color:"black"}}>⚠️ {school}</Button>} position="left center">
                          <div style={{textAlign:"center"}}>
                          {dataInv[school].map((teacher)=>{
                            if (locks[teacher]!=null&&locks[teacher]===school){
                              return(<Button variant="text" style={{fontSize:"0.8rem", display:"block", margin:"auto"}} onClick={()=>{unlockTeacher(teacher)}}>🔒 <b>{teacher}</b></Button>)
                            }
                            else if(locks[teacher]!=null)
                              return(<Button variant="text" style={{fontSize:"0.8rem",  display:"block"}} onClick={()=>{lockTeacher(teacher,school)}}>🔐 {teacher} ➡️ <i style={{fontSize:"0.7rem"}}>({locks[teacher]})</i></Button>)
                            else{
                              return(<Button variant="text" style={{fontSize:"0.8rem", display:"block"}} onClick={()=>{lockTeacher(teacher,school)}}>🔓 {teacher}</Button>)
                            }
                          })}
                          </div>
                        </Popup>
                    </TableCell>
                    {assigned_teachers.map((teacher) => {return (
                      <TableCell style={{borderColor:"white",fontFamily:"Open Sans"}} component="th" scope="row" key={teacher}>
                        <Popup trigger={locks[teacher]!=null?locks[teacher]===school?<Button variant="text"><b>🔒{teacher}</b></Button>:<Button variant="text"><b>🔐{teacher}</b></Button>:<Button variant="text">{teacher}</Button>} position="right center">
                          <div style={{textAlign:"center"}}>
                          {data[teacher].map((school)=>{
                            return(<Button variant="text" style={{fontSize:"0.8rem", textAlign:"center"}} onClick={()=>{lockTeacher(teacher,school)}}>🔒 {school}</Button>)
                          })}
                          {locks[teacher]!=null&&<Button variant="text" style={{fontSize:"0.8rem", textAlign:"center"}} onClick={()=>{unlockTeacher(teacher)}}>🔓 Unlock</Button>}
                          </div>
                        </Popup>
                      </TableCell>)
                    })
                    }
                  </TableRow>
                )})}
              </TableBody>
              </Table>
            </TableContainer>
            </div>
         }
        {data!=null&&assignment!=null&&!idealSearch&&<DataDashboard data={data} assignment={assignment}/>}
        {data===null||assignment===null?<footer style={{marginTop:150}}>
        <p>© Copyright 2023 Sorting Hat by CDL</p>
        <p>a project developed for the <a href="https://www.cvilledebate.com" style={{color:"#511660"}} target="_blank" rel="noreferrer">Charlottesville Debate League</a> by <a href="https://tjvitchutripop.github.io/" style={{color:"#511660"}} target="_blank" rel="noreferrer">TJ Vitchutripop</a></p>
      </footer>:<footer style={{marginTop:60}}>
      <p>© Copyright 2023 Sorting Hat by CDL</p>
        <p>a project developed for the <a href="https://www.cvilledebate.com" style={{color:"#511660"}} target="_blank" rel="noreferrer">Charlottesville Debate League</a> by <a href="https://tjvitchutripop.github.io/" style={{color:"#511660"}} target="_blank" rel="noreferrer">TJ Vitchutripop</a></p>
      </footer>}
    </div>
  );
}

export default App;
