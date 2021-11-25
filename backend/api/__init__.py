# B"H
import docker
# Import flask and template operators
from flask import Flask, jsonify, render_template ,send_from_directory
from flask_socketio import SocketIO
from flask_cors import CORS

# Define the WSGI application object
app = Flask(__name__)
CORS(app)

# Configurations
app.config.from_object('config')

socketio = SocketIO(app, cors_allowed_origins="*", host='0.0.0.0')

# Create low-level client for the Docker Engine API.
docker_client = docker.APIClient(base_url='unix://var/run/docker.sock')

@app.route('/')
def root():
  return jsonify({'status':'up'})


@socketio.on('connect')
def connect():
    print('Client Connected!')


# --- Import can't be on top of like (PEP 8: E402 module level import not at top of file) for some reason.
# Register modules
from api.mod_container.controllers import mod_container as container_module
from api.mod_log.controllers import mod_log as mod_log
from api.mod_stats.controllers import mod_stats as mod_stats
from api.mod_dashboard.controllers import mod_dashboard as mod_dashboard
# ---

# Register blueprint(s)
app.register_blueprint(container_module)
app.register_blueprint(mod_log)
app.register_blueprint(mod_stats)
app.register_blueprint(mod_dashboard)
