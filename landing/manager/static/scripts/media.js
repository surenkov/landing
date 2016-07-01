/// <reference path='_references.js' />

(function (root) {
    var MediaCollection = Backbone.Collection.extend({
        url: '/manager/api/media/'
    });

    var MediaFileView = Mn.ItemView.extend({
        tagName: 'tr',
        template: '#media-file-view',
        events: {
            'click .delete.button': 'delete'
        },
        modelEvents: {
            'destroy': 'destroy'
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
            'click .upload.button': 'openFileDialog',
            'change .media-file': 'uploadFile'
        },
        collectionEvents: {
            'update': 'updateFilesVisibility'
        },
        initialize: function () {
            this.$el.attr('id', this.cid);
            $(document.body).append(this.el);
            this.render();
            this.$el.foundation();
            this.$el.foundation('open');
            this.trigger('open');
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
            this.$('.media-file').trigger('click');
        },
        uploadFile: function () {
            var files = this.$(':file');
            this.collection.create({url: '', path: ''}, {
                iframe: true,
                files: files,
                data: {},
                wait: true,
                processData: false
            });
        },
        onRender: function () {
            this.updateFilesVisibility();
        },
        onDestroy: function () {
            this.$el.foundation('destroy');
        }
    });

    window.MediaManager = function () {
        var view = new MediaView({
            collection: new MediaCollection()
        })
        view.collection.fetch();
        return view;
    };
})();