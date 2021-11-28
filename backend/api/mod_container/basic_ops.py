# B"H

import docker
from api import app
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
    
    app.logger.info("pause container")
    
    Sdk.docker_client.pause(container_id)
    
    container = Sdk.docker_client.containers(all=False, filters={'id': container_id})[0]
    
    return Container(id=container.get('Id'),
                     name=container.get('Names')[0],
                     age=(container.get('Created')),
                     status=container.get('Status'),
                     state=container.get('State'))

# unpause_container unpause container by id (can work with name but not intended to ...)
def unpause_container(container_id):
    
    app.logger.info("pause container")
    
    Sdk.docker_client.unpause(container_id)
    
    container = Sdk.docker_client.containers(all=False, filters={'id': container_id})[0]
    
    return Container(id=container.get('Id'),
                     name=container.get('Names')[0],
                     age=(container.get('Created')),
                     status=container.get('Status'),
                     state=container.get('State'))


# restart_container restart container by id (can work with name but not intended to ...)
def restart_container(container_id):
    
    app.logger.info("restart_container")
    
    Sdk.docker_client.restart(container_id)
    
    container = Sdk.docker_client.containers(all=False, filters={'id': container_id})[0]
    
    return Container(id=container.get('Id'),
                     name=container.get('Names')[0],
                     age=(container.get('Created')),
                     status=container.get('Status'),
                     state=container.get('State'))

    

# remove_container
def remove_container(container_id, volume=False, link=False, force=True):
    
    app.logger.info("remove_container:")
    Sdk.docker_client.remove_container(container_id, v=volume, link=link, force=force)
    
# inspect_container
def inspect_container(container_id):
    
    app.logger.info(f'inspect_container:{container_id}')
    return Sdk.docker_client.inspect_container(container_id)


# list all containers
def list_containers():

    app.logger.info(f'list all containers')
    
    containers = []

    containers_list = Sdk.docker_client.containers(all=True)

    for container_instance in containers_list:
        containers.append(Container(id=container_instance.get('Id'),
                                    name=container_instance.get('Names')[0],
                                    age=(container_instance.get('Created')),
                                    status=container_instance.get('Status'),
                                    state=container_instance.get('State'))
                          )
    
    return containers
