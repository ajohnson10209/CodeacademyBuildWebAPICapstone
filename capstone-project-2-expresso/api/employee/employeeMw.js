const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = {

    getAllCurrentEmployees: function(req,res,next){
        db.all(`select * from Employee where is_current_employee = 1`,(err,rows)=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Return the records
            res.status(200).send({employees: rows});
        })
    },
    validateFields: function(req,res,next){
        let newEmployee = req.body.employee;
        if(
            !newEmployee.name ||
            !newEmployee.position ||
            !newEmployee.wage
        ){
            return res.sendStatus(400) //Bad Request
        }
        //if the input is valid, move onto the next mw
        next();
    },
    addEmployee: function(req,res,next){
        let newEmployee = req.body.employee;
        db.run(`
            insert into Employee (name,position,wage)
            values($name,$position,$wage)
        `,{
            $name: newEmployee.name,
            $position: newEmployee.position,
            $wage: newEmployee.wage
        },function(err){
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Insert was sucessful, now go and get the record that was just inserted
            let id = this.lastID;
            db.get(`select * from Employee where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(201).send({employee:row});
            })
        })
    },
    getSingleEmployee: function(req,res,next){
        //Return employee
        res.status(200).send({employee: req.employee})
    },
    updateEmployee: function(req,res,next){
        let newEmployee = req.body.employee;
        let id = req.employee.id;
        db.run(`
            update Employee
            set name = $name,
                position = $position,
                wage = $wage
            where id = $id
        `,{
            $name: newEmployee.name,
            $position: newEmployee.position,
            $wage: newEmployee.wage,
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Update was sucessful, now go and get the record that was just inserted
            db.get(`select * from Employee where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(200).send({employee: row});
            })
        })
    },
    deleteEmployee: function(req,res,next){
        let id = req.employee.id;
        db.run(`
            update Employee
            set is_current_employee = 0
            where id = $id
        `,{
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Delete was sucessful, now go and get the record that was just inserted
            db.get(`select * from Employee where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(200).send({employee: row});
            })
        })
    
    }

}