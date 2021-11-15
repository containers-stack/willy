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


class MySchema(Schema):
    id = fields.Str(required=True)


# Define the blueprint: 'container', set its url prefix: app.url/containers
mod_container = Blueprint('container', __name__, url_prefix='/containers')
schema_instance = MySchema()


# Set the route and accepted methods
@mod_container.route('/', methods=['GET'])
def api_list_containers():
    try:
        containers = list_containers()
    except Exception as e:
        return str(e), 500

    return ContainerEncoder().encode(containers), 200


@mod_container.route('/inspect', methods=['GET'])
def api_inspect_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))

    # container_instance = Sdk.docker_client.containers(all=True, filters={'id': container_id})[0]
    try:
        container_instance = inspect_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return container_instance, 200


@mod_container.route('/restart', methods=['GET'])
def api_restart_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))

    try:
        restart_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container restarted'), 200


# api_stop_container stops container by id
@mod_container.route('/stop', methods=['PUT'])
def api_stop_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
    try:
        stop_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container stopped'), 200


# api_start_container start container by id
@mod_container.route('/start', methods=['PUT'])
def api_start_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
    try:
        start_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container started'), 200


# api_remove_container start container by id
@mod_container.route('/remove', methods=['DELETE'])
def api_remove_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))
    try:
        remove_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 420 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container removed'), 200
