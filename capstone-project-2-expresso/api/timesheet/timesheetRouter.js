const express = require('express')
const router = express.Router({mergeParams:true});
const mw = require('./timesheetMw')
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Validate Parameters
router.param('id',(req,res,next,id)=>{
    db.get(`select * from Timesheet where id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Timesheet was not found
        }
        //Add the timesheet as a property to req
        req.timesheet = row;
        next();
    })
})

//Route: /api/employees/:employeeId/timesheets
router.get('/',mw.getEmployeeTimesheet);
router.post('/',mw.validateFields,mw.addTimesheet);

//Route: /api/employees/:employeeId/timesheets/:timesheetId
router.put('/:id',mw.validateFields,mw.updateTimesheet);
router.delete('/:id',mw.deleteTimesheet)

module.exports = router