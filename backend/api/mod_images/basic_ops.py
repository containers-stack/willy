# B"H

from api import app
from api.mod_container.errors import *
from api.mod_images.errors import *
from api.mod_images.models import Image
from api.mod_sdk.models import Sdk


def is_image_exist(image_id):
    app.logger.info("check_if_image_exist")
    image = Sdk.docker_client.images(filters={'id': image_id})

    if len(image) == 0:
        print("No Images found")
        raise ImageIdNotFound
    elif len(image) > 1:
        app.logger.warning("Got more then one image please enter accurate image ID")
        raise ImageIdMuchTooManny
    elif image[0].get('Id') != image_id:
        app.logger.warning("image ID didn't much given ID.")
        raise ImageIdDoNotMuch
    return True


# remove image
def remove_image(image_id, volume=False, link=False, force=True):
    app.logger.info("remove image: {image_id}")
    Sdk.docker_client.remove_image(image_id, force=True)
    
# inspect image
def inspect_image(image_id):
    app.logger.info(f'inspect image:{image_id}')
    return Sdk.docker_client.inspect_image(image_id)

# image history
def image_history(image_id):
    app.logger.info(f'image history:{image_id}')
    return Sdk.docker_client.history(image=image_id)

# pull image
def pull_image(repo, tag,):
    app.logger.info(f'pull image:{repo}:{tag}')
    return Sdk.docker_client.pull(repository=repo, tag=tag, all_tags=False)

# list all images
def list_images():
    images = []
    app.logger.info(f'list all images')
    images_list = Sdk.docker_client.images()
    for img in images_list:
        image_inspect = Sdk.docker_client.inspect_image(image=img['Id'])
        if len(image_inspect.get('RepoTags')) > 0:
            images.append(Image(id=image_inspect.get('Id'),
                                tag=image_inspect.get('RepoTags')[0].split(':')[1],
                                age=(image_inspect.get('Created')),
                                repo=image_inspect.get('RepoTags')[0].split(':')[0],
                                size=image_inspect.get('Size'))
                            )

    return images
