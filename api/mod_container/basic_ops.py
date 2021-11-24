# B"H

import docker

from api.mod_container.models import *
from api.mod_container.errors import *
from api.mod_sdk.models import Sdk


def is_container_exist(container_id):
    print("check_if_container_exist")
    container = Sdk.docker_client.containers(all=True, filters={'id': container_id})

    if len(container) == 0:
        print("No Containers found")
        raise ContainerIdNotFound
    elif len(container) > 1:
        print("Got more then one container please enter accurate container ID")
        raise ContainerIdMuchTooManny
    elif container[0].get('Id') != container_id:
        print("Container ID didn't much given ID.")
        raise ContainerIdDoNotMuch
    return True


# pause_container pause container by id (can work with name but not intended to ...)
def pause_container(container_id):
    print("pause_container:")
    try:
        print("pause_container:pauseping container: {0}".format(container_id))
        is_container_exist(container_id)
        Sdk.docker_client.pause(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
        print("pause_container:internal error:could not pause container : {0}".format(err))
        raise err
    except docker.errors.APIError as err:
        print("pause_container:docker error:could not pause container: {0}".format(err))
        raise


# unpause_container unpause container by id (can work with name but not intended to ...)
def unpause_container(container_id):
    print("unpause_container:")
    try:
        print("unpause_container:unpause container: {0}".format(container_id))
        is_container_exist(container_id)
        Sdk.docker_client.unpause(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
        print("unpause_container:internal error:could not unpause container : {0}".format(err))
        raise err
    except (docker.errors.APIError, docker.errors.DeprecatedMethod) as err:
        print("unpause_container:error:could not unpause container: {0}".format(err))
        raise


# restart_container restart container by id (can work with name but not intended to ...)
def restart_container(container_id):
    print("restart_container:")
    try:
        print("restart_container:restart container: {0}".format(container_id))
        is_container_exist(container_id)
        Sdk.docker_client.restart(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
        print("pause_container:internal error:could not pause container : {0}".format(err))
        raise err
    except docker.errors.APIError as err:
        print("restart_container:error:could not restart container: {0}".format(err))
        raise


# remove_container
def remove_container(container_id, volume=False, link=False, force=True):
    print("remove_container:")
    try:
        print("remove_container:removing container: {0}".format(container_id))
        # remove_container(container, v=False, link=False, force=False)¶
        is_container_exist(container_id)
        Sdk.docker_client.remove_container(container_id, v=volume, link=link, force=force)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
        print("remove_container:internal error:could not remove container : {0}".format(err))
        raise err
    except docker.errors.APIError as err:
        print("remove_container:error:could not remove container: {0}".format(err))
        raise


# inspect_container
def inspect_container(container_id):
    print("inspect_container:")
    try:
        print("inspect_container:inspecting container: {0}".format(container_id))
        is_container_exist(container_id)
        container = Sdk.docker_client.inspect_container(container_id)
    except (ContainerIdNotFound, ContainerIdMuchTooManny, ContainerIdDoNotMuch) as err:
        print("inspect_container:internal error:could not inspect container : {0}".format(err))
        raise err
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
