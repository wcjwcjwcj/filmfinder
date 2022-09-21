# capstone-project-9900-h14q-michaelsangels

# Project Detail
Project Name: Film Share - Movie Finder System Project<br>
Group Members: 
Name | zID | role
-----|-----|-----
Samir Mustavi | zz5084519 | Scrum Master/Back-end Developer
Jiajin Chen | z5337562 | Back-end Developer
Wenwan Yang | z5292190 | Front-end Developer

# Dependencies/tools required are:
+ git 2.25.1
+ Python 3.7
+ node.js 16.15.1
+ reduxjs/toolkit==1.8.2
+ typescripte==4.7.4
+ Flask==2.1.1
+ axios==0.27.2
+ react==18.2.0
+ react-dom==18.2.0
+ react-redux==8.0.2
+ react-router-dom==6.3.0
+ react-scripts==5.0.1
+ redux==4.2.0
+ npm==6.14.6
+ Ant Design==4.21.4

For more dependencies, please read:
## Frontend [frontend dependencies](./frontend/package.json)
## Backend [backend dependencies](./backend/requirements.txt)

# System Architecture
The whole project is based on Python3 framework, create react app and flask are used to build the front-end and back-end. We used SQLite as our database. 

# How to use?

## Set Up
0. Please make sure Python3 and node.js are installed. 
To test our QR Code sharing functionality, please connect your phone which is used to scan the QR code to the same home WiFi or Hotspot as the device that runs the code (No public Wifi should be used as firewalls are set, e.g. no University Wifi. Please use hotspot or home WiFi to test).


1. Create a directory of the project and set the terminal directory to the project directory.

2. Clone the git repository to the local space via command:
```
git clone https://github.com/unsw-cse-comp3900-9900-22T2/capstone-project-9900-h14q-michaelsangels.git
```
3. Go to the backend directory:
```
cd capstone-project-9900-h14q-michaelsangels/backend
```
4. Install all dependencies via command:
```
pip install -r requirements.txt
```
5. Run the backend server via:
```
python server.py
```

6. Start a new terminal and go to the frontend directory via: 
```
cd capstone-project-9900-h14q-michaelsangels/frontend
```
7. Run:
```
npm install
```
8. Run the frontend code by using the following command:
```
npm start 
```
9. Visit the following url from a web browser:
```
http://127.0.0.1:3000
```

# Detailed front end and backend set up, please see:
## Frontend [readme](./frontend/)
## Backend [readme](./backend/)

