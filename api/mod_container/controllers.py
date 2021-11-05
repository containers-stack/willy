# B"H

import datetime
from typing import Container
from flask import Blueprint, request, jsonify, abort
from marshmallow import Schema, fields
# ---
from api.mod_sdk.models import Sdk
from api.mod_container.models import Container
from api.mod_container.models import ContainerEncoder


# ---


class MySchema(Schema):
    id = fields.Str(required=True)


# Define the blueprint: 'container', set its url prefix: app.url/containers
mod_container = Blueprint('container', __name__, url_prefix='/containers')
schema_instance = MySchema()


# Set the route and accepted methods
@mod_container.route('/', methods=['GET'])
def list_containers():
    containers = []

    for container_instance in Sdk.docker_client.containers():
        containers.append(Container(id=container_instance.get('Id'),
                                    name=container_instance.get('Names'),
                                    age=(container_instance.get('Created')),
                                    status=container_instance.get('Status'))
                          )
    return ContainerEncoder().encode(containers)


# TODO Add comments
@mod_container.route('/container', methods=['GET'])
def get_container():
    container_id = request.args.get('id')
    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))

    # TODO add catch
    container_instance = Sdk.docker_client.containers(filters={'id': container_id})[0]

    container = Container(id=container_instance.get('Id'),
                          name=container_instance.get('Names')[0],
                          age=(container_instance.get('Created')),
                          status=container_instance.get('Status'))

    return ContainerEncoder().encode(container)
