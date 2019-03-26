const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports= {
    getMenuItems: function(req,res,next){
        let menuId = req.params.menuId;
        db.all(`select * from MenuItem where menu_id = $id`,{
            $id: menuId
        },(err,rows)=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Return menu items
            res.status(200).send({menuItems: rows});
        })
    },
    validateFields: function(req,res,next){
        let newMenuItems = req.body.menuItem;
        if(
            !newMenuItems.name ||
            !newMenuItems.description ||
            !newMenuItems.inventory ||
            !newMenuItems.price
        ){
            return res.sendStatus(400) //Bad Request
        }
        //if the input is valid, move onto the next mw
        next();
    },
    addMenuItem: function(req,res,next){
        let newMenuItems = req.body.menuItem;
        let menuId = req.params.menuId;
        db.run(`
            insert into MenuItem (name,description,inventory,price,menu_id)
            values($name,$description,$inventory,$price,$menuId)
        `,{
            $name: newMenuItems.name,
            $description: newMenuItems.description,
            $inventory: newMenuItems.inventory,
            $price: newMenuItems.price,
            $menuId: menuId
        },function(err){
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Insert was sucessful, now go and get the record that was just inserted
            let id = this.lastID;
            db.get(`select * from MenuItem where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(201).send({menuItem:row});
            })
        })
    },
    updateMenuItem: function(req,res,next){
        let newMenuItems = req.body.menuItem;
        let id = req.menuItem.id;
        db.run(`
            update MenuItem
            set name = $name,
                description = $description,
                inventory = $inventory,
                price = $price
            where id = $id
        `,{
            $name: newMenuItems.name,
            $description: newMenuItems.description,
            $inventory: newMenuItems.inventory,
            $price: newMenuItems.price,
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Update was sucessful, now go and get the record that was just inserted
            db.get(`select * from MenuItem where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(200).send({menuItem: row});
            })
        })
    },
    deleteMenuItem: function(req,res,next){
        let id = req.menuItem.id;
        db.run(`
            delete from MenuItem
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