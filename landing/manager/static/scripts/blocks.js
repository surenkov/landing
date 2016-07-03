﻿/// <reference path="_references.js" />
/// <reference path="loader.js" />
/// <reference path="landing.js" />
(function () {
    Models.Block = Backbone.Model.extend({});

    Models.BlockCollection = Backbone.Collection.extend({
        model: Models.Block,
        url: '/manager/api/blocks/'
    });
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

    Views.BlockItem = Mn.LayoutView.extend({
        modelEvents: {
            'error': 'invalidateFields'
        },
        template: function(model) {
            return App.request('template', model._cls)({
                name: App.request('name', model._cls)
            });
        },
        onRender: function () {
            this._extendElemWithCid('id');
            this._extendElemWithCid('for');
            this.fillView();
            this.renderEditors();
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
        onBeforeSave: function () {
            var fArray = App.request('fields', this.model.get('_cls'));
            var fields = _.object(fArray, _.times(fArray.length, _.noop));
            var keys = this.model.keys();
            for (var i = 0; i < keys.length; i++) {
                if (!(keys[i] in fields))
                    this.model.unset(keys[i], { silent: true });
            }

            if (this.mceEditors) {
                _.each(this.mceEditors, function (ed) { ed.save(); });
            }
        },
        save: function (values, options) {
            var options = options || {};
            _.extend(options, { wait: true });
            return this.model.save(values, options);
        },
        delete: function() {
            this.model.destroy();
        },
        invalidateFields: function (model, response) {
            var errors = this._parseErrorResponse(response.responseJSON);
            _.each(errors, this._invalidateElement, this);
        },
        renderEditors: function () {
            _.defer(_.bind(this._renderEditorsInternal, this));
        },
        _renderEditorsInternal: function() {
            var editors = this.$('textarea')
                .filter(function () { return !!$(this).attr('id'); })
                .map(function () {
                    var editorId = '#' + this.id;
                    return tinymce.EditorManager.get(editorId) 
                        || new tinymce.Editor(this.id, {
                        selector: editorId,
                        menubar: false,
                        plugins: 'image',
                        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | image numlist'
                    }, tinymce.EditorManager);
                })
                .get();
            _.each(editors, function (ed) {
                ed.render();
            });
            this.mceEditors = editors;
        },
        _parseErrorResponse: function (errors) {
            var res = {};
            (function downFall(prev_names, obj, name) {
                if (_.isObject(obj)) {
                    var next_names = name !== '' ? prev_names.concat(name) : prev_names;
                    _.each(obj, function (val, idx) { downFall(next_names, val, idx); });
                } else {
                    var idx = prev_names.join('-');
                    res[idx] = res[idx] || [];
                    res[idx].push(obj);
                }
            })([], errors, '');
            return res;
        },
        _clearInvalidation: function (input) {
            var label = this.$('label[for=' + input.attr('id') + ']');
            label.removeClass('is-invalid-label');
            input.removeClass('is-invalid-input');
            input.siblings('.form-error').remove();
        },
        _invalidateElement: function (errors, name) {
            var input = this.$('[name=' + name + ']');
            var label = this.$('label[for=' + input.attr('id') + ']');
            this._clearInvalidation(input);

            label.addClass('is-invalid-label');
            input.addClass('is-invalid-input');
            if (!_.isArray(errors)) errors = [errors];
            _.each(errors, function (error) {
                input.after($('<span />')
                    .addClass('form-error is-visible')
                    .text(error));
            });
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
        modelEvents: {
            'sync': 'onSuccessSync',
            'error': 'onErrorSync',
            'change:_cls': 'render'
        },
        regions: {
            container: '@ui.container',
            head: '@ui.head'
        },
        template: '#block-wrapper',
        onRender: function () {
            if (this.model.isNew()) {
                var select = new BlockTypeSelect({
                    collection: new Backbone.Collection(App.blockTypes)
                });
                this.listenToOnce(select, 'change', this._typeChanged);
                this.showChildView('head', select);
                select.$el.val(this.model.get('_cls'));
            } else {
                this.getRegion('head').show(new HeadNameView({ model: this.model }));
            }
            var internalView = Views.getView(this.model.get('_cls'));
            this.internalView = new internalView({ model: this.model, parent: this });
            this.showChildView('container', this.internalView);
        },
        save: function (e) {
            e.preventDefault();
            this.internalView.onBeforeSave();
            var values = {};
            _.each(this.$('form').serializeArray(), function (input) {
                values[input.name] = input.value;
            });
            this.internalView.save(values);
        },
        delete: function (e) {
            if (e) e.preventDefault();
            this.internalView.delete();
            this.destroy();
        },
        onSuccessSync: function () {
            App.notify('success', 'Блок успешно сохранен.');
            this.render();
        },
        onErrorSync: function (model, response) {
            var message = {
                400: ': введены некорректные данные',
                404: ': блок не существует или был удалён'
            }[response.status] || '';
            App.notify('alert', 'Произошла ошибка при сохранении' + message + '.')
        },
        _typeChanged: function (newCls) {
            this.model.set({ '_cls': newCls });
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
})();