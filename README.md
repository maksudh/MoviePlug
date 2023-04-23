# movie_plug

This is the source code for MoviePlug, it has the code needed to run the app
as well as the python script needed to communicate with the backend. 
The python script will need to stopped once done with the app as it runs 
on a loop. 

HOW TO RUN ON YOUR DEVICE

Since this is a mobile app you'll need to run it in a a dev enviroment
as It is not on the app store right now. 

You'll need to begin by installing NodeJs and Expo. 
After installing nodejs, you can then run this command to 
install expo 'npx expo -h'

Once expo is installed, then run this command 'npm --force install' 
to install the app and its packages
This will then let you run the app.

Next, you'll need to install python and these packages:
'pyrebase' and 'pandas'

Once this is all done, you can run the app using 'expo start'.
When you do you'll have a QR code as well as some more commands letting you
open the app, scanning the QR code and installing the Expo Go app on your
iOS device is the best experience. This will run the app on your device.

Then run this command for the python script 'python3 crudscript.py'. Once done
with the app, please stop this script. 
