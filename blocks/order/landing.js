(function () {
    $(document.body, '.contact form').on('submit', (e) => {
        e.preventDefault();

        const form = $(e.target);
        const id = '#' + form.data('form-id');

        const success = $('.success', id).hide();
        const fail = $('.fail', id).hide();

        $.post({
            url: form.attr('action'),
            data: form.serialize()
        }).done(() => success.fadeIn()
        ).fail(() => fail.fadeIn());
    });
})();
