(function () {
    $(document.body, '.contact form').on('submit', function (e) {
        e.preventDefault();
        
        var form = $(e.target);
        clearInvalidation(form);
        
        $.post({
            url: form.attr('action'),
            data: form.serialize()
        }).done(function () {
            $('#' + form.data('form-id') + '-reveal').foundation('open');
        }).fail(function (response) {
            invalidateForm(form, response.responseJSON);
        });
    });

    function clearInvalidation(form) {
        var formData = form.serializeArray();
        _.each(formData, function (field) {
            var input = $('[name=' + field.name + ']', form);
            var label = $('label[for=' + input.attr('id') + ']', form);
            
            input.removeClass('is-invalid-input');
            label.removeClass('is-invalid-label');
            input.siblings('.form-error').remove();
        });
    }

    function invalidateForm(form, data) {
        _.each(data, function (errors, field) {
            var input = $('[name=' + field + ']', form);
            var label = $('label[for=' + input.attr('id') + ']', form);
            
            label.addClass('is-invalid-label');
            input.addClass('is-invalid-input');
            
            _.each(errors, function (msg) {
                input.after($('<span />')
                    .addClass('form-error is-visible')
                    .text(msg));
            });
        });
    }
})();