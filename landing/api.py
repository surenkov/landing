from flask import request, current_app
from flask_restful import reqparse, Resource, Api, inputs, fields

landing_api = Api(prefix='/manager/api')

