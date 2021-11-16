from flask import Blueprint
from api.mod_sdk.models import Sdk
from api import socketio
from flask_socketio import join_room, leave_room, rooms

# Define the blueprint: 'log', set its url prefix: app.url/logs
mod_stats = Blueprint('stats', __name__, url_prefix='')

# Stream container stats by id
@socketio.on('join_stats_request')
def join_stats_request(containerid, sessionid):
    
    container_stats = Sdk.docker_client.stats(containerid, stream=True)
    
    room = sessionid

    join_room(room)

    while True:
        try:
            stats = next(container_stats).decode("utf-8")
        
            socketio.emit('stream_stats_response', {'stats': stats, 'containerid':containerid}, to=sessionid)

            socketio.sleep(5)

        except StopIteration:
            socketio.emit('stream_stats_response', {'stats': 'CONTAINER NOT RUNNING','containerid':containerid }, to=room)
            break


# leave container stats
@socketio.on('leave_stats_request')
def leave_stats_request(sessionId):
    
    leave_room(sessionId)

    print(f'user {sessionId} leave stats room')
