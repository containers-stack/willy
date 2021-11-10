# B"H

import docker
from api.mod_sdk.models import Sdk


# stop_container stop container by id (can work with name but not intended to ...)
def stop_container(id):
    print("stop_container:")
    try:
        print("stop_container:stopping container: {0}".format(id))
        Sdk.docker_client.stop(id)
    except Sdk.docker.errors.APIError as err:
        print("stop_container:error:could not stop container: {0}".format(err))
        raise


# start_container start container by id (can work with name but not intended to ...)
def start_container(id):
    print("start_container:")
    try:
        print("start_container:start container: {0}".format(id))
        Sdk.docker_client.start(id)
    except (docker.errors.APIError, docker.errors.DeprecatedMethod) as err:
        print("start_container:error:could not start container: {0}".format(err))
        raise


# remove_container
def remove_container(id, volume=False, link=False, force=False):
    print("remove_container:")
    try:
        print("remove_container:removing container: {0}".format(id))
        # remove_container(container, v=False, link=False, force=False)¶
        stop_container(id)
        Sdk.docker_client.remove_container(id, v=volume, link=link, force=force)
    except docker.errors.APIError as err:
        print("remove_container:error:could not remove container: {0}".format(err))
        raise
