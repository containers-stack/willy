# Import the database object (db) from the main application module
# We will define this inside /app/__init__.py in the next sections.

# Define a Container model
class Container():

    # Container id
    id = str

    # Container Name
    name = str

    # Container Created
    age = str

    # Container Status
    status = str
    
    # New instance instantiation procedure
    def __init__(self, id, name, age, status):

        self.id       = id
        self.name     = name
        self.age      = age
        self.status   = status

    def __repr__(self):
        return '<Container %r>' % (self.name)  