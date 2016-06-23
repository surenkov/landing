/// <reference path="_references.js" />
(function (container) {
    var app = new Mn.Application({
        initialize: function () {
            this.blocks = new Models.BlockCollection();
        }
    });

    app.reqres.setHandler('template', function (blockType) {
        return app.blockTemplates[blockType];
    });

    app.reqres.setHandler('name', function (blockType) {
        return app.blockNames[blockType];
    });

    app.reqres.setHandler('fields', function (blockType) {
        return app.blockFields[blockType];
    });

    container.App = app;
})(window);
