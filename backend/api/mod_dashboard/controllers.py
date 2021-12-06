# B"H

import datetime
from flask import Blueprint, request, abort
import flask
# ---
from api.mod_container.basic_ops import *
from api.mod_container.errors import *
from api.mod_sdk.models import Sdk
from api.mod_dashboard.models import Dashboard, DashboardEncoder, Event


# ---

# Define the blueprint: 'dashboard', set its url prefix: app.url/dashboard
mod_dashboard = Blueprint('dashboard', __name__, url_prefix='/info')



@mod_dashboard.route('/summary', methods=['GET'])
def summary():
    
    try:
        system_info = Sdk.docker_client.info()
    except docker.errors.APIError as err:
       app.logger.error(f'Failed to get system info {err.explanation}')
       return str(err.explanation), 500 
    except Exception as e:
        app.logger.error(f'Failed to get system info {str(e)}')
        return str(e), 500
    return system_info

@mod_dashboard.route('/', methods=['GET'])
def api_dashboard():

    try:
        system_info = Sdk.docker_client.info()
        
        until = datetime.datetime.utcnow() - datetime.timedelta(seconds=5)

        since = datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        
        events = Sdk.docker_client.events(since=since, until=until, decode=True)

        memory_usage = 0

        for container in Sdk.docker_client.containers():

            container_mem_usade = Sdk.docker_client.stats(container=container['Id'], stream=False)

            memory_usage += container_mem_usade['memory_stats']['usage']

        dashboard = Dashboard(
            containers = system_info['Containers'],
            images     = system_info['Images'],
            vol        = len(system_info['Plugins']['Volume']),
            net        = len(system_info['Plugins']['Network']),
            running    = system_info['ContainersRunning'],
            stopped    = system_info['ContainersStopped'],
            paused     = system_info['ContainersPaused'],
            memoryUsage = round((memory_usage / system_info['MemTotal']) * 100, 2),
            hostcors   = system_info['NCPU'],
            events     = []
        )

        for event in events:
            if event['Type'] == 'container' and 'id' in event:
                dashboard.events.append(
                                        Event(
                                            eventContainerId     = event['id'],
                                            eventAction          = event['Action'],
                                            eventFrom            = event['from'],
                                            eventTime            = str(datetime.datetime.fromtimestamp(event['time'])),
                                            eventContainerName   = event['Actor']['Attributes']['name']
                                        )
                                )

    except Exception as e:
        return str(e), 500

    return DashboardEncoder().encode(dashboard), 200