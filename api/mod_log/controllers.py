from flask import session, Blueprint
from api.mod_sdk.models import Sdk
from api import socketio

# Define the blueprint: 'log', set its url prefix: app.url/logs
mod_log = Blueprint('log', __name__, url_prefix='')


# Stream container log by id
@socketio.on('stream_logs_request')
def stream_logs_request(id):
    container_logs = Sdk.docker_client.logs(id, stream=True, timestamps=True)
    while True:
        try:
            line = next(container_logs).decode("utf-8")
            socketio.emit('stream_logs_response', {'data': line})
            socketio.sleep(0)
        except StopIteration:
            socketio.emit('stream_logs_response', {'data': 'CONTAINER NOT RUNNING'})
            break
