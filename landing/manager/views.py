from flask import request, redirect, render_template, url_for, g
from landing.manager import manager
from landing.manager.auth import User, login_required, is_authenticated


@manager.route('/')
@login_required
def manager_index():
    return 'Manager view'


@manager.route('/authorize', methods=['GET', 'POST'])
def authorize():
    from flask_wtf import Form 
    from wtforms import StringField, PasswordField, ValidationError
    from wtforms.validators import Email, DataRequired

    class LoginForm(Form):
        email = StringField(validators=[DataRequired(), Email()])
        password = PasswordField(validators=[DataRequired()])

        def validate_email(form, field):
            user = User.objects.filter(email=field.data).first()
            if not user:
                raise ValidationError('There is no user with specified email')

        def validate_password(form, field):
            user = User.objects.filter(email=form.email.data).first()
            if user and not user.check_password(field.data):
                raise ValidationError('Email or password mismatch')


    manager_url = url_for('manager.manager_index')
    action = request.args.get('action', 'login')

    form = LoginForm()
    if request.method == 'GET':
        if is_authenticated():
            if action == 'logout':
                g.user.logout()
            else:
                return redirect(manager_url) 

    if request.method == 'POST':
        if action == 'login' and form.validate_on_submit():
            User.objects.filter(email=form.email.data).first().login()
            return redirect(manager_url)

    return render_template('manager/login.html', form=form)

@manager.route('/configure', methods=['GET', 'POST'])
def configure():
    return 'Basic configuration'