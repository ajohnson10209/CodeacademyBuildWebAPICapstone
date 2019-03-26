const express = require('express');
const router = express.Router();
const mw = require('./menuMw');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemsRouter = require('../menu-items/menu-itemRouter')



//Validate Parameters
router.param('id',(req,res,next,id)=>{
    db.get(`select * from Menu where id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Menu was not found
        }
        //Add the menu as a property to req
        req.menu = row;
        next();
    })
})

router.param('menuId',(req,res,next,id)=>{
    db.get(`select * from MenuItem where menu_id = $id`,{
        $id: id
    },(err,row)=>{
        if(!row){
            return res.sendStatus(404) //Menu Item was not found
        }
        next();
    })
})

//Mount menuItemsRouter
router.use('/:menuId/menu-items',menuItemsRouter);


//Route: /api/menus
router.get('/',mw.getAllMenus);
router.post('/',mw.validateFields,mw.addMenu);

//Route: /api/employees/:menuId
router.get('/:id',mw.getSingleMenu);
router.put('/:id',mw.validateFields,mw.updateMenu);
router.delete('/:id',mw.deleteMenu)



module.exports ={
    menuRouter: router,
    menuItemsRouter: menuItemsRouter
} 