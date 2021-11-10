# B"H

from typing import Container
from flask import Blueprint, request, abort
import flask
from marshmallow import Schema, fields
# ---
from api.mod_container.basic_ops import *
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

    for container_instance in Sdk.docker_client.containers(all=True):
        containers.append(Container(id=container_instance.get('Id'),
                                    name=container_instance.get('Names')[0],
                                    age=(container_instance.get('Created')),
                                    status=container_instance.get('Status'),
                                    state=container_instance.get('State'))
                          )
    return ContainerEncoder().encode(containers), 200


@mod_container.route('/inspect', methods=['GET'])
def get_container_inspect():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))

    # TODO add catch
    container_instance = Sdk.docker_client.containers(all=True, filters={'id': container_id})[0]

    return container_instance, 200


@mod_container.route('/restart', methods=['GET'])
def restart_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
        # TODO add catch
    try:
        Sdk.docker_client.restart(container_id)
        return flask.jsonify(isSuccess=True, msg='Container restarted'), 200

    except Exception as e:
        return str(e), 500


# api_stop_container stops container by id
@mod_container.route('/stop', methods=['GET'])
def api_stop_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
    try:
        stop_container(container_id)
    except Exception as e:
        return str(e), 500
        raise e

    return flask.jsonify(isSuccess=True, msg='Container stopped'), 200


# api_start_container start container by id
@mod_container.route('/start', methods=['GET'])
def api_start_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
    try:
        start_container(container_id)
    except Exception as e:
        return str(e), 500
        raise e

    return flask.jsonify(isSuccess=True, msg='Container started'), 200
