/// <reference path="_references.js" />
/// <reference path="loader.js" />
var Models = Models || {};
var Views = Views || {};

(function () {
    Models.Block = Backbone.Model.extend({});

    Models.BlockCollection = Backbone.Collection.extend({
        model: Models.Block,
        url: '/manager/api/blocks/'
    });

    window.Models = Models;
})();

(function () {
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

    Views.BlockView = Mn.ItemView.extend({
        className: 'secondary callout',
        events: {
            'click .button.delete': 'deleteModel',
            'click .button.save': 'saveModel',
            'submit form': '_preventFormSubmission'
        },
        template: function (model) {
            return App.request('template', model._cls)({
                name: App.request('name', model._cls)
            });
        },
        render: function () {
            Mn.ItemView.prototype.render.call(this);
            this._extendElemWithCid('id');
            this._extendElemWithCid('for');
            this.fillView();
            return this;
        },
        onDestroy: function (destroyModel) {
            if (destroyModel)
                this.model.destroy();
        },
        fillView: function () {
            var model = this.model;
            var fields = App.request('fields', model.get('_cls'));
            _(fields).each(function (fname) {
                var hierarchy = fname.split('-');
                var val = model.attributes;
                try {
                    for (var i = 0; i < hierarchy.length; i++)
                        val = val[hierarchy[i]];
                    this.$('[name=' + fname + ']').val(val);
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
            this.model.set({ '_cls': newCls });
            this.render();
        },
        _extendElemWithCid: function (attr) {
            var model = this.model;
            this.$('[' + attr + ']').each(function () {
                var self = $(this);
                self.attr(attr, model.cid + '-' + self.attr(attr));
            });
        },
        _preventFormSubmission: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.saveModel();
        }
    });

    Views.BlockCollectionView = Mn.CompositeView.extend({
        events: {
            'click .button.add': 'addNewModel'
        },
        className: 'row',
        childView: Views.BlockView,
        childViewContainer: '.blocks',
        template: '#blocks-container',
        addNewModel: function (e) {
            e.preventDefault();
            this.collection.add(_(App.blockTypes).first());
        }
    });

    window.Views = Views;
})();