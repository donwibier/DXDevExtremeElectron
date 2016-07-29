var fs = require('fs');
var path = require('path');

function db() {
    this.config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'app.json')));
    var databaseFile = (this.config.database.split('\\')).length == 1 ? path.join(process.cwd(), 'model', this.config.database + '.db') : this.config.database;
    if (this.config.cipher) {
        var sqlite = require('sqlite-cipher');
        sqlite.connect(databaseFile, this.config.password, this.config.algorithm);
        this.database = sqlite;
    } else {
        var sqlite = require('sqlite-sync');
        sqlite.connect(databaseFile);
        this.database = sqlite;
    }
    // initialize db structure

    this.database.run("CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, duedate DATETIME, priority INT, description TEXT NOT NULL);",
        function(res) {
            if (res.error)
                throw res.error;
            console.log(res);
        });
}

db.prototype.database = null;
db.prototype.config = null;

db.prototype.getTasks = function() {
    var result = this.database.run("SELECT id, duedate, priority, description FROM todo");
    return result;
}

db.prototype.insertTask = function(t) {
    return this.database.run("INSERT INTO todo (duedate, priority, description) VALUES (?,?,?)", [t.duedate, t.priority, t.task, t.id]);
}

db.prototype.updateTask = function(t) {
    this.database.update("UPDATE todo SET duedate = ?, priority = ?, description = ? WHERE id = ?", [t.duedate, t.priority, t.task, t.id]);
}

db.prototype.updateTask = function(t) {
    this.database.run("DELETE FROM todo WHERE id = ?", [t.id]);
}


// Exporting module
module.exports = new db();