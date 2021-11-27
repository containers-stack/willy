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


class Schema(Schema):
    id = fields.Str(required=True)


# Define the blueprint: 'container', set its url prefix: app.url/containers
mod_container = Blueprint('container', __name__, url_prefix='/containers')
schema_instance = Schema()


# Set the route and accepted methods
@mod_container.route('/', methods=['GET'])
def api_list_containers():
    try:
        containers = list_containers()
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to get list of containers {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to get list of containers {str(e)}')
        return str(e), 500

    return ContainerEncoder().encode(containers), 200


@mod_container.route('/inspect', methods=['GET'])
def api_inspect_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return 'Container id must be supplied', 404
    try:
        container_instance = inspect_container(container_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to inspect container {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to inspect container {str(e)}')
        return str(e), 500

    return container_instance, 200


@mod_container.route('/restart', methods=['GET'])
def api_restart_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return 'Container id must be supplied', 404
    try:
        container = restart_container(container_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to restart container {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to restart container {str(e)}')
        return str(e), 500

    return ContainerEncoder().encode(container), 200


# api_pause_container api_pause container by id
@mod_container.route('/pause', methods=['PUT'])
def api_pause_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return str('Container id must be supplied'), 404
    try:
        container = pause_container(container_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to pause container {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to pause container {str(e)}')
        return str(e), 500

    return ContainerEncoder().encode(container), 200


# api_unpause_container unpause container by id
@mod_container.route('/unpause', methods=['PUT'])
def api_unpause_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return str('Container id must be supplied'), 404
    try:
        unpause_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 500 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container unpause'), 200


# api_remove_container start container by id
@mod_container.route('/remove', methods=['DELETE'])
def api_remove_container():
    container_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return str('Container id must be supplied'), 404
    try:
        remove_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
       print("{0}".format(err))
       return str(err), 500 
    except Exception as e:
        return str(e), 500

    return flask.jsonify(isSuccess=True, msg='Container removed'), 200
