var $ = window.$ = window.jQuery = require("jquery");
$(function() {
    var startupView = "Tasks";
    
    window.dxapp = dxapp || {};
    DevExpress.devices.current("desktop");

    var layoutSet = DevExpress.framework.html.layoutSets["desktop"],
        animation = DevExpress.framework.html.animationSets["slide"],
        navigation = [{
            "title": "Tasks",
            "onExecute": "#Tasks",
            "icon": "info"
        }, {
            "title": "Info",
            "onExecute": "#Info",
            "icon": "info"

        }];


    dxapp.app = new DevExpress.framework.html.HtmlApplication({
        namespace: dxapp,
        layoutSet: layoutSet,
        animationSet: animation,
        mode: "webSite",
        navigation: navigation,
        commandMapping: null,
        /*dxapp.config.commandMapping*/
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    dxapp.app.on("viewShown", function(args) {
        document.title = ko.unwrap(args.viewInfo.model.title) || "DevExtreme";
    });

    $(window).unload(function() {
        dxapp.app.saveState();
    });

    dxapp.app.router.register(":view/:id", { view: startupView, id: undefined });
    dxapp.app.navigate();
});