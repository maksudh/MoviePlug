import pyrebase; 
import requests;
import json;
import pandas as pd; 
from collections import Counter;

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

all_users = db.child("users").get()
all_genres = db.child("col_genres").get()

for user in all_users.each():
    print(user.key())
    likedmovies = []
    movietitles = []
    usergenres = ""

    for movie in db.child("users").child(user.key()).child("watchlist").get().each():
        if str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("liked").get().val()) == "true":
            likedmovies.append(int(movie.key()))
            movietitles.append(str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("title").get().val()))

            temp = db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("genre_ids").get().val()
            # print(str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("liked").get().val()))
            usergenres += temp
            split_genres = usergenres.split(",")
            res = [eval(i) for i in split_genres]

    occurence_count = Counter(res)
    # print(occurence_count)
    firstgenre = sorted(set(occurence_count.keys()), reverse=True)[-1]
    secondgenre = sorted(set(occurence_count.keys()), reverse=True)[-2]
    thirdgenre = sorted(set(occurence_count.keys()), reverse=True)[-3]
    # print(firstgenre, secondgenre, thirdgenre)
    top3generes = [firstgenre, secondgenre, thirdgenre]

    for liked in likedmovies:
        data = requests.get("https://api.themoviedb.org/3/movie/"+str(liked)+"?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US")
        jdata = data.json()
        db.child("users").child(user.key()).child("liked_full").child(str(liked)).set(jdata)
        

    db.child("users").child(user.key()).child("liked_movies").set(likedmovies)
    db.child("users").child(user.key()).child("pref_genres").set(top3generes)

    data = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&sort_by=popularity.desc&page=1&with_genres="+str(firstgenre)+"&with_watch_monetization_types=flatrate")
    jdata = data.json()
    db.child("users").child(user.key()).child("rec_movies").set(jdata['results'])

for user in all_users.each():
    print(user.key())
    mostlikedgenre = db.child("users").child(user.key()).child("pref_genres").get().val()
    # print(mostlikedgenre[0])
    likedmovieslist = db.child("users").child(user.key()).child("liked_movies").get().val()
    for movie in db.child("users").child(user.key()).child("liked_full").get():
        db.child("col_genres").child(mostlikedgenre[0]).child(movie.key()).set(movie.val())

for user in all_users.each():
    print(user.key())
    mostlikedgenre = mostlikedgenre = db.child("users").child(user.key()).child("pref_genres").get().val()
    likedmovieslist = likedmovieslist = db.child("users").child(user.key()).child("liked_movies").get().val()

    for genres in all_genres.each():
        print(genres.key())
        # print(genres.val())

        if mostlikedgenre[0] == int(genres.key()):
            print("This is true")
            db.child("users").child(user.key()).child("col_movies").set(genres.val())
        else:
            print("didnt work")

# def jprint(obj):
#     # create a formatted string of the Python JSON object
#     text = json.dumps(obj, sort_keys=True, indent=4)
#     print(text)




