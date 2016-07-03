/// <reference path="_references.js" />
(function () {
    window.Models = {};
    window.Views = {};

    var app = new Mn.Application({
        initialize: function () {
            this.$notificationsSection = $('<section />')
                .attr('id', 'global-notifictations')
                .appendTo(document.body);
            this.notificationTemplate = _.template($('#notification-template').html());
        },
        notify: function (status, message, delay) {
            var delay = delay || 4000;
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
