# B"H

import docker

from api.mod_container.models import Container
from api.mod_sdk.models import Sdk


# stop_container stop container by id (can work with name but not intended to ...)
def stop_container(id):
    print("stop_container:")
    try:
        print("stop_container:stopping container: {0}".format(id))
        Sdk.docker_client.stop(id)
    except docker.errors.APIError as err:
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


# restart_container restart container by id (can work with name but not intended to ...)
def restart_container(id):
    print("restart_container:")
    try:
        print("restart_container:restart container: {0}".format(id))
        Sdk.docker_client.restart(id)
    except docker.errors.APIError as err:
        print("restart_container:error:could not restart container: {0}".format(err))
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


# inspect_container
def inspect_container(id):
    print("inspect_container:")
    try:
        print("inspect_container:inspecting container: {0}".format(id))
        container = Sdk.docker_client.containers(all=True, filters={'id': id})[0]
    except docker.errors.APIError as err:
        print("inspect_container:error:could not inspect container: {0}".format(err))
        raise

    return container


#
def list_containers():
    containers = []

    try:
        containers_list = Sdk.docker_client.containers(all=True)
    except docker.errors.APIError as err:
        print("list_containers:error:could not list containers: {0}".format(err))
        raise

    for container_instance in containers_list:
        containers.append(Container(id=container_instance.get('Id'),
                                    name=container_instance.get('Names')[0],
                                    age=(container_instance.get('Created')),
                                    status=container_instance.get('Status'),
                                    state=container_instance.get('State'))
                          )
    return containers
