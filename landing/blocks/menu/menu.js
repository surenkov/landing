
/// <reference path="~/landing/manager/static/scripts/blocks.js" />
var Views = Views || {};
(function () {
    var itemTemplate = _.template(
        '<td>' +
            '<input type="text" name="menu_items-<%= idx %>-caption" />' +
        '</td>' +
        '<td class="item-select"></td>' +
        '<td>' +
            '<a class="tiny alert delete button"><i class="fi-x"></i></a>' +
        '</td>'
        
    );

    var MenuItemOption = Mn.ItemView.extend({
        tagName: 'option',
        render: function () {
            this.$el.val(this.model.get('blockId'));
            this.$el.text('#' + (this.model.get('index') + 1) + ' ' + this.model.get('name'));
            return this;
        }
    });

    var MenuItemSelect = Mn.CollectionView.extend({
        tagName: 'select',
        childView: MenuItemOption,
        childViewContainer: 'select'
    });
    
    var MenuItemView = Mn.ItemView.extend({
        tagName: 'tr',
        events: {
            'click .delete': 'delete'
        },
        initialize: function () {
            var self = this;
            this.template = function () {
                return itemTemplate({ idx: self.model.collection.indexOf(self.model) });
            };
            this.listenTo(App.blocks, 'update sync', this.renderSelect);
        },
        onRender: function () {
            var modelIdx = this.model.collection.indexOf(this.model);
            this.$('[name=menu_items-' + modelIdx + '-caption]').val(this.model.get('caption'));
            this.renderSelect();
        },
        renderSelect: function () {
            if (this._itemSelect !== undefined)
                this._itemSelect.destroy();
            var options = new Backbone.Collection(
                App.blocks
                    .filter(function (block) { return !block.isNew(); })
                    .map(function (block) {
                        return {
                            blockId: block.id,
                            index: block.collection.indexOf(block),
                            name: App.request('name', block.get('_cls'))
                        };
                    }));

            var model = this.model;
            var itemSelect = new MenuItemSelect({
                collection: options,
                attributes: {
                    name: 'menu_items-' + model.collection.indexOf(model) + '-block_id'
                }
            });
            itemSelect.render().$el.val(model.get('block_id'));
            this.$('.item-select').empty().append(itemSelect.el);
            this._itemSelect = itemSelect;
        },
        delete: function (e) {
            e.preventDefault();
            this.model.destroy();
            this.destroy();
        }
    });

    var MenuItemsCollectionView = Mn.CollectionView.extend({
        tagName: 'tbody',
        childView: MenuItemView
    });

    var MenuView = Views.BlockItem.extend({
        ui: {
            addButton: '.add-item',
            itemsContainer: '.menu-items'
        },
        regions: {
            items: '@ui.itemsContainer'
        },
        events: {
            'click @ui.addButton': 'addItem'
        },
        initialize: function () {
            this.items = new Backbone.Collection(this.model.get('menu_items'));
        },
        onRender: function () {
            Views.BlockItem.prototype.onRender.call(this);
            this.showChildView('items', new MenuItemsCollectionView({
                collection: this.items
            }));
            return this;
        },
        addItem: function (e) {
            e.preventDefault();
            this.items.add({});
        }
    });

    Views.registerView('MenuBlock', MenuView);
})();
