# Import flask and template operators
from flask import Flask, jsonify
import docker
from flask_socketio import SocketIO
from flask_cors import CORS
from api.mod_container.controllers import mod_container as container_module

# Define the WSGI application object
app = Flask(__name__)
CORS(app)

# Configurations
app.config.from_object('config')

socketio = SocketIO(app)

# Create low-level client for the Docker Engine API.
docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')

@app.route('/')
def index():
    return app.send_static_file('./index.html')

# Sample HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify(msg="404 NOT FOUND"), 404

@socketio.on('connect')
def connect():
    print('Client Connected!')

# Register modules
from api.mod_container.controllers import mod_container as container_module
from api.mod_log.controllers import mod_log as mod_log

# Register blueprint(s)
app.register_blueprint(container_module)
