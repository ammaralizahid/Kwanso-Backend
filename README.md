// Run Project

1- Install require dependecies by running npm install
2- Make Database with name kwanso as mentioned in Connection.ts file and will automatically sync all tables and relations when the project will start // to create database 
3- npm start    // to run the project


Api's

POST  baseUrl/api/auth/register  
POST  baseUrl/api/auth/login
POST  baseUrl/api/create-task
GET   baseUrl/api/list-tasks
GET   baseUrl/api/user



Note: I have written permissions and some roles that can be used to give certain permissions on role levels, Table levels and column levels as well. But did not use them in code as this was not 
the requirement of task.