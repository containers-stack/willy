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
            log = next(container_logs).decode("utf-8")
            socketio.emit('stream_logs_response', {'log': log, 'containerid':id})
            socketio.sleep(0)
        except StopIteration:
            socketio.emit('stream_logs_response', {'log': 'CONTAINER NOT RUNNING','containerid':id }, )
            break


# Stream container log by id
# @socketio.on('stream_stats_request')
# def stream_cpu_request(id):
#     container_stats = Sdk.docker_client.stats(id, stream=True)
#     while True:
#         try:
#             stats = next(container_stats).decode("utf-8")
#             socketio.emit('stream_stats_response', {'stats': stats, 'containerid':id})
#             socketio.sleep(0)
#         except StopIteration:
#             socketio.emit('stream_stats_response', {'data': 'CONTAINER NOT RUNNING','containerid':id})
#             break
