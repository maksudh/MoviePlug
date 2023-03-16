import pyrebase; 
import requests;
import json;
import pandas as pd; 
from collections import Counter;

# config data to connect to firebase 

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

# initizing firebase

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# storing all users and all genre clusters

all_users = db.child("users").get()
all_genres = db.child("col_genres").get()

# loop to get each users fav genres and liked movies 

print("Starting loop for users top 3 genres and liked movie data...")

for user in all_users.each():
    print(user.key())
    likedmovies = []
    movietitles = []
    usergenres = ""
    if db.child("users").child(user.key()).child("watchlist").get().each():
        for movie in db.child("users").child(user.key()).child("watchlist").get().each():
            if str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("liked").get().val()) == "true":
                likedmovies.append(int(movie.key()))
                movietitles.append(str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("title").get().val()))
                #taking genre ids for movies in the watchlist and storing them in an array
                temp = db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("genre_ids").get().val()
                # print(temp)
                # print(str(db.child("users").child(user.key()).child("watchlist").child(movie.key()).child("liked").get().val()))
                usergenres +=temp+","
                # print(usergenres)        
    else:
        print("No movies")
        continue
    usergenres = usergenres[:-1]
    # print(split_genres)
    # print(res)
    # splitting genres and storing them as integers
    # storing user genres as a counter and then taking the top 3 and storing them in an array
    if likedmovies:
        split_genres = usergenres.split(",")
        res = [eval(i) for i in split_genres]
        occurence_count = Counter(res)
        print(occurence_count)
        mos_com = occurence_count.most_common(3)
        print(mos_com)
        top3generes = [key for key, val in mos_com]
        print(top3generes)
        db.child("users").child(user.key()).child("pref_genres").set(top3generes)
    else:
        print("No liked movies")
        continue

    # storing full movie data for liked movies
    for liked in likedmovies:
        data = requests.get("https://api.themoviedb.org/3/movie/"+str(liked)+"?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US")
        jdata = data.json()
        db.child("users").child(user.key()).child("liked_full").child(str(liked)).set(jdata)
        
    db.child("users").child(user.key()).child("liked_movies").set(likedmovies)

    # getting the users recommended movies based on their genres 
    data = requests.get("https://api.themoviedb.org/3/discover/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&sort_by=popularity.desc&page=1&with_genres="+str(top3generes[0])+","+str(top3generes[1])+"&with_watch_monetization_types=flatrate")
    jdata = data.json()
    db.child("users").child(user.key()).child("rec_movies").set(jdata['results'])

print("User top 3 genres and liked movie data complete.")

print("Starting loop for genre clusters...")

# storing users liked movies in their genre cluster for collab recommendations
for user in all_users.each():
    print(user.key())
    if db.child("users").child(user.key()).child("pref_genres").get().val():
        mostlikedgenre = db.child("users").child(user.key()).child("pref_genres").get().val()
        print(mostlikedgenre[0])
        # likedmovieslist = db.child("users").child(user.key()).child("liked_movies").get().val()
        for movie in db.child("users").child(user.key()).child("liked_full").get():
            db.child("col_genres").child(mostlikedgenre[0]).child(movie.key()).set(movie.val())
    else:
        print("No liked movies for cluster")
        continue

print("Genre clusters complete.")

print("Taking cluster movies and storing in users database...")

for user in all_users.each():
    print(user.key())
    if db.child("users").child(user.key()).child("pref_genres").get().val():
        mostlikedgenre = db.child("users").child(user.key()).child("pref_genres").get().val()
        # likedmovieslist = db.child("users").child(user.key()).child("liked_movies").get().val()
        for genres in all_genres.each():
            print(genres.key())
            # print(genres.val())
            if mostlikedgenre[0] == int(genres.key()):
                print("Users cluster is "+ str(genres.key()))
                db.child("users").child(user.key()).child("col_movies").set(genres.val())
            else:
                pass
    else:
        print("No pref genre to store movies")
        continue

print("Everything complete.")

# def jprint(obj):
#     # create a formatted string of the Python JSON object
#     text = json.dumps(obj, sort_keys=True, indent=4)
#     print(text)




