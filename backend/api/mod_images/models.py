# B"H
from json import JSONEncoder


# Define a Image model
class Image:
    # image id
    id = str
    # image Created
    age = str
    # image Tag
    tag = str
    # image Repo
    repo = str
    # image State
    size = int

    # New instance instantiation procedure
    def __init__(self, id, tag, age, repo, size):
        self.id = id
        self.tag = tag
        self.age = age
        self.repo = repo
        self.size = size

    def __repr__(self):
        return '<image %r>' % self.name


# subclass JSONEncoder
class ImageEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


