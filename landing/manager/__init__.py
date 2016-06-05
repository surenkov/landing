from flask import Blueprint


manager_app = Blueprint('manager', __name__, 
                        template_folder='templates',
                        url_prefix='/manager')

import landing.manager.views
import landing.manager.auth
