var Models = Models || {};
var Views = Views || {};

(function () {
    var LandingModel = Backbone.Model.extend({
        url: function () {
            return '/manager/api/landing/'
        }
    });

    var LandingSettingsView = Mn.ItemView.extend({
        template: '#landing-settings-template',
        ui: {
            form: 'form'
        },
        events: {
            'submit @ui.form': 'submitForm'
        },
        modelEvents: {
            'request': 'notify'
        },
        save: function() {
            var values = _.chain(this.ui.form.serializeArray())
                .map(function(val) { return [val.name, val.value]; })
                .object();
            this.model.save(values);
        },
        onRender: function () {
            var form = this.ui.form;
            _.each(this.model.pairs(), function (field) {
                form.find('[name=' + field[0] + ']').val(field[1]);
            });
        },
        notify: function(model, xhr) {
            xhr.done(function() {
                App.notify('success', 'Настройки лэндинга сохранены.'); 
            }).fail(function() { 
                App.notify('alert', 'Произошла ошибка при сохранении.'); 
            });
        },
        submitForm: function(e) {
            e.preventDefault();
            this.save();
        }
    });

    var LandingRegionView = Mn.LayoutView.extend({
        el: 'body',
        regions: {
            'landingSettings': '#landing-settings',
            'landingBlocks': '#landing-blocks'
        },
        show: function () {
            var self = this;
            this.$('#page-preloader').fadeOut('fast', function() {
                self.showChildView('landingSettings', new LandingSettingsView({
                    model: self.model
                }));
                self.showChildView('landingBlocks', new Views.BlockCollectionView({
                    collection: self.collection
                }));
            });
        }
    });
    
    var app = new Mn.Application({
        initialize: function () {
            this.$notificationsSection = $('<section />')
                .attr('id', 'global-notifications')
                .appendTo(document.body);
            this.notificationTemplate = _.template($('#notification-template').html());
            this.blocks = new Models.BlockCollection();
            this.landingSettings = new LandingModel();
            this.rootView = new LandingRegionView({
                model: this.landingSettings,
                collection: this.blocks
            });
        },
        notify: function (status, message, delay) {
            delay = delay || 4000;
            var nBlock = $('<div />')
                .addClass([status, 'notification', 'callout'].join(' '))
                .attr('data-closable', '')
                .html(this.notificationTemplate({ message: message }))
                .appendTo(this.$notificationsSection)
                .fadeIn();
            var hTimer = setTimeout(function () {
                nBlock.fadeOut(function () { nBlock.remove(); });
            }, delay);
            nBlock.one('closed.zf.callout', function () {
                clearInterval(hTimer);
            });
        }
    });

    app.reqres.setHandler('template', function (blockType) {
        return app.blockTemplates[blockType];
    });

    app.reqres.setHandler('name', function (blockType) {
        return app.blockNames[blockType];
    });

    app.reqres.setHandler('fields', function (blockType) {
        return app.blockFields[blockType];
    });

    window.App = app;
})();
