# B"H
import os
import docker
# Import flask and template operators
from flask import Flask, jsonify, render_template ,send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS


# Define the WSGI application object
app = Flask(__name__, static_folder='./')
CORS(app)

# Configurations
app.config.from_object('config')

socketio = SocketIO(app, cors_allowed_origins="*", host='0.0.0.0')

# Create low-level client for the Docker Engine API.
try:
  docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')
except docker.errors.DockerException as err:
    print("\x1b[31;21m {0} \x1b[0m \nCould not connect to docker api make sure docker socket is mounted.\ntry running with: -v /var/run/docker.sock:/var/run/docker.sock".format(str(err)))
    exit(4)

# Serve client static files
@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
  return send_from_directory('../static', path)


@app.errorhandler(404)
def not_found(error):
    return send_from_directory('../static', 'index.html')

@socketio.on('connect')
def connect():
  app.logger.info('Client Connected!')


# --- Import can't be on top of like (PEP 8: E402 module level import not at top of file) for some reason.
# Register modules
from api.mod_container.controllers import mod_container as container_module
from api.mod_log.controllers import mod_log as mod_log
from api.mod_stats.controllers import mod_stats as mod_stats
from api.mod_dashboard.controllers import mod_dashboard as mod_dashboard
from api.mod_images.controllers import mod_image as mod_images
# ---

# Register blueprint(s)
app.register_blueprint(container_module)
app.register_blueprint(mod_log)
app.register_blueprint(mod_stats)
app.register_blueprint(mod_dashboard)
app.register_blueprint(mod_images)
