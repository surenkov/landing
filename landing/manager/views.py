from flask.views import MethodView
from landing.manager import manager_app as app
from landing.manager import auth


class ManagerView(MethodView):

    def get(self):
        return 'Hello manager!'


manager = ManagerView.as_view('manager')
app.add_url_rule('/', view_func=manager)
