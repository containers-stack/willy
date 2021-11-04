# Import flask and template operators
from flask import Flask, render_template
import docker
from api.mod_container.controllers import mod_container as container_module

# Define the WSGI application object
app = Flask(__name__)

# Configurations
app.config.from_object('config')

docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')


# Sample HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return '404 NOT FOUND', 404


# Register blueprint(s)
app.register_blueprint(container_module)
