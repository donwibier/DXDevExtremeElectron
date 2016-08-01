dxdon.Tasks = function(params, viewInfo) {
    "use strict";
    var path = require('path'),
        d = require(path.join(process.cwd(), 'js/db.js')),
        openCreateViewAsRoot = viewInfo.layoutController.name === "split",
        dataSource = d.Tasks();

    function viewShownEvent() {
        dataSource.load();
    }

    // need to do this async
    return {
        dataSource: dataSource,
        openCreateViewAsRoot: openCreateViewAsRoot,
        viewShown: viewShownEvent,
        refreshList: viewShownEvent,
        dataGridOptions: {
            dataSource: dataSource,
            paging: {
                pageSize: 10
            },
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true
            },
            columns: [{
                dataField: 'duedate',
                caption: 'Due Date',
                dataType: 'date'
            }, {
                dataField: 'priority',
                caption: 'Priority',
                dataType: 'number'
            }, {
                dataField: 'description',
                caption: 'Tasks',
                dataType: 'string'
            }],
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            headerFilter: {
                visible: true
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Search..."
            }
        }
    }
};