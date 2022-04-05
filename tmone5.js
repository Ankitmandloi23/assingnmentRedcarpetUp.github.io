const express=require('express');
const app=express();
const port=5050;
const oracle=require('oracledb');
const bodyParser=require('body-parser');

const bodyParserUrlEncoded=bodyParser.urlencoded({extended:false});

class student
{
constructor(id,name,jobType,company,salary)
{
this.id=id;
this.name=name;
this.jobType=jobType;
this.company=company;
this.salary=salary;
}
}


app.post("/addstudent",bodyParserUrlEncoded,async function(request,response){

var id=request.body.id;
var name=request.body.name;
var jobType=request.body.jobType;
var company=request.body.company;
var salary=request.body.salary;
var salaryType=request.body.salaryType;

var connection=null;
connection=await oracle.getConnection({
"user":"hr",
"password":"hr",
"connectionString":"localhost:1521/xepdb1"
});
var resultSet=await connection.execute(`select * from student where id=${id}`);
if(resultSet.rows.length>0)
{
await connection.close();
response.send({"success": false,"error":id+"exits"});
return;
}
await connection.execute(`insert into student values(${id},'${name}','${jobType}','${company}',${salary},'${salaryType}')`);
await connection.commit();
await connection.close();
response.send({"success":true});
});











app.get("/getstudent",async function(request,response){
var connection=null;
connection=await oracle.getConnection({
"user":"hr",
"password":"hr",
"connectionString":"localhost:1521/xepdb1"
});
var stud=[];
var resultSet=await connection.execute("select * from student");
resultSet.rows.forEach((row)=>{
var id=row[0];
var name=row[1].trim();
var jobType=row[2];
var company=row[3].trim();
var salary=row[4];
var salaryType=row[5];

if(jobType==='I')
{
jobType='Internship';
}
if(jobType==='F')
{
jobType='Full Time';
}
if(salaryType==='Y')
{
if(salary>99000)
{
salary=(salary/1000000)+"lac per annum";
}
else
{
salary=salary+"per annum";
}
}
if(salaryType==='M')
{
if(salary>90000)
{
salary=(salary/100000)+"lac per month";
}
else
{
salary=salary+"per month";
}
}
stud.push(new student(id,name,jobType,company,salary,salaryType));
});
response.send(stud);
});



app.listen(port,function(err){
if(err)
{
return console.log(`SOME ERROR ${err}`);
}
else
{
console.log(`Ready server to accept request on port ${port}`);
}
});