from flask import g
import sqlite3
from utils import genrelist

DB_NAME = 'test.db'

def get_db():
  if 'db' not in g:
    connection = sqlite3.connect(DB_NAME)
    g.db = connection


def close_db(exception):
  db = g.pop('db', None)
  if db is not None:
    db.commit()
    db.close()


def init_db():
  connection = sqlite3.connect(DB_NAME)
  c = connection.cursor()
  c.execute('''CREATE TABLE IF NOT EXISTS Movie
              (
              movie_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              movie_name TEXT NOT NULL,
              director TEXT NOT NULL,
              genre_list LIST,
              country TEXT NOT NULL,
              synopsis TEXT,
              click_count INTEGER NOT NULL,
              production_year INTEGER NOT NULL,
              studio TEXT,
              cast_list LIST NOT NULL,
              picture TEXT);''')
  
  c.execute('''CREATE TABLE IF NOT EXISTS Account_details
              (
              acc_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              admin_access INTEGER NOT NULL,
              username TEXT NOT NULL,
              password TEXT NOT NULL,
              gender TEXT,
              birthday DATE,
              user_status TEXT NOT NULL,
              genre_bias TEXT,
              email TEXT,
              security_question TEXT,
              security_answer TEXT);''')
  
  c.execute('''CREATE TABLE IF NOT EXISTS Review_LIST
              (
              review_id INTEGER NOT NULL,
              movie_id INTEGER NOT NULL,
              review_text TEXT,
              acc_id INTEGER NOT NULL,
              create_time DATETIME NOT NULL,
              acc_name TEXT);''')
  
  c.execute('''CREATE TABLE IF NOT EXISTS rating
              (
              movie_id INTEGER NOT NULL,
              rating INTEGER,
              acc_id INTEGER NOT NULL);''')
  
  c.execute('''CREATE TABLE IF NOT EXISTS Wish_LIST
              (
              wishlist_id INTEGER NOT NULL,
              wishlist_name TEXT,
              movie_list TEXT,
              create_time DATETIME NOT NULL,
              acc_id INTEGER NOT NULL,
              share_list TEXT NOT NULL,
              public TEXT NOT NULL);''')
  connection.commit()
  connection.close()


def insert_test_data():
  connection = sqlite3.connect(DB_NAME)
  c = connection.cursor()
  # ADD ADMIN
  try:
    c.execute("INSERT into Account_details('acc_id', 'admin_access','username','password','gender','birthday','user_status','genre_bias', 'email', 'security_question', 'security_answer')"
              "values ('0', 'Y','admin','123456','null','null','On','null', 'test@test.com', 'who are you', 'jack')")
    c.execute("INSERT into Account_details('acc_id', 'admin_access','username','password','gender','birthday','user_status','genre_bias', 'email', 'security_question', 'security_answer')"
              "values ('1', 'N','user1','123456','null','null','On','null', 'user@test.com', 'who are you', 'rose')")
    c.execute("INSERT into Account_details('acc_id', 'admin_access','username','password','gender','birthday','user_status','genre_bias', 'email', 'security_question', 'security_answer')"
              "values ('2', 'N','user2','123456','null','null','On','null', 'user@test.com', 'who are you', 'tom')")
  except:
    print('Already has admin user.')
    
  connection.commit()
  connection.close()