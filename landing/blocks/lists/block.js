var Views = Views || {};
(function () {
    var listTemplate = _.template(
        '<div class="small-12 callout columns">' +
            '<div class="clearfix">' +
                '<strong class="float-left">Элемент списка <%= idx + 1 %></strong>' +
                '<a class="tiny alert delete float-right button" href="#"><i class="fi-x"></i></a>' +
            '</div>' +
            '<table>' +
                '<tr>' +
                    '<td>Заголовок</td>' +
                    '<td><input type="text" name="lists-<%= idx %>-title" /></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Описание</td>' +
                    '<td><textarea name="lists-<%= idx %>-description"></textarea></td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Доп. классы:</td>' +
                    '<td><input type="text" name="lists-<%= idx %>-advanced_classes" /></td>' +
                '</tr>' +
            '</table>' +
        '</div>'
    );

    var ListItemView = Mn.ItemView.extend({
        events: {
            'click .delete': 'delete'
        },
        initialize: function () {
            var modelIdx = this.model.collection.indexOf(this.model);
            var modelId = this.model.id;
            this.template = function () {
                return listTemplate({
                    idx: modelIdx,
                    id: modelId
                });
            };
        },
        render: function () {
            Mn.ItemView.prototype.render.call(this);
            var modelIdx = this.model.collection.indexOf(this.model);
            this.$('[name=lists-' + modelIdx + '-title]').val(this.model.get('title'));
            this.$('[name=lists-' + modelIdx + '-description]').val(this.model.get('description'));
            this.$('[name=lists-' + modelIdx + '-advanced_classes]').val(this.model.get('advanced_classes'));
        },
        delete: function (e) {
            e.preventDefault();
            this.model.destroy();
            this.destroy();
        }
    });

    var ListsView = Mn.CollectionView.extend({
        childView: ListItemView
    });

    var ListWrapperView = Views.BlockItem.extend({
        ui: {
            addButton: '.add-callout',
            listsContainer: '.lists-container'
        },
        regions: {
            lists: '@ui.listsContainer'
        },
        events: {
            'click @ui.addButton': 'addListItem'
        },
        initialize: function () {
            this.lists = new Backbone.Collection(this.model.get('lists'));
        },
        render: function () {
            Views.BlockItem.prototype.render.call(this);
            this.showChildView('lists', new ListsView({ collection: this.lists }));
            return this;
        },
        addListItem: function (e) {
            e.preventDefault();
            this.lists.create();
        }
    });

    Views.registerView('ListsBlock', ListWrapperView);
})();