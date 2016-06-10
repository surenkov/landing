from flask import request, redirect, render_template, url_for, g, session
from flask_wtf import Form 
from wtforms import StringField, PasswordField, ValidationError
from wtforms.validators import Email, DataRequired
from landing.manager import manager
from landing.manager.auth import User, login_required, is_authenticated


@manager.route('/')
@login_required
def manager_index():
    return render_template('manager/manager.html')


@manager.route('/authorize', methods=['GET', 'POST'])
def authorize():

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

    if request.method == 'GET':
        if is_authenticated():
            if action == 'logout':
                g.user.logout()
            else:
                return redirect(manager_url) 

    form = LoginForm()
    if request.method == 'POST':
        if action == 'login' and form.validate_on_submit():
            User.objects.filter(email=form.email.data).first().login()
            return redirect(manager_url)

    return render_template('manager/login.html', form=form)


# Manager configuration views

ADMIN_UNAME = 'rudoit'
SECURID = ('pbkdf2:sha512:10000$ZnUyK4QN$d2318e062c6f6692a588c0d892fb42fc56bb'
           'f0b3f711bea0f76d402af4057c4bdac562306db1ccdc6d6b9222a41bd09226c1b'
           'f23c99463984bafff633e248f30')

@manager.route('/configure', methods=['GET', 'POST'])
def configure():
    conf_id = session.get('admin_uname', None)
    if conf_id != ADMIN_UNAME:
        return redirect(url_for('manager.configure_login'))

    # TODO: implement conf page

    return render_template('manager/configure.html')

@manager.route('/configure/authorize', methods=['GET', 'POST'])
def configure_login():
    from wtforms import TextField
    
    class LoginForm(Form):
        uname = TextField(validators=[DataRequired()])
        password = PasswordField(validators=[DataRequired()])

        def validate_uname(form, field):
            if field.data != ADMIN_UNAME:
                raise ValidationError('Неверное имя пользователя.')

        def validate_password(form, field):
            from werkzeug.security import check_password_hash

            if not check_password_hash(SECURID, field.data):
                raise ValidationError('Пароль не совпадает.')

    action = request.args.get('action', 'login')
    if request.method == 'GET':
        if action == 'logout' and 'admin_uname' in session:
            del session['admin_uname']

    form = LoginForm()
    if form.validate_on_submit():
        session['admin_uname'] = ADMIN_UNAME
        return redirect(url_for('manager.configure'))
    return render_template('manager/configure_login.html', form=form)
    