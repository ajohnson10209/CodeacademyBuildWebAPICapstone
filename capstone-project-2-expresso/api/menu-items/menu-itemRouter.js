const express = require('express')
const router = express.Router({mergeParams:true});
const mw = require('./menu-itemsMw')
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Validate Parameters
router.param('id',(req,res,next,id)=>{
    db.get(`select * from MenuItem where id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Menu Item was not found
        }
        //Add the menuItem as a property to req
        req.menuItem = row;
        next();
    })
})

//Route: /api/employees/:employeeId/timesheets
router.get('/',mw.getMenuItems);
router.post('/',mw.validateFields,mw.addMenuItem);

//Route: /api/employees/:employeeId/timesheets/:timesheetId
router.put('/:id',mw.validateFields,mw.updateMenuItem);
router.delete('/:id',mw.deleteMenuItem)

module.exports = router