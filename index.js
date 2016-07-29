$(function() {
    var startupView = "About";
    window.dxdon = window.dxdon || {};
    //window.dxdon.db = require()
    DevExpress.devices.current("desktop");

    var layoutSet = DevExpress.framework.html.layoutSets["desktop"],
        animation = DevExpress.framework.html.animationSets["slide"],
        navigation = [{
            "title": "About",
            "onExecute": "#About",
            "icon": "info"
        }, {
            "title": "Info",
            "onExecute": "#Info",
            "icon": "info"

        }];


    dxdon.app = new DevExpress.framework.html.HtmlApplication({
        namespace: dxdon,
        layoutSet: layoutSet,
        animationSet: animation,
        mode: "webSite",
        navigation: navigation,
        commandMapping: null,
        /*dxdon.config.commandMapping*/
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    dxdon.app.on("viewShown", function(args) {
        document.title = ko.unwrap(args.viewInfo.model.title) || "dxdon";
    });

    $(window).unload(function() {
        dxdon.app.saveState();
    });

    dxdon.app.router.register(":view/:id", { view: startupView, id: undefined });
    dxdon.app.navigate();
});