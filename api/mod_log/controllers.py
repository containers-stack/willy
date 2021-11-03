from flask import session, Blueprint
from api.mod_sdk.models import Sdk
from api import socketio


# Define the blueprint: 'log', set its url prefix: app.url/logs
mod_log = Blueprint('log', __name__, url_prefix='')

@socketio.on('stream_logs_request')
def connect():
    container_logs =  Sdk.docker_client.logs('edc913ce90bc7a5503e109bc720989382acad3946dbc9dc88fc1b693a5b1fb13', stream=True, timestamps=True)
    while True:
        line =  next(container_logs).decode("utf-8")
        socketio.emit('stream_logs_response', {'data':line})
        socketio.sleep(0)
