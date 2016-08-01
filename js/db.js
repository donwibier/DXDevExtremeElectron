var fs = require('fs');
var path = require('path');
//var dx = require(path.join(process.cwd(), 'node_modules/devextreme/dist/js/dx.all.js'));


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

db.prototype.Tasks = function() {

    var me = this,
        options = new DevExpress.data.CustomStore({
            load: function(options) {
                //debugger;
                var d = $.Deferred(),
                    sql = ["SELECT *", "FROM todo"];

                /*TODO: Add sql options */
                if (options.filter && options.filter.length > 0) {
                    sql.push("WHERE " + options.filter.map(function(c, i, a) {
                        if (typeof c === "object" && c.length) {
                            return (typeof c[2] === 'string') ? c[0] + " " + c[1] + " '" + c[2] + "'" : c.join(" ");
                        } else {
                            return c;
                        }
                    }).join(" "));
                }

                if (options.sort && options.sort.length > 0) {
                    sql.push("ORDER BY " + options.sort.map(function(c, i, a) {
                        return c.selector + " COLLATE NOCASE" + (c.desc ? " DESC" : "");
                    }));
                }
                if (options.take > 0)
                    sql.push("LIMIT " + options.take);
                if (options.skip > 0)
                    sql.push("OFFSET " + options.skip);

                me.database.runAsync(sql.join(" "),
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            totalCount: function(options) {
                var d = $.Deferred(),
                    sql = ["SELECT *", "FROM todo"];
                /*TODO: Add sql options */
                if (options.filter && options.filter.length > 0) {
                    sql.push("WHERE " + options.filter.map(function(c, i, a) {
                        if (typeof c === "object" && c.length) {
                            return (typeof c[2] === 'string') ? c[0] + " " + c[1] + " '" + c[2] + "'" : c.join(" ");
                        } else {
                            return c;
                        }
                    }).join(" "));
                }
                me.database.runAsync(sql.join(" "),
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            byKey: function(key) {
                var d = $.Deferred(),
                    sql = "SELECT * FROM todo WHERE id = " + key;
                me.database.runAsync(sql,
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            insert: function(values) {
                var d = $.Deferred();
                me.database.insert("todo", {
                        duedate: values.duedate,
                        priority: values.priority,
                        description: values.description
                    },
                    function(res) {
                        console.log(res);
                        if (res.error)
                            throw res.error;
                        d.resolve(me.database.run("SELECT * FROM todo WHERE id = ?", res));
                    });
                return d.promise();
            },
            update: function(key, values) {
                var d = $.Deferred();
                me.database.update("todo", {
                        duedate: values.duedate,
                        priority: values.priority,
                        description: values.description
                    }, key,
                    function(res) {
                        console.log(res);
                        if (res.error)
                            throw res.error;
                        d.resolve(me.database.run("SELECT * FROM todo WHERE id = ?", res));
                    });
                return d.promise();
            },
            remove: function(key) {
                var d = $.Deferred(),
                    sql = "DELETE * FROM todo WHERE id = " + key;
                me.database.runAsync(sql,
                    function(id) {
                        d.resolve(id);
                    });
                return d.promise();
            }
        });

    return new DevExpress.data.DataSource(options);
}

// Exporting module
module.exports = new db();