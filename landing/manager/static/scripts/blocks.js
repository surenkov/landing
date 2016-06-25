/// <reference path="_references.js" />
/// <reference path="loader.js" />
/// <reference path="landing.js" />
var Models = {};
var Views = {};

(function () {
    Models.Block = Backbone.Model.extend({});

    Models.BlockCollection = Backbone.Collection.extend({
        model: Models.Block,
        url: '/manager/api/blocks/'
    });

    window.Models = Models;
})();

(function () {
    (function () {
        var registeredViews = {};
        Views.registerView = function (cls, view) {
            registeredViews[cls] = view;
        };

        Views.getView = function (cls) {
            return registeredViews[cls] || Views.BlockItem;
        };
    })();
    
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

    var HeadNameView = Mn.ItemView.extend({
        tagName: 'h4',
        render: function() {
            this.$el.text(App.request('name', this.model.get('_cls')));
        }
    });

    Views.BlockItem = Mn.ItemView.extend({
        template: function(model) {
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
        fillView: function() {
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
        save: function(values, options) {
            return this.model.save(values, options);
        },
        delete: function() {
            this.model.destroy();
        },
        _extendElemWithCid: function (attr) {
            var model = this.model;
            this.$('[' + attr + ']').each(function () {
                var self = $(this);
                self.attr(attr, model.cid + '-' + self.attr(attr));
            });
        }
    });

    Views.BlockWrapperView = Mn.LayoutView.extend({
        className: 'secondary callout',
        ui: {
            saveButton: '.button.save',
            deleteButton: '.button.delete',
            form: 'form',
            container: '.block-container',
            head: '.block-head'
        },
        events: {
            'click @ui.deleteButton': 'delete',
            'click @ui.saveButton': 'save',
            'submit @ui.form': '_preventFormSubmission'
        },
        regions: {
            container: '@ui.container',
            head: '@ui.head'
        },
        template: '#block-wrapper',
        initialize: function() {
            this._typeChanged(this.model.get('_cls'));
        },
        render: function() {
            Mn.LayoutView.prototype.render.call(this);
            if (this.model.isNew()) {
                var select = new BlockTypeSelect({
                    collection: new Backbone.Collection(App.blockTypes)
                });
                this.listenToOnce(select, 'change', this._typeChanged);
                this.showChildView('head', select);
                select.$el.val(this.model.get('_cls'));
            }
            else {
                this.getRegion('head').show(new HeadNameView({ model: this.model }));
            }
            var internalView = Views.getView(this.model.get('_cls'));
            this.internalView = new internalView({ model: this.model });
            this.showChildView('container', this.internalView);
            return this;
        },
        save: function (e) {
            var values = {};
            var self = this;
            e.preventDefault();

            _.each(this.$('form').serializeArray(), function (input) {
                values[input.name] = input.value;
            });

            var files = this.$('form :file');
            var options = {};
            if (files.length > 0) {
                _.extend(options, {
                    iframe: true,
                    files: files,
                    data: values,
                    processData: false
                });
            }

            this.internalView.save(values, options).then(function (data) {
                self.model.set({ 'id': data['id'] });
                self.render();
            });
        },
        delete: function (e) {
            if (e) e.preventDefault();
            this.internalView.delete();
            this.destroy();
        },
        _typeChanged: function (newCls) {
            this.model.set({ '_cls': newCls });
            this.render();
        },
        _preventFormSubmission: function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.save(e);
        }
    });

    Views.BlockCollectionView = Mn.CompositeView.extend({
        events: {
            'click .button.add': 'addNewModel'
        },
        className: 'row',
        childView: Views.BlockWrapperView,
        childViewContainer: '.blocks',
        template: '#blocks-container',
        addNewModel: function (e) {
            e.preventDefault();
            this.collection.add(_(App.blockTypes).first());
        }
    });

    window.Views = Views;
})();