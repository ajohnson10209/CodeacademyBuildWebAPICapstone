const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

db.serialize(()=>{
    db.run(`
        create table if not exists Employee
        (
            id                  integer     primary key,
            name                text        not null,
            position            text        not null,
            wage                integer     not null,
            is_current_employee integer     default 1
        )
    `);
    db.run(`
        create table if not exists Timesheet
        (
            id              integer     primary key,
            hours           integer     not null,
            rate            integer     not null,
            date            integer     not null,
            employee_id     integer     not null
        )
    `);
    db.run(`
        create table if not exists Menu
        (
            id      integer     primary key,
            title   text        not null
        )
    `);
    db.run(`
        create table if not exists MenuItem
        (
            id              integer     primary key,
            name            text    not null,
            description     text    not null,
            inventory       integer     not null,
            price           integer     not null,
            menu_id         integer     not null
        )
    `);
})