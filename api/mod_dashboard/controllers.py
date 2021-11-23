# B"H

from flask import Blueprint, request, abort
import flask
# ---
from api.mod_container.basic_ops import *
from api.mod_container.errors import *
from api.mod_sdk.models import Sdk
from api.mod_dashboard.models import Dashboard, DashboardEncoder


# ---

# Define the blueprint: 'dashboard', set its url prefix: app.url/dashboard
mod_dashboard = Blueprint('dashboard', __name__, url_prefix='/dashboard')


@mod_dashboard.route('/', methods=['GET'])
def api_dashboard():

    try:
        system_info = Sdk.docker_client.info()

        dashboard = Dashboard(
            containers = system_info['Containers'],
            images     = system_info['Images'],
            vol        = len(system_info['Plugins']['Volume']),
            net        = len(system_info['Plugins']['Network']),
            running    = system_info['ContainersRunning'],
            stopped    = system_info['ContainersStopped'],
            paused     = system_info['ContainersPaused'],
            hostMemory = system_info['MemTotal'],
            hostcors   = system_info['NCPU']
        )

    except Exception as e:
        return str(e), 500

    return DashboardEncoder().encode(dashboard), 200