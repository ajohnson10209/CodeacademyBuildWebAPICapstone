const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports= {
    getEmployeeTimesheet: function(req,res,next){
        let employeeId = req.params.employeeId;
        db.all(`select * from Timesheet where employee_id = $id`,{
            $id: employeeId
        },(err,rows)=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Return timesheets
            res.status(200).send({timesheets: rows});
        })
    },
    validateFields: function(req,res,next){
        
        let newTimesheet = req.body.timesheet;
        if(
            !newTimesheet.hours ||
            !newTimesheet.rate ||
            !newTimesheet.date
        ){
            return res.sendStatus(400) //Bad Request
        }
        //if the input is valid, move onto the next mw
        next();
    },
    addTimesheet: function(req,res,next){
        let newTimesheet = req.body.timesheet;
        let employeeId = req.params.employeeId;
        db.run(`
            insert into Timesheet (hours,rate,date,employee_id)
            values($hours,$rate,$date,$empId)
        `,{
            $hours: newTimesheet.hours,
            $rate: newTimesheet.rate,
            $date: newTimesheet.date,
            $empId: employeeId
        },function(err){
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Insert was sucessful, now go and get the record that was just inserted
            let id = this.lastID;
            db.get(`select * from Timesheet where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(201).send({timesheet:row});
            })
        })
    },
    updateTimesheet: function(req,res,next){
        let newTimesheet = req.body.timesheet;
        let id = req.timesheet.id;
        db.run(`
            update Timesheet
            set hours = $hours,
                rate = $rate,
                date = $date
            where id = $id
        `,{
            $hours: newTimesheet.hours,
            $rate: newTimesheet.rate,
            $date: newTimesheet.date,
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Update was sucessful, now go and get the record that was just inserted
            db.get(`select * from Timesheet where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(200).send({timesheet: row});
            })
        })
    },
    deleteTimesheet: function(req,res,next){
        let id = req.timesheet.id;
        db.run(`
            delete from Timesheet
            where id = $id
        `,{
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Return the 204 for sucessful delete
            res.sendStatus(204);
        })
    
    }
}