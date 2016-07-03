/// <reference path='_references.js' />

(function (root) {
    var MediaCollection = Backbone.Collection.extend({
        url: '/manager/api/media/'
    });

    var MediaFileView = Mn.ItemView.extend({
        tagName: 'tr',
        defaults: {
            '_status': 0
        },
        template: '#media-file-view',
        events: {
            'click .delete.button': 'delete',
            'click .thumbnail': 'select'
        },
        modelEvents: {
            'destroy': 'destroy',
            'request': 'render',
            'sync': 'render',
            'error': 'render'
        },
        onRender: function () {
            var $progressRow = this.$('.progress-bar');
            if (this.model.isNew())
                $progressRow.siblings().remove();
            else
                $progressRow.remove();
        },
        select: function () {
            this.model.trigger('select', this.model);
        },
        delete: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.model.destroy();
        }
    });

    var MediaView = Mn.CompositeView.extend({
        tagName: 'div',
        className: 'small reveal',
        template: '#media-view-reveal',
        childView: MediaFileView,
        childViewContainer: 'tbody',
        attributes: {
            'data-reveal': true,
            'data-animation-in': 'fade-in',
            'data-animation-out': 'fade-out'
        },
        events: {
            'closed.zf.reveal': 'destroy',
            'click .upload.button': 'openFileDialog'
        },
        collectionEvents: {
            'update': 'updateFilesVisibility',
            'select': 'onSelect'
        },
        initialize: function () {
            this.$el.attr('id', this.cid);
            $(document.body).append(this.el);
            this.render();
            this.$el.foundation();
            this.$el.foundation('open');
        },
        updateFilesVisibility: function () {
            var $files = this.$('.files');
            if (this.collection.isEmpty())
                $files.hide();
            else
                $files.show();
        },
        openFileDialog: function (e) {
            e.preventDefault();
            var $file = $('<input />').prop('type', 'file').prop('name', 'file');
            $file.on('change', _.bind(this.uploadFile, this));
            $file.trigger('click');
        },
        uploadFile: function (e) {
            var file = $(e.target);
            var model = new Backbone.Model({url: ''});
            this.collection.add(model);
            model.save({}, {
                iframe: true,
                files: file,
                data: {},
                processData: false
            }).then(function () {
                file.remove();
            });
        },
        onSelect: function (model) {
            this.trigger('select', model);
        },
        onRender: function () {
            this.updateFilesVisibility();
        },
        close: function () {
            this.$el.foundation('close');
        },
        onDestroy: function () {
            this.$el.foundation('destroy');
        }
    });

    window.App.MediaManager = function () {
        var view = new MediaView({
            collection: new MediaCollection()
        })
        view.collection.fetch();
        return view;
    };
})();

(function () {
    $(document.body).on('click', '.media-manager', function (e) {
        var manager = new App.MediaManager();
    }).on('click', '.media-open', function (e) {
        var $input = $(e.target).parents('.input-group')
                                .first()
                                .children(':text');
        var manager = new App.MediaManager();
        manager.on('select', function (model) {
            $input.val(model.get('url'));
            manager.close();
        });
    });
})();