from datetime import date, datetime
from flask import Blueprint
from api.mod_sdk.models import Sdk
from api import socketio
from flask_socketio import join_room, leave_room, rooms

# Define the blueprint: 'log', set its url prefix: app.url/logs
mod_log = Blueprint('log', __name__, url_prefix='')

# Stream container log by id
@socketio.on('join_log_request')
def join_log_request(containerid, sessionid):
    
    container_logs = Sdk.docker_client.logs(container=containerid,
                                            stdout=True,
                                            stream=True)
    
    room = sessionid

    join_room(room)

    while True:
        try:
            log = next(container_logs).decode("utf-8")
            socketio.emit('stream_logs_response', {'log': log, 'containerid':containerid}, to=sessionid)
            socketio.sleep(0)

        except StopIteration:
            socketio.emit('stream_logs_response', {'log': 'CONTAINER NOT RUNNING','containerid':containerid }, to=room)
            break

# Stream container log by id
@socketio.on('leav_log_request')
def leav_log_request(sessionid):
    
    leave_room(sessionid)

    print(f'user {sessionid} leave room')
