import pyrebase; 
import requests;
import json;
import pandas as pd; 

config = {
    "apiKey": "AIzaSyDMioN6rBJCuCI6YoF43BKBUYmjwR_F9pw",
    "authDomain": "movieplug-99cc9.firebaseapp.com",
    "databaseURL": "https://movieplug-99cc9-default-rtdb.europe-west1.firebasedatabase.app",
    "projectId": "movieplug-99cc9",
    "storageBucket": "movieplug-99cc9.appspot.com",
    "messagingSenderId": "674448041073",
    "appId": "1:674448041073:web:eca0a46520ed157c23a7d0",
    "measurementId": "G-HN6J4GZH3W"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# No need to touch above code for now 

# Creating data here 

# db.push(data) --------------------------------------------------------------------------------------------------------------

# db.child("Users").child("FirstPerson").set(data)

# Reading data --------------------------------------------------------------------------------------------------------------

# emily = db.child("Users").child("FirstPerson").get()

# print(emily.val())

# Update data --------------------------------------------------------------------------------------------------------------

# db.child("Users").child("FirstPerson").update({"Name":"John"})

# Delete data --------------------------------------------------------------------------------------------------------------

# db.child("Users").child("FirstPerson").child("Age").remove()

# db.child("Users").child("FirstPerson").remove()

# db.child("-NK9Lspd7OsuDOFAGSSX").remove()

def jprint(obj):
    # create a formatted string of the Python JSON object
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)

# API calls to movieDB ---------------------------------------------------------------------------------------------------------

data = requests.get("https://api.themoviedb.org/3/search/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&query=batman")

jdata = data.json()


db.push({"movies":jdata['results']})

# db.child("-NK9Wr9ZoxkXwCcTN0hP").set({"movies":jdata['results']})

# db.child("-NK9Wr9ZoxkXwCcTN0hP").push({"movies":jdata['results']})




