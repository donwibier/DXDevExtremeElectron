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

db.prototype.where = function(arr, sqlArray, paramsArray) {
    arr.forEach(function(c, i, a) {
        if (Array.isArray(c) && (c.length === 3)) {
            sqlArray.push("(" + c[0] + " " + (c[1] === 'contains' ? 'LIKE' : c[1]) + " ?)");
            paramsArray.push((c[2] instanceof Date) ? c[2].toISOString() : c[2]);
        } else if ((i == 1) && (c === "contains")) {
            sqlArray.push("LIKE");
        } else if (i === 2) {
            if (typeof c === "string") {
                sqlArray.push("'" + c + "'");
            } else {
                sqlArray.push("?");
                paramsArray.push((c instanceof Date) ? c.toISOString() : c);
            }
        } else {
            sqlArray.push(c);
        }
    });
}

db.prototype.createStore = function(tableName, keyfieldName, insertEvent, updateEvent) {
    var me = this,
        options = new DevExpress.data.CustomStore({
            load: function(options) {
                //debugger;
                var d = $.Deferred(),
                    sql = ["SELECT *", "FROM", tableName],
                    sqlParams = [];

                /*TODO: Add sql options */
                if (options.filter && options.filter.length > 0) {
                    sql.push("WHERE");
                    me.where(options.filter, sql, sqlParams);
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

                me.database.runAsync(sql.join(" "), sqlParams,
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            totalCount: function(options) {
                var d = $.Deferred(),
                    sql = ["SELECT *", "FROM", tableName],
                    sqlParams = [];

                if (options.filter && options.filter.length > 0) {
                    sql.push("WHERE");
                    me.where(options.filter, sql, sqlParams);
                }

                me.database.runAsync(sql.join(" "), sqlParams,
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            byKey: function(key) {
                var d = $.Deferred(),
                    sql = "SELECT * FROM " + tableName + " WHERE " + keyfieldName + " = " + key;
                me.database.runAsync(sql,
                    function(rows) {
                        d.resolve(rows);
                    });
                return d.promise();
            },
            insert: function(values) {
                var d = $.Deferred();
                me.database.insert(tableName, insertEvent,
                    function(res) {
                        console.log(res);
                        if (res.error)
                            throw res.error;
                        d.resolve(me.database.run("SELECT * FROM " + tableName + " WHERE " + keyfieldName + " = ?", res));
                    });
                return d.promise();
            },
            update: function(key, values) {
                var d = $.Deferred();
                me.database.update(tableName, updateEvent, key,
                    function(res) {
                        console.log(res);
                        if (res.error)
                            throw res.error;
                        d.resolve(me.database.run("SELECT * FROM " + tableName + " WHERE " + keyfieldName + " = ?", res));
                    });
                return d.promise();
            },
            remove: function(key) {
                var d = $.Deferred(),
                    sql = "DELETE FROM " + tableName + " WHERE " + keyfieldName + " = " + key;
                me.database.runAsync(sql,
                    function(id) {
                        d.resolve(id);
                    });
                return d.promise();
            }
        });


    return options;
}

db.prototype.Tasks = function() {
    return new DevExpress.data.DataSource(this.createStore("todo", "id",
        function(values) {
            return {
                duedate: new Date(values.duedate).toISOString(),
                priority: values.priority,
                description: values.description
            }
        },
        function(key, values) {
            return {
                duedate: new Date(values.duedate).toISOString(),
                priority: values.priority,
                description: values.description
            }
        }));
}

// Exporting module
module.exports = new db();