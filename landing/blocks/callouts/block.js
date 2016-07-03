/// <reference path="~/landing/manager/static/scripts/blocks.js" />
var Views = Views || {};
(function () {
    var calloutTemplate = _.template(
        '<div class="small-12 callout columns">' +
            '<div class="clearfix">' +
                '<strong class="float-left">Колонка <%= idx + 1 %></strong>' +
                '<a class="tiny alert delete float-right button" href="#"><i class="fi-x"></i></a>' +
            '</div>' +
            '<table>' +
                '<tr>' +
                    '<td>Заголовок</td>' +
                    '<td><input type="text" name="callouts-<%= idx %>-title" /></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Описание</td>' +
                    '<td><textarea id="callouts-<%= idx %>-description" name="callouts-<%= idx %>-description"></textarea></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Доп. классы:</td>' +
                    '<td><input type="text" name="callouts-<%= idx %>-advanced_classes" /></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Изображение</td>' +
                    '<td>' +
                        '<div class="input-group">' +
                            '<input class="input-group-field" placeholder="/media/image.png" name="callouts-<%= idx %>-image" type="text">' +
                            '<div class="input-group-button">' +
                                '<button type="button" class="media-open secondary button" title="Выбрать файл">' +
                                    '<i class="fi-photo"></i>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                '</tr>' +
            '</table>' +
        '</div>'
    );

    var CalloutView = Mn.ItemView.extend({
        events: {
            'click .delete': 'delete'
        },
        initialize: function () {
            var modelIdx = this.model.collection.indexOf(this.model);
            var modelId = this.model.id;
            this.template = function () {
                return calloutTemplate({
                    idx: modelIdx,
                    id: modelId
                });
            }
        },
        render: function () {
            Mn.ItemView.prototype.render.call(this);
            var modelIdx = this.model.collection.indexOf(this.model);
            this.$('[name=callouts-' + modelIdx + '-title]').val(this.model.get('title'));
            this.$('[name=callouts-' + modelIdx + '-description]').val(this.model.get('description'));
            this.$('[name=callouts-' + modelIdx + '-advanced_classes]').val(this.model.get('advanced_classes'));
            this.$('[name=callouts-' + modelIdx + '-image]').val(this.model.get('image'));
        },
        delete: function (e) {
            e.preventDefault();
            this.model.destroy();
            this.destroy();
        }
    });

    var CalloutsCollectionView = Mn.CollectionView.extend({
        childView: CalloutView
    });

    var CalloutsWrapperView = Views.BlockItem.extend({
        ui: {
            addButton: '.add-callout',
            calloutsContainer: '.callouts-container'
        },
        regions: {
            callouts: '@ui.calloutsContainer'
        },
        events: {
            'click @ui.addButton': 'addCallout'
        },
        initialize: function () {
            this.callouts = new Backbone.Collection(this.model.get('callouts'));
            this.listenTo(this.callouts, 'update', this.renderEditors);
        },
        render: function () {
            Views.BlockItem.prototype.render.call(this);
            this.showChildView('callouts', new CalloutsCollectionView({ collection: this.callouts }));
            return this;
        },
        addCallout: function (e) {
            e.preventDefault();
            this.callouts.add({});
        }
    });

    Views.registerView('CalloutsBlock', CalloutsWrapperView);
})();