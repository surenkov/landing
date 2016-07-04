/// <reference path="_references.js" />
/// <reference path="media.js" />
var Models = Models || {};
var Views = Views || {};

(function() {
    App.on('start', function (allBlocks) {
        var blocks = this.blocks = new Models.BlockCollection();
        var keys = _.keys(allBlocks);
        blocks.fetch().then(function () {
            var view = new Views.BlockCollectionView({
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

    (function () { return $.getJSON('/manager/api/blocks/all'); })()
        .then(_.bind(App.start, App));
})();