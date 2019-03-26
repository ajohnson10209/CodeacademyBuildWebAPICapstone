const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = {

    getAllMenus: function(req,res,next){
        db.all(`select * from Menu`,(err,rows)=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Return the records
            res.status(200).send({menus: rows});
        })
    },
    validateFields: function(req,res,next){
        let newMenu = req.body.menu;
        if(!newMenu.title ){
            return res.sendStatus(400) //Bad Request
        }
        //if the input is valid, move onto the next mw
        next();
    },
    addMenu: function(req,res,next){
        let newMenu = req.body.menu;
        db.run(`
            insert into Menu (title)
            values($title)
        `,{
            $title: newMenu.title
        },function(err){
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Insert was sucessful, now go and get the record that was just inserted
            let id = this.lastID;
            db.get(`select * from Menu where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(201).send({menu:row});
            })
        })
    },
    getSingleMenu: function(req,res,next){
        //Return menu
        res.status(200).send({menu: req.menu})
    },
    updateMenu: function(req,res,next){
        let newMenu = req.body.menu;
        let id = req.menu.id;
        db.run(`
            update Menu
            set title = $title
            where id = $id
        `,{
            $title: newMenu.title,
            $id: id
        },err=>{
            if(err){
                return res.sendStatus(500) //Internal Server Error
            }
            //Update was sucessful, now go and get the record that was just inserted
            db.get(`select * from Menu where id = $id`,{
                $id: id
            },(err,row)=>{
                if(err){
                    return res.sendStatus(500) //Internal Server Error
                }
                //Return the record
                res.status(200).send({menu: row});
            })
        })
    },
    deleteMenu: function(req,res,next){
        let id = req.menu.id;
        db.get(`select * from MenuItem where menu_id = $id`,{
            $id: id
        },(err,row)=>{
            if(err){
                res.sendStatus(500); //Internal Server Error
            }
            else if(row){
                res.sendStatus(400); //Bad Request, Related Menu Item
            }
            else{
                db.run(`
                        delete from Menu
                        where id = $id
                        `,{
                            $id: id
                        },err=>{
                            if(err){
                                return res.sendStatus(500) //Internal Server Error
                            }
                            //Return the record
                            res.sendStatus(204) 
                    })
                }
         })
        
    
    }

}