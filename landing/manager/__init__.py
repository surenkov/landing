from flask import Blueprint


manager = Blueprint('manager', __name__, 
                        template_folder='templates',
                        static_folder='static',
                        url_prefix='/manager')

import landing.manager.views
import landing.manager.auth
import landing.manager.api