# B"H
# Import flask dependencies
from os import name
from typing import Container

from docker.api import container
from flask import Blueprint, request, render_template, \
    flash, g, session, redirect, url_for, jsonify, abort
from marshmallow import Schema, fields
import json

import datetime
from api.mod_sdk.models import Sdk
from api.mod_container.models import Container
from api.mod_container.models import ContainerEncoder


class MySchema(Schema):
    id = fields.Str(required=True)


# Define the blueprint: 'container', set its url prefix: app.url/containers
mod_container = Blueprint('container', __name__, url_prefix='/containers')


# Set the route and accepted methods
@mod_container.route('/', methods=['GET'])
def list_containers():
    containers = []

    for container_instance in Sdk.docker_client.containers():
        containers.append(Container(id=container_instance.get('Id'),
                                    name=container_instance.get('Names'),
                                    age=(datetime.datetime.fromtimestamp(container_instance.get('Created') / 1e3)),
                                    status=container_instance.get('Status'))
                          )
    co = Sdk.docker_client.containers()

    return jsonify(co)


schema_instance = MySchema()


@mod_container.route('/container', methods=['GET'])
def get_container():
    container_id = request.args.get('id')
    print('container_id: ', container_id)
    errors = schema_instance.validate(request.args)  # <--fix here
    if errors:
        abort(400, str(errors))

    container_instance = Sdk.docker_client.containers(filters={'id': container_id})[0]
    print("container: ", container_instance)
    print("name: ", container_instance.get('Names')[0])
    print("created: ", container_instance.get('Created'))
    print("status: ", container_instance.get('Status'))
    print("id", container_instance.get('Id'))

    container_object = Container(id=container_instance.get('Id'),
                                 name=container_instance.get('Names')[0],
                                 # age=(datetime.datetime.fromtimestamp(container.get('Created') / 1e3)),
                                 age=(container_instance.get('Created')),
                                 status=container_instance.get('Status'))

    return ContainerEncoder().encode(container_object)