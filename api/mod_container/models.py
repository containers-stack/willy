# B"H
from json import JSONEncoder


# Define a Container model
class Container:
    # Container id
    id = str
    # Container Name
    name = str
    # Container Created
    age = str
    # Container Status
    status = str
    # Container State
    state = str

    # New instance instantiation procedure
    def __init__(self, id, name, age, status, state):
        self.id = id
        self.name = name
        self.age = age
        self.status = status
        self.state = state

    def __repr__(self):
        return '<Container %r>' % self.name


# subclass JSONEncoder
class ContainerEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__
