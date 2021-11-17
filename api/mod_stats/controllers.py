# B"H

from typing import Container
from flask import Blueprint, request, abort
import flask
from marshmallow import Schema, fields
# ---
from api.mod_container.basic_ops import *
from api.mod_container.errors import *
from api.mod_sdk.models import Sdk
from api.mod_container.models import Container
from api.mod_container.models import ContainerEncoder


# ---

class RequestSchema(Schema):
    id = fields.Str(required=True)

# Define the blueprint: 'log', set its url prefix: app.url/logs
mod_stats = Blueprint('stats', __name__, url_prefix='/stats')
schema_instance = RequestSchema()


@mod_stats.route('/', methods=['GET'])
def api_stats_container():
    
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)
    if errors:
        abort(400, str(errors))

    try:
        container_stats = Sdk.docker_client.stats(container_id, stream=False)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return container_stats, 200