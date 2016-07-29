dxdon.Tasks = function(params, viewInfo) {
    "use strict";
    var path = require('path');
    var d = require(path.join(process.cwd(), 'js/db.js'));
    // var shouldReload = false,
    //     openCreateViewAsRoot = viewInfo.layoutController.name === "split",
    //     isReady = $.Deferred(),
    //     dataSourceObservable = ko.observable(),
    //     dataSource;

    // function handleTaskModification() {
    //     shouldReload = true;
    // }

    // function handleViewShowing() {
    //     if(!dataSourceObservable()) {
    //         dataSourceObservable(dataSource);
    //         dataSource.load()
    //             .fail(function () {
    //                 shouldReload = true;
    //             })
    //             .always(function() {
    //                 isReady.resolve();
    //             });
    //     }
    //     else if(shouldReload) {
    //         refreshList();
    //     }
    // }

    // function handleViewDisposing() {
    //     Application1.db.Customer.off("modified", handleTaskModification);
    // }

    // function refreshList() {
    //     shouldReload = false;
    //     dataSource.pageIndex(0);
    //     dataSource.load();
    // }

    // dataSource = new DevExpress.data.DataSource({
    //     store: db.getTasks(),
    //     map: function(item) {
    //         return new dxdon.CustomerViewModel(item);
    //     }
    // });

    //Application1.db.Customer.on("modified", handleTaskModification);



    // return {
    //     isReady: isReady.promise(),
    //     dataSource: d.getTasks(),
    //     refreshList: refreshList,
    //     viewShowing: handleViewShowing,
    //     viewDisposing: handleViewDisposing,
    //     openCreateViewAsRoot: openCreateViewAsRoot
    // };
    // need to do this async
    return {
        dataSource: d.getTasks(),
        isReady: true
    }
};