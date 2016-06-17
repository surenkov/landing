/// <reference path="_references.js" />
/// <reference path="~/landing/manager/static/scripts/loader.js" />
var Models = Models || {};
var Views = Views || {};

(function (models) {
    models.Block = Backbone.Model.extend({});

    models.BlockCollection = Backbone.Collection.extend({
        model: models.Block,
        url: '/manager/api/blocks/'
    });
})(Models);

(function (views) {

    var BlockTypeOption = Mn.ItemView.extend({
        tagName: 'option',
        render: function () {
            this.$el.val(this.model.get('_cls'));
            this.$el.text(this.model.get('name'));
            return this;
        }
    });

    var BlockTypeSelect = Mn.CollectionView.extend({
        events: { 'change': '_modelChanged' },
        attributes: { name: '_cls' },
        tagName: 'select',
        childViewContainer: 'select',
        childView: BlockTypeOption,
        _modelChanged: function () {
            this.trigger('change', this.$el.val());
        }
    });

    views.BlockView = Mn.ItemView.extend({
        className: 'secondary callout',
        events: {
            'click .button.delete': 'deleteModel',
            'click .button.save': 'saveModel',
            'submit form': '_preventFormSubmission',
            'input': '_dataChanged',
            'change': '_dataChanged'
        },
        initialize: function () {
            this._enableSaveButton = _.debounce(
                _.bind(function (e) {
                    var changed = this.model.isNew() || e !== undefined;
                    this.$('.button.save').prop('disabled', !changed);
                }, this),
                300,
                true);
        },
        template: function (model) {
            return Models.App.request('template', model._cls)({
                name: Models.App.request('name', model._cls)
            });
        },
        render: function () {
            Mn.ItemView.prototype.render.call(this);
            if (this.model.isNew()) {
                var types = Models.App.blockTypes;
                var select = new BlockTypeSelect({ collection: new Backbone.Collection(types) });
                select.once('change', _.bind(this._typeChanged, this));
                this.$('form').prepend(select.render().el);
                select.$el.val(this.model.get('_cls'));
                this.$('h4.title').remove();
            }
            this._extendElemWithCid('id');
            this._extendElemWithCid('for');
            this.fillView();
            this._enableSaveButton();
            return this;
        },
        onDestroy: function (destroyModel) {
            if (destroyModel)
                this.model.destroy();
        },
        fillView: function () {
            var model = this.model;
            var fields = Models.App.request('fields', model.get('_cls'));
            _(fields).each(function (fname) {
                try {
                    this.$('[name=' + fname + ']').val(model.get(fname));
                } catch (e) {
                    console.log(e);
                }
            }, this);
        },
        saveModel: function (e) {
            var values = {};
            var self = this;
            e.preventDefault();

            _.each(this.$('form').serializeArray(), function (input) {
                values[input.name] = input.value;
            });

            var files = this.$('form :file');
            var options = {};
            if (files.length > 0)
                _.extend(options, {
                    iframe: true,
                    files: files,
                    data: values,
                    processData: false
                });
                
            this.model.save(values, options).done(function (data) {
                self.model.set({ 'id': data['id'] });
                self.render();
            });
        },
        deleteModel: function (e) {
            e.preventDefault();
            this.destroy(true);
        },
        _typeChanged: function (newCls) {
            this.model.set({'_cls': newCls});
            this.render();
        },
        _extendElemWithCid: function (attr) {
            var model = this.model;
            this.$('[' + attr + ']').each(function () {
                var self = $(this);
                self.attr(attr, model.cid + '-' + self.attr(attr));
            });
        },
        _dataChanged: function (e) {
            if (this.hasOwnProperty('_enableSaveButton'))
                this._enableSaveButton(e);
        },
        _preventFormSubmission: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    views.BlockCollectionView = Mn.CompositeView.extend({
        events: {
            'click .button.add': 'addNewModel'
        },
        className: 'row',
        childView: views.BlockView,
        childViewContainer: '.blocks',
        template: '#blocks-container',
        addNewModel: function (e) {
            e.preventDefault();
            this.collection.add(_(Models.App.blockTypes).first());
        }
    });
})(Views)