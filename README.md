# GroupSketchRealtime
A group sketch module built with Angular, Express, Node, Socket.io, and MongoDB


Most of the logic is placed in the controller. Things to note:

-Long curves tend to slow down as the coordinate array [{x:x,y:y},...] gets larger. 
This seems to impact how quickly the other users receive a drawing from any other user.

-Having floating tags where users are drawing would be useful.

-color and line changes work in real time, and users are removed and added in realtime. (no page refresh necessary)



