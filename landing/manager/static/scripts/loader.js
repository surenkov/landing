/// <reference path="_references.js" />
/// <reference path="landing.js" />
var Models = Models || {};
var Views = Views || {};

(function(models, views) {
    var app = models.App = new Mn.Application({
        initialize: function() {
            this.blocks = new models.BlockCollection();
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

    app.on('start', function (allBlocks) {
        var blocks = this.blocks;
        var keys = _.keys(allBlocks);
        blocks.fetch().then(function () {
            var view = new views.BlockCollectionView({
                collection: blocks
            });
            $('#landing-blocks').prepend(view.render().el);
        });

        this.blockTypes = _.map(allBlocks, function (b, name) {
            return { '_cls': name, 'name': b['name'] };
        });

        this.blockTemplates = _.object(keys, _.map(allBlocks, function (b) {
            return _.template(b['form']);
        }));

        this.blockNames = _.object(keys, _.map(allBlocks, function (b) {
            return b['name'] || '';
        }));

        this.blockFields = _.object(keys, _.map(allBlocks, function (b) {
            return _.toArray(b['fields'] || []);
        }));
    });

    (function () { return $.getJSON('/manager/api/blocks/all'); })().then(_.bind(app.start, app));
})(Models, Views);