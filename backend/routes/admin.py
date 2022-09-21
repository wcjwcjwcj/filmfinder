from flask import Flask, request, session, g, make_response
from flask_restx import Resource, Api, fields
from utils import genrelist, allowed_file, admin_auth
from werkzeug.utils import secure_filename
import re
import os

IMG_SAVE_PATH = '../frontend/public/backend-images/'

class admin_upload(Resource):
  @admin_auth
  def post(self):
    c = g.db.cursor()
    name = request.form['movie_name']
    director= request.form['director']
    genre = request.form['genre_list']
    country = request.form['country']
    synopsis = request.form['synopsis']
    count = 0
    year = request.form['production_year']
    studio = request.form['studio']
    casts = request.form['cast_list']
    id = 0
    if len(c.execute('SELECT movie_id from Movie').fetchall()) >= 1:
      currentid = c.execute('SELECT movie_id from Movie').fetchall()[-1][0]
      id = currentid + 1

    picture = request.files['file']
    file_name = ''
    if picture and allowed_file(picture.filename):
      file_name = str(id) + '.' + picture.filename.rsplit('.', 1)[1].lower()
      file_path = os.path.join(IMG_SAVE_PATH, file_name)
      picture.save(file_path)
    
    c.execute("INSERT into Movie('movie_id','movie_name','director','genre_list','country','synopsis','click_count','production_year','studio','cast_list','picture')"
              "values (?, ?, ?, ?, ?, ?, ?, ?,?,?,?)",
              (id, name,director,genre,country,synopsis,count,year,studio,casts,file_name))
    return {'message': 'Uploaded Success', 'code': 0}

  def get(self):
    upload_page = '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post action=/admin/import enctype=multipart/form-data>
      <input type=text name=name value=moviename>
      <input type=text name=director value=director>
      <input type=text name=genre_list value=Comedy>
      <input type=text name=country value=country>
      <input type=text name=synopsis value=synopsis>
      <input type=number name=click_count value=0>
      <input type=text name=released_year value=released_year>
      <input type=text name=studio value=studio>
      <input type=text name=cast_list value=cast_list>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
    headers = {'Content-Type': 'text/html'}
    return make_response(upload_page, 200, headers)



class admin_delete(Resource):
  @admin_auth
  def get(self):
    c = g.db.cursor()
    id = request.args.get('id')
    if len(c.execute('SELECT * from Movie WHERE movie_id = ?',(id,)).fetchall()) > 0:
      c.execute("DELETE from movie WHERE movie_id = ?", (id,))
      return {'message':'Delete Success', 'code': 0}
    else:
      return {'message':'Invalid ID given, Please input the correct movie ID', 'code': 1}


class admin_update(Resource):
  @admin_auth
  def post(self):
    c = g.db.cursor()
    id = request.form['id']
    if len(c.execute('SELECT * from Movie WHERE movie_id = ?',(id,)).fetchall()) < 0:
      return {'message': 'No movie found for movie {id}', 'code': 1}
    else:
      if request.form['movie_name']:
        c.execute('UPDATE Movie SET movie_name=? WHERE movie_id = ?',(request.form['movie_name'],id))
      if request.form['director']:
        c.execute('UPDATE Movie SET director=? WHERE movie_id = ?',(request.form['director'],id))
      if request.form['genre_list']:
        c.execute('UPDATE Movie SET genre_list=? WHERE movie_id = ?',(request.form['genre_list'],id))
      if request.form['synopsis']:
        c.execute('UPDATE Movie SET synopsis=? WHERE movie_id = ?',(request.form['synopsis'],id))
      if request.form['country']:
        c.execute('UPDATE Movie SET country=? WHERE movie_id = ?',(request.form['country'],id))
      if request.form['production_year']:
        c.execute('UPDATE Movie SET production_year=? WHERE movie_id = ?',(request.form['production_year'],id))
      if request.form['studio']:
        c.execute('UPDATE Movie SET studio=? WHERE movie_id = ?',(request.form['studio'],id))
      if request.form['cast_list']:
        c.execute('UPDATE Movie SET cast_list=? WHERE movie_id = ?',(request.form['cast_list'],id))
      picture = ''
      try:
        picture = request.files['file']
      except:
        pass
      if picture and allowed_file(picture.filename):
        file_name = str(id) + '.' + picture.filename.rsplit('.', 1)[1].lower()
        file_path = os.path.join(IMG_SAVE_PATH, file_name)
        picture.save(file_path)
        c.execute('UPDATE Movie SET picture=? WHERE movie_id = ?',(file_name,id))
      return {'message':f'Update Success for movie {id}', 'code': 0}
                

SEARCH_COLUMNS = ['movie_name', 'director', 'genre_list', 'country', 'synopsis', 'production_year', 'studio', 'cast_list']
def gen_fuzzy_search_sql(keyword):
  sql = ''
  for column in SEARCH_COLUMNS:
    if sql != '':
      sql += ' OR '
    sql += column + ' LIKE \'%' + keyword + '%\''
  return sql

class admin_search(Resource):
  @admin_auth
  def get(self):
    c = g.db.cursor()
    keyword = request.args.get('keyword')
    if not keyword:
      keyword = ''
    fuzzy_search_condition = gen_fuzzy_search_sql(keyword)
    result = {'code': 0}
    index = 0
    resultlist = []
    for i in c.execute('SELECT * FROM Movie WHERE ' + fuzzy_search_condition).fetchall():
        index = index+1
        resultdict = {
          'movie_id':i[0],
          'movie_name':i[1],
          'director': i[2],
          'genre_list':i[3],
          'country':i[4],
          'synopsis':i[5],
          'click_count':i[6],
          'production_year':i[7],
          'studio':i[8],
          'cast_list':i[9],
          'picture':i[10]
        }

        rating_list = c.execute('SELECT * FROM rating WHERE movie_id=?', [i[0]]).fetchall()
        rating = 'No ratings yet'
        if len(rating_list) > 0:
          rating = 0
          for r in rating_list:
              rating += r[1]
          rating = rating / len(rating_list)
        resultdict['rating'] = rating

        resultlist.append(resultdict)
    result['movie_list'] = resultlist
    
    return result, 200
