from flask import Flask, request, session, g
from flask_restx import Resource
from utils import user_auth
import re
import time

SEARCH_COLUMNS = ['movie_name', 'director', 'genre_list', 'country', 'synopsis', 'production_year', 'studio', 'cast_list']

def gen_fuzzy_search_sql(keyword):
  sql = ''
  for column in SEARCH_COLUMNS:
    if sql != '':
      sql += ' OR '
    sql += column + ' LIKE \'%' + keyword + '%\''
  return sql


class search_by_keywords(Resource):
  @user_auth
  def get(self):
    c = g.db.cursor()
    keyword = request.args.get('keyword')
    if not keyword:
      keyword = ''
    fuzzy_search_condition = gen_fuzzy_search_sql(keyword)
    resultlist = []
    for i in c.execute('SELECT * FROM Movie WHERE ' + fuzzy_search_condition).fetchall():
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
    return {'code': 0, 'message': 'Search movies success', 'movie_list': resultlist},200


class search_by_id(Resource):
  def get(self):
    c = g.db.cursor()
    id = request.args.get('id')

    i = c.execute('SELECT * FROM Movie WHERE movie_id=?', [id]).fetchall()[0]
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

    return {'code': 0, 'message': 'Search movies success', 'movie': resultdict},200


class search_by_wishlist_id(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        wishlist_id = request.args.get('wishlist_id')
        wishlist = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_id=?', [wishlist_id]).fetchall()
        movie_id_list = []
        if len(wishlist) == 0:
            return {'code': 1, 'message': 'Wishlist not exist'}
        else:
            movie_id_list = wishlist[0][2].split(',')
        if len(movie_id_list) == 0:
            return {'code': 0, 'message': 'There is no movie in this wishlist.', 'movie_list': []}
        else:
            movie_list = []
            for movie_id in movie_id_list:
                movie = c.execute('SELECT * FROM Movie WHERE movie_id=?', [movie_id]).fetchall()
                if len(movie) == 0:
                    continue
                movie = movie[0]
                movie_obj = {
                    'movie_id':movie[0],
                    'movie_name':movie[1],
                    'director': movie[2],
                    'genre_list':movie[3],
                    'country':movie[4],
                    'synopsis':movie[5],
                    'click_count':movie[6],
                    'production_year':movie[7],
                    'studio':movie[8],
                    'cast_list':movie[9],
                    'picture':movie[10]
                }
                rating_list = c.execute('SELECT * FROM rating WHERE movie_id=?', [movie[0]]).fetchall()
                rating = 'No ratings yet'
                if len(rating_list) > 0:
                    rating = 0
                    for r in rating_list:
                        rating += r[1]
                    rating = rating / len(rating_list)
                movie_obj['rating'] = rating
                movie_list.append(movie_obj)
            return {'code': 0, 'message': 'Search movies success', 'movie_list': movie_list}


# search review
class get_review(Resource):
    def get(self):
        c = g.db.cursor()
        id = request.args.get('movie_id')
        user = ''
        acc_id = -1
        if 'username' in session:
            user = session['username']
            acc_id = c.execute('SELECT * from Account_Details WHERE username = ?',(user,)).fetchall()[0][0]
        result_list = []
        for i in c.execute('SELECT * FROM Review_LIST WHERE movie_id = ?', (id,)).fetchall():
            review = {
                'review_id': i[0],
                'movie_id': i[1],
                'review_text': i[2],
                'acc_id': i[3],
                'can_edit': i[3] == acc_id,
                'create_time': i[4],
                'acc_name': i[5],
            }
            if acc_id == i[3]:
                review['editable'] = True
            result_list.append(review)
        return {'code': 0, 'message': 'Search review sucess', 'list': result_list}


# create review
class review(Resource):
  @user_auth
  def get(self):
    c = g.db.cursor()
    id = request.args.get('movie_id')
    review = request.args.get('review')
    user = session['username']
    acc_id = c.execute('SELECT * from Account_Details WHERE username = ?',(user,)).fetchall()[0][0]
    if len(c.execute('SELECT * from Movie WHERE movie_id = ?',(id,)).fetchall())==0:
        return {'message':'No Such Movie','code': 1}
    else:
        t = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        movie_id = id
        if len(c.execute('SELECT * from Review_LIST').fetchall())>0:
            currentid = c.execute('SELECT * from Review_LIST').fetchall()[-1][0]
            review_id = currentid + 1
        else:
            review_id = 0
               
        c.execute("INSERT into Review_LIST('review_id','movie_id','review_text','acc_id','create_time', 'acc_name')"
                  "values (?, ?, ?, ?, ?, ?)",
                  (review_id, movie_id,review,acc_id,t, user))  
        return {'message':'Review Created','code': 0}
    
# update a review
class update_review(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        review_id = request.args.get('review_id')
        review = request.args.get('new_review')
        user = session['username']
        acc_id = c.execute('SELECT * from Account_Details WHERE username = ?',(user,)).fetchall()[0][0]
        if len(c.execute('SELECT * from Review_LIST WHERE review_id = ?',(review_id,)).fetchall())==0:
            return {'message':'No review Found', 'code': 1}
        else:
            user = c.execute('SELECT * from Review_LIST WHERE review_id = ?',(review_id,)).fetchall()[0][3]
            if acc_id == user:
                c.execute('UPDATE Review_LIST SET review_text=? WHERE review_id = ?',(review,review_id))
                return {'message':'Review Updated', 'code': 0}
            else:
                return {'message':'You are not allowed to change this review','code': 1}
    
# delete a review
class delete_review(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        review_id = request.args.get('review_id')
        user = session['username']
        acc_id = session['acc_id']
        if len(c.execute('SELECT * from Review_LIST WHERE review_id = ?',(review_id,)).fetchall())==0:
            return {'message':'No review Found', 'code': 1}
        else:
            review_acc_id = c.execute('SELECT * from Review_LIST WHERE review_id = ?',(review_id,)).fetchall()[0][3]
            if acc_id == review_acc_id:
                c.execute("DELETE from Review_LIST WHERE review_id = ?", (review_id,))
                return {'message':'Delete Success','code':0}
            else:
                return {'message':'You are not allowed to change this review','code': 1}

# create a rating
class rate(Resource):
  @user_auth
  def get(self):
    c = g.db.cursor()
    id = request.args.get('movie_id')
    rate = request.args.get('rating')
    acc_id = session['acc_id']

    if rate.isdigit() == True and 1<=int(rate)<=5:
        rate = int(rate)
    else: 
        return {'message':'Please input a valid rating', 'code': 1}

    if len(c.execute('SELECT * from Movie WHERE movie_id = ?',(id,)).fetchall())==0:
        return {'message':'No Such Movie'}
    elif len(c.execute('SELECT * from rating WHERE movie_id = ? and acc_id = ?',(id,acc_id)).fetchall())==0:
        # new rate
        t = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        c.execute("INSERT into rating('movie_id','rating','acc_id')"
                  "values (?, ?, ?)",
                  (id, rate,acc_id))  
        return {'message':'Review Created', 'code': 0}
    else:
        # update rate
        c.execute('UPDATE rating SET rating=? WHERE movie_id = ? and acc_id = ?',(rate,id,acc_id))
        return {'message':'Rating Updated', 'code': 0}


class get_rate(Resource):
    def get(self):
        c = g.db.cursor()
        movie_id = request.args.get('movie_id')
        acc_id = session['acc_id']
        if len(c.execute('SELECT * from rating WHERE movie_id = ? and acc_id = ?',(movie_id,acc_id)).fetchall())==0:
            return {'rating': 0, 'code': 0}
        else:
            return {'rating': c.execute('SELECT * from rating WHERE movie_id = ? and acc_id = ?',(movie_id,acc_id)).fetchall()[0][1], 'code': 0}
        
                
# create a wishlist
class create_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        user = session['username']
        acc_id = session['acc_id']

        wishlist_name = request.args.get('wishlist_name')
        public = request.args.get('public_or_not')
        share_list = request.args.get('user_to_share')
        movie_list = request.args.get('movie_list')
        if not share_list:
            share_list = ''
        if not movie_list:
            movie_list = ''
        wishlist_id = 0
        create_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

        if public != 'Y' and public != 'N':
            return {'message':'Please input a valid public setting', 'code': 1}
        else:
            if len(c.execute('SELECT wishlist_id from Wish_LIST').fetchall()) >= 1:
                currentid = c.execute('SELECT wishlist_id from Wish_LIST').fetchall()[-1][0]
                wishlist_id = currentid + 1
            
            if share_list:
                for user in share_list.split(','):
                    if len(c.execute('SELECT * from Account_Details WHERE username=?',(user,)).fetchall())==0:
                        return {'message':'Please input a valid user', 'code': 1}
            
            c.execute("INSERT into Wish_LIST('wishlist_id','wishlist_name','movie_list','create_time','acc_id','share_list','public')"
                    "values (?, ?, ?, ?, ?, ?, ?)",
                    (wishlist_id, wishlist_name,movie_list,create_time,acc_id,share_list,public))

            return {'message':'Wishlist Created', 'code': 0}


class get_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        user = session['username']
        acc_id = session['acc_id']
        keyword = request.args.get('keyword')
        if not keyword:
            keyword = ''
        wishlist = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_name LIKE \'%' + keyword + '%\'').fetchall()
        result = []
        for record in wishlist:
            can_see = False
            can_edit = False
            if record[4] == acc_id:
                # owner
                can_see = True
                can_edit = True
            elif user in record[5].split(','):
                # in share list
                can_see = True
                can_edit = True
            elif record[6] == 'Y':
                # public
                can_see = True

            if can_see:
                wishlist_item = {
                    'wishlist_id': record[0],
                    'wishlist_name': record[1],
                    'movie_list': record[2],
                    'create_time': record[3],
                    'acc_id': record[4],
                    'share_list': record[5],
                    'public': record[6],
                    'can_edit': can_edit,
                    'can_delete': record[4] == acc_id,
                }
                owner = c.execute('SELECT * from Account_Details WHERE acc_id = ?',(record[4],)).fetchall()
                if len(owner) == 0:
                    continue
                wishlist_item['acc_name'] = owner[0][2]
                result.append(wishlist_item)
        return {'data': result, 'code': 0, 'message': 'Search wishlist success.'}


class update_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        user = session['username']
        acc_id = session['acc_id']

        wishlist_id = request.args.get('wishlist_id')
        wishlist_name = request.args.get('wishlist_name')
        public = request.args.get('public_or_not')
        share_list = request.args.get('user_to_share')
        movie_list = request.args.get('movie_list')
        if not share_list:
            share_list = ''
        if not movie_list:
            movie_list = ''

        update_target = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_id = ?', (wishlist_id,)).fetchall()
        if len(update_target) == 0:
            return {'message':'Please choose a valid wishlist', 'code': 1}
        else:
            can_edit = False
            if update_target[0][4] == acc_id:
                # owner
                can_edit = True
            elif user in update_target[0][5].split(','):
                # in share list
                can_edit = True
            if not can_edit:
                return {'message':'You are not allowed to change this wishlist', 'code': 1}
            
        if share_list:
            for user in share_list.split(','):
                if len(c.execute('SELECT * from Account_Details WHERE username=?',(user,)).fetchall())==0:
                    return {'message':'Please input a valid user', 'code': 1}

        c.execute(
            'UPDATE Wish_LIST SET wishlist_name=?,public=?,share_list=?,movie_list=? WHERE wishlist_id=?',
            (wishlist_name, public, share_list, movie_list, wishlist_id)
        )
        return {'message': 'Update wishlist success', 'code': 0}


class delete_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        user = session['username']
        acc_id = session['acc_id']

        wishlist_id = request.args.get('wishlist_id')

        delete_target = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_id=?', (wishlist_id,)).fetchall()
        if len(delete_target) == 0 or delete_target[0][4] != acc_id:
            return {'message': 'Please choose a valid wishlist', 'code': 1}
        
        c.execute('DELETE from Wish_LIST WHERE wishlist_id=?', (wishlist_id,))
        return {'message': 'Delete success', 'code': 0}


class exist_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()
        user = session['username']
        wishlist_id = request.args.get('wishlist_id')

        exist_target = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_id=?', (wishlist_id,)).fetchall()
        if len(exist_target) == 0:
            return {'message': 'Please choose a valid wishlist', 'code': 1}
        
        share_list = exist_target[0][5].split(',')
        if user not in share_list:
            return {'message': 'You are not shared by the owner', 'code': 1}
        
        share_list.remove(user)
        c.execute(
            'UPDATE Wish_LIST SET share_list=? WHERE wishlist_id=?',
            (','.join(share_list), wishlist_id)
        )
        return {'message': 'Exist success', 'code': 0}


class add_movie_into_wishlist(Resource):
    @user_auth
    def get(self):
        c = g.db.cursor()

        wishlist_id = request.args.get('wishlist_id')
        movie_id = request.args.get('movie_id')

        if len(c.execute('SELECT * FROM Movie WHERE movie_id=?', [movie_id]).fetchall()) == 0:
            return {'message': 'Movie not exist', 'code': 1}

        wishlist = c.execute('SELECT * FROM Wish_LIST WHERE wishlist_id=?', (wishlist_id,)).fetchall()
        if len(wishlist) == 0:
            return {'message': 'Wishlist not exist', 'code': 1}
        else:
            wishlist = wishlist[0]
        movie_list = wishlist[2].split(',')
        
        if str(movie_id) in movie_list:
            return {'message': 'Wishlist already include this movie', 'code': 1}
        else:
            movie_list.append(movie_id)
            c.execute(
                'UPDATE Wish_LIST SET movie_list=? WHERE wishlist_id=?',
                (','.join(movie_list), wishlist_id)
            )
            return {'message': 'Add success', 'code': 0}


from utils import get_ip

class get_host_ip(Resource):
    def get(self):
        return {'message': 'Get host success', 'data': get_ip(), 'code': 0}
