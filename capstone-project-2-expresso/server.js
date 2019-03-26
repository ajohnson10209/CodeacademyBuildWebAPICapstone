const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;

//serve the files in the public directory
app.use(express.static('public'));

//mount logging and body parsing middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

//mount routers
const employee = require('./api/employee/employeeRouter');
const menu = require('./api/menu/menuRouter')

app.use('/api/employees',employee.employeeRouter);
app.use('/api/menus',menu.menuRouter);


//export the express app
module.exports = app

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`);
})