from flask import request, redirect, render_template, url_for
from landing.manager import manager_app as app


@app.route('/authorize')
def authorize():
    action = request.args.get('action', 'login')
    naxt = request.args.get('next', url_for('manager')) 

    if action == 'logout':
        logout()
        return redirect(next)

    if is_authorized():
        return redirect(url_for('manager'))

    errors = {}
    if request.method == 'POST':
        if action == 'login':
            errors = login()
            if not errors:
                return redirect(next)

    return render_template('login.html', errors=errors)