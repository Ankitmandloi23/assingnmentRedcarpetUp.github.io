import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';




const addEntries=(student)=>{
var promise=new Promise((resolve)=>{
var dataString=`id=${student.id}&name=${encodeURIComponent(student.name)}&jobType=${student.jobType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${encodeURIComponent(student.salaryType)}`;
fetch("/addstudent",{
"method":"POST",
"headers":{
"content-Type":"application/x-www-form-urlencoded"
},
"body":dataString
}).then((response)=>{
return response.json();
}).then((responsejson)=>{resolve(responsejson);
});
});
return promise;
}

function getData(){
var promise=new Promise((resolve)=>{

fetch("/getstudent").then((response)=>{
return response.json();
}).then((stud)=>{
resolve(stud);
});
});
return promise;
}


const AppExample18=()=>{
 

const [students,setStudents]=React.useState([]);

React.useEffect(()=>{
getData().then((stud)=>{
setStudents(stud);
});				
},[]);	
	
	
			



const [activeMode,setActiveMode]=React.useState("view");

const ItemSelected=function(item){
if(item==='add') setActiveMode("add");
if(item==='cancel') setActiveMode("view");
}


const onStudentAdded=(student)=>{
if(student.jobType=="I") student.jobType="Internship";

else if(student.jobType=="F") student.jobType="Full Time";


if(student.salaryType=='Y')
{
if(student.salary>99000)
{
student.salary=(student.salary/1000000)+"lac per annum";
}
else
{
student.salary=student.salary+"per annum";
}
}
if(student.salaryType==='M')
{
if(student.salary>90000)
{
student.salary=(student.salary/100000)+"lac per month";
}
else
{
student.salary=student.salary+"per month";
}
}
students.push(student);
}


return(
    <center>
<div>
<h4>---(ASSINGMENT OF REDCARpetUP)---</h4>
<ToolComponent mode={activeMode} selectedButton={ItemSelected}/>
{ activeMode==='view' &&<StudentListComponent students={students} />}
{activeMode==='add' &&<StudentAddComponent onStudentAdded={onStudentAdded}/>}
</div>
</center>
)
}

const ToolComponent=({mode,selectedButton})=>{
const takeAction=(ev)=>{
selectedButton(ev.target.getAttribute("target_action"))
}
return(
<div>
{mode==='view' &&<button type='buitton' onClick={takeAction} target_action='add'>CLICK to ASSINGMENT Mode</button>}
<center>{mode==='add' &&<button type='buitton' onClick={takeAction} target_action='cancel'>CANCEL</button>}</center>
</div>
)
}


const StudentListComponent=({students})=>{
return(
<ul>
{
students.map((student)=>{
return(<div key={student.id}>
ID : {student.id}<br></br> 
NAME : {student.name}<br></br> 
JOBTYPE : {student.jobType} <br></br>
COMPANY : {student.company} <br></br>
SALARY : {student.salary} <br></br>
<hr/>
</div>)
})
}
</ul>

)
}

const StudentAddComponent=()=>{


const [id,setId]=React.useState("");
const [idError,setIdError]=React.useState("");

const [name,setName]=React.useState("");
const [nameError,setNameError]=React.useState("");

const [company,setCompany]=React.useState("");
const [companyError,setCompanyError]=React.useState("");

const [salary,setSalary]=React.useState(0);
const [salaryError,setSalaryError]=React.useState("");

const [jobType,setJobType]=React.useState("F");
const [fullTimeChecked,setfullTimeChecked]=React.useState("checked");
const [internShipChecked,setInternShipChecked]=React.useState("");

const [salaryType,setSalaryType]=React.useState("Y");
const [FormErrors,setFormErrors]=React.useState("");

const idChanged=(ev)=>{
setId(ev.target.value);
}

const nameChanged=(ev)=>{
setName(ev.target.value);
}

const companyChanged=(ev)=>{
setCompany(ev.target.value);
}

const salaryChanged=(ev)=>{
setSalary(ev.target.value);
}

const jobTypeChanged=(ev)=>{
if(ev.target.value=="F" && ev.target.checked)
{
setJobType("F");
setInternShipChecked("");
setfullTimeChecked("checked");
}
if(ev.target.value=="I" && ev.target.checked)
{
setJobType("I");
setInternShipChecked("checked");
setfullTimeChecked("");
}
}

const salaryTypeChanged=(ev)=>{
setSalaryType(ev.target.value);
}

const clearAllErrors=()=>
{
setIdError("");
setNameError("");
setCompanyError("");
setSalaryError("");
setFormErrors("");
}

const clearForm=()=>
{
setId(0);
setName("");
setJobType("F");
setfullTimeChecked("checked");
setInternShipChecked("");
setCompany("");
setSalary(0);
setSalaryType("Y");
}





const add=({onStudentAdded})=>{
clearAllErrors();
var hasErrors=false;
if(id=="" || id<=0)
{
setIdError(" * ");
hasErrors=true;
}
if(name=="")
{
setNameError(" * ");
hasErrors=true;
}
if(company=="")
{
setCompanyError(" * ");
hasErrors=true;
}
if(salary=="" && salary<=0)
{
setSalaryError(" * ");
hasErrors=true;
}
if(hasErrors==true) return;
var student={
"id":id,
"name":name,
"jobType":jobType,
"company":company,
"salary":salary,
"salaryType":salaryType
};

var add=addEntries(student);
add.then((responsejson)=>{
if(responsejson.success==true)
{
onStudentAdded(student);
clearForm();
}
else
{
setFormErrors(responsejson.error);
}
});
}


return(
    
<div>
<h3>---(ASSINGMENT OF REDCARpetUP)---</h3>
<div style={{color:'red'}}>{FormErrors}</div>
<label htmlFor='id'>ID : </label>
<input type='number' id='id' value={id} onChange={idChanged}/>
<span style={{color:'red'}}>{idError}</span>
<br></br>

<label htmlFor='name'>NAME : </label>
<input type='text' id='name' value={name} onChange={nameChanged}/>
<span style={{color:'red'}}>{nameError}</span><br></br>

<label htmlFor='company'>COMPANY : </label>
<input type='text' id='company' value={company} onChange={companyChanged}/>
<span style={{color:'red'}}>{companyError}</span><br></br>


JOBTYPE :
<input type='radio' name='jobType' id='fullTime' onChange={jobTypeChanged} value='F' checked={fullTimeChecked}/>Full Time &nbsp;&nbsp;&nbsp;
<input type='radio' name='jobType' id='internShip' onChange={jobTypeChanged} value='I' checked={internShipChecked}/>Internship <br></br>


<label htmlFor='salary'>SALARY : </label>
<input type='number' id='salary' value={salary} onChange={salaryChanged}/>&nbsp;&nbsp;
<span style={{color:'red'}}>{salaryError}</span>


<select id='salaryType' onChange={salaryTypeChanged} value={salaryType} >
<option value='Y'>Annual</option>
<option value='M'>Monthly</option>
</select><br></br>
<button type='button' onClick={add}>SaVe</button>
</div>
)
} 


export default AppExample18;