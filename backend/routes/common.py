from flask_restx import Resource
from flask import Flask, request, session, g

class login(Resource):
  def get(self):
    c = g.db.cursor()
    username = request.args.get('user_name')
    pwd = request.args.get('password')
    r = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][3]
    admin = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][1]
    gender = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][4]
    birthday = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][5]
    genre = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][7]
    acc_id = c.execute('SELECT * from Account_details WHERE username = ?', (username,)).fetchall()[0][0]
    if pwd == r:
        session['username'] = username
        session['adminaccess']=admin
        session['gender'] = gender
        session['birthday']= birthday
        session['genre_bias'] = genre
        session['acc_id'] = acc_id
        result = {
          'message': 'Log in success',
          'data': {
            'username':username,
            'adminaccess':admin,
            'gender':gender,
            'birthday':birthday,
            'genre_bias':genre,
            'acc_id':acc_id
          },
          'code': 0
        }
        return result, 200
    else:
        return {'message': 'Login failed', 'code': 1}


class logout(Resource):
  def get(self):
    if session.get('username', None) is None:
      return {'message': 'Please Log In First', 'code': 1}
    else:
      session.pop('username')
      return {'message': 'Log out success', 'code': 0}


class signup(Resource):
  def get(self):
    c = g.db.cursor()
    username = request.args.get('username')
    if len(c.execute("SELECT * from Account_details WHERE username = ?", (username,)).fetchall()) > 0:
      return {"message": "Sign up fail, username used.", "code": 1}

    password = request.args.get('password')
    gender = request.args.get('gender')
    birthday = request.args.get('birthday')
    genre_bias = request.args.get('genre_bias')
    email = request.args.get('email')
    security_question = request.args.get('security_question')
    security_answer = request.args.get('security_answer')
    c.execute("INSERT into Account_details('admin_access','username','password','gender','birthday','user_status','genre_bias', 'email', 'security_question', 'security_answer')" 
              "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('N', username, password, gender, birthday, 'On', genre_bias, email, security_question, security_answer))
    return {"message": "Sign up success", "code": 0}


class forget_password(Resource):
  def get(self):
    c = g.db.cursor()

    username = request.args.get('username')
    security_question = request.args.get('security_question')
    security_answer = request.args.get('security_answer')
    new_password = request.args.get('new_password')

    target_user = c.execute("SELECT * from Account_details WHERE username = ?", (username,)).fetchall()
    if len(target_user) == 0:
      return {"message": "Username not exist", "code": 1}
    
    if security_question != target_user[0][9] or security_answer != target_user[0][10]:
      return {"message": "Security check failed", "code": 1}
    else:
      c.execute('UPDATE Account_details SET password=? WHERE username=?', (new_password, username))
      return {"message": "Change password successfully", "code": 0}


class get_security_question(Resource):
  def get(self):
    c = g.db.cursor()

    username = request.args.get('username')

    target_user = c.execute("SELECT * from Account_details WHERE username = ?", (username,)).fetchall()
    if len(target_user) == 0:
      return {"message": "Username not exist", "code": 1}
    else:
      return {"message": "Get security question successfully", "code": 0, "data": target_user[0][9]}
