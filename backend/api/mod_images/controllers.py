# B"H

import docker
from flask import Blueprint, app, request, abort
import flask
from marshmallow import Schema, fields
from marshmallow.decorators import validates

from api.mod_images.basic_ops import *
from api.mod_images.models import ImageEncoder
# ---


# ---


class Schema(Schema):
    id = fields.Str(required=True)


# Define the blueprint: 'image', set its url prefix: app.url/images
mod_image = Blueprint('image', __name__, url_prefix='/images')
schema_instance = Schema()


# Set the route and accepted methods
@mod_image.route('/', methods=['GET'])
def api_list_images():
    try:
        images = list_images()
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to get list of images {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to get list of images {str(e)}')
        return str(e), 500

    return ImageEncoder().encode(images), 200


@mod_image.route('/inspect', methods=['GET'])
def api_inspect_image():
    image_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return 'image id must be supplied', 404
    try:
        image_instance = inspect_image(image_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to inspect image {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to inspect image {str(e)}')
        return str(e), 500

    return image_instance, 200

@mod_image.route('/history', methods=['GET'])
def api_image_history():
    image_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)
    if errors:
        return 'image id must be supplied', 404
    try:
        history = image_history(image_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to get image history {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to get image history {str(e)}')
        return str(e), 500

    return flask.jsonify(history), 200

@mod_image.route('/pull', methods=['GET'])
def api_pull_image():
    repo = request.args.get('repo')
    tag = request.args.get('tag')

    # Validate request parameter
    if repo == '' or tag == '':
        return 'image repo and tag must be supplied', 404
    try:
        pull = pull_image(repo=repo, tag=tag)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to pull image {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to pull image {str(e)}')
        return str(e), 500

    return flask.jsonify(pull), 200

# api_remove_image start image by id
@mod_image.route('/remove', methods=['DELETE'])
def api_remove_image():
    image_id = request.args.get('id')

    # Validate request parameter
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        return str('image id must be supplied'), 404
    try:
        remove_image(image_id)
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to remove image {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to remove image {str(e)}')
        return str(e), 500

    return flask.jsonify(msg='image removed'), 200