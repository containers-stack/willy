# Import flask dependencies
from os import name
from typing import Container
from flask import Blueprint, request, render_template, \
                  flash, g, session, redirect, url_for, jsonify
import datetime
from api.mod_sdk.models import Sdk
from api.mod_container.models import Container

# Define the blueprint: 'container', set its url prefix: app.url/containers
mod_container = Blueprint('container', __name__, url_prefix='/containers')

# Set the route and accepted methods
@mod_container.route('/', methods=['GET'])
def list():
    
    containers = []
    
    for container in Sdk.docker_client.containers():
        containers.append(Container(id=container.get('Id'),
                                    name=container.get('Names'),
                                    age=(datetime.datetime.fromtimestamp(container.get('Created') / 1e3)),
                                    status=container.get('Status'))
                         )    
    co = Sdk.docker_client.containers()

    return jsonify(co)

@mod_container.route('/', methods=['GET'])
def get():
    print("TODO: GET CONTAINER BY ID")