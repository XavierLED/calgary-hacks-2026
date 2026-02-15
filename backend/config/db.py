from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Replace with your connection string
load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

# Create or connect to a database
db = client["trace"]

# Create or connect to a collection
collection = db["urls"]

