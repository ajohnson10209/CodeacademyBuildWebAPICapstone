const express = require('express');
const router = express.Router();
const mw = require('./employeeMw');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const timesheetRouter = require('../timesheet/timesheetRouter')



//Validate Parameters
router.param('id',(req,res,next,id)=>{
    db.get(`select * from Employee where id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Employee was not found
        }
        //Add the employee as a property to req
        req.employee = row;
        next();
    })
})
router.param('employeeId',(req,res,next,id)=>{
    db.get(`select * from Timesheet where employee_id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Employee was not found
        }
        next();
    })
})

//Mount timesheetRouter
router.use('/:employeeId/timesheets',timesheetRouter);




//Route: /api/employees
router.get('/',mw.getAllCurrentEmployees);
router.post('/',mw.validateFields,mw.addEmployee);

//Route: /api/employees/:employeeId
router.get('/:id',mw.getSingleEmployee);
router.put('/:id',mw.validateFields,mw.updateEmployee);
router.delete('/:id',mw.deleteEmployee)



module.exports ={
    employeeRouter: router,
    timesheetRouter: timesheetRouter
} 