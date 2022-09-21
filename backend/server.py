import re
from flask import Flask, request, session, g
from flask_restx import Resource, Api, fields 
from db import get_db, close_db, init_db, insert_test_data
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
api = Api(app)
app.secret_key = "super secret key"
# Create a new connection when a new request comes in.
app.before_request(get_db)
# Release the connection at the end of the request.
app.teardown_request(close_db)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = False


# log in
from routes.common import login, logout, signup, forget_password, get_security_question
api.route('/login')(login)
api.response(200, 'Log In Success')(login)
api.response(400, 'Permission Denied')(login)
api.doc(params={
    'user_name': 'user name',
    'password': 'password'}
)(login)


# log out
api.route('/logout')(logout)
api.response(200, 'Log Out Success')(logout)

# sign up
api.route('/signup')(signup)
api.response(200, 'Sign Up Success')(signup)
api.doc(params={
    'username': '',
    'password': '',
    'gender': '',
    'birthday': '',
    'genre_bias': '',
})(signup)

# forget password
api.route('/forget_password')(forget_password)
api.response(200, 'Sign Up Success')(forget_password)
api.doc(params={
    'username': '',
    'security_question': '',
    'security_answer': '',
    'new_password': '',
})(forget_password)

# get security question
api.route('/get_security_question')(get_security_question)
api.response(200, 'Sign Up Success')(get_security_question)
api.doc(params={
    'username': '',
})(get_security_question)
    

# admin upload the movie
from routes.admin import admin_upload
api.route('/admin/import')(admin_upload)
api.response(200, 'Imported Success')(admin_upload)
api.response(201, 'Created Success')(admin_upload)
api.response(400, 'Permission Denied')(admin_upload)
api.doc(params={
    'movie_name': 'movie name',
    'director': 'directo name',
    'genre_list':'genre: eg. horror/comedy',
    'country':'movie country',
    'synposis':'movie summary',
    'production_year':'year',
    'studio':'studio name',
    'cast_list':'eg.Anne Hathaway/Jessica Chastain',
    'file':'movie picture'}
)(admin_upload)

# admin delete a movie
from routes.admin import admin_delete
api.route('/admin/delete')(admin_delete)
api.doc(params={'id': 'Movie ID from Database'})(admin_delete)


# search by keywords for admin
from routes.admin import admin_search
api.route('/admin/search')(admin_search)
api.doc(params={'keyword': ''})(admin_search)

#admin update
from routes.admin import admin_update

api.route('/admin/update')(admin_update)
api.doc(params={'id': 'Movie ID from Database'})(admin_update)



# user search by keywords 
from routes.user import search_by_keywords
api.route('/user/search')(search_by_keywords)
api.doc(params={
    'keyword': ''}
)(search_by_keywords)


# user search by id 
from routes.user import search_by_id
api.route('/user/search_by_id')(search_by_id)
api.doc(params={
    'id': ''}
)(search_by_id)


from routes.user import search_by_wishlist_id
api.route('/user/search_by_wishlist_id')(search_by_wishlist_id)
api.doc(params={
    'wishlist_id': ''}
)(search_by_wishlist_id)


# user write reviews
from routes.user import review
api.route('/user/review')(review)
api.doc(params={'movie_id': '',
                'review':''})(review)

# user update reviews
from routes.user import update_review
api.route('/user/update_review')(update_review)
api.doc(params={'review_id': '',
                'new_review':''})(update_review)

# user get reviews
from routes.user import get_review
api.route('/user/get_review')(get_review)
api.doc(params={'review_id': ''})(get_review)

# user delete reviews
from routes.user import delete_review
api.route('/user/delete_review')(delete_review)
api.doc(params={'review_id': ''})(delete_review)

# user rate a movie
from routes.user import rate
api.route('/user/rate')(rate)
api.doc(params={'movie_id': '',
                'rating': '1 - 5 '})(rate)

# user get rate
from routes.user import get_rate
api.route('/user/get_rate')(get_rate)
api.doc(params={'movie_id': ''})(get_rate)

# user create wishlist
from routes.user import create_wishlist
api.route('/user/create_wishlist')(create_wishlist)
api.doc(params={
    'wishlist_name':'wishlist name',
    'public_or_not':'Y for Public, N for Private',
    'user_to_share':'Input the username to share, eg: User 1, User 2, User 3',
    'movie_list':'Choose the movie that include in this wishlist',
})(create_wishlist)

# user update wishlist
from routes.user import update_wishlist
api.route('/user/update_wishlist')(update_wishlist)
api.doc(params={
    'wishlist_id':'wishlist id',
    'wishlist_name':'wishlist name',
    'public_or_not':'Y for Public, N for Private',
    'user_to_share':'Input the username to share, eg: User 1, User 2, User 3',
    'movie_list':'Choose the movie that include in this wishlist',
})(update_wishlist)

# get wishtlist
from routes.user import get_wishlist
api.route('/user/get_wishlist')(get_wishlist)
api.doc(params={
    'keyword': 'Keywords used to search wishlists'
})(get_wishlist)

# delete wishtlist
from routes.user import delete_wishlist
api.route('/user/delete_wishlist')(delete_wishlist)
api.doc(params={
    'wishlist_id': 'wishlist id you want to delete'
})(delete_wishlist)

# exist wishtlist
from routes.user import exist_wishlist
api.route('/user/exist_wishlist')(exist_wishlist)
api.doc(params={
    'wishlist_id': 'wishlist id you want to exist'
})(exist_wishlist)

# add movie into wishtlist
from routes.user import add_movie_into_wishlist
api.route('/user/add_movie_into_wishlist')(add_movie_into_wishlist)
api.doc(params={
    'wishlist_id': 'wishlist id which is your target',
    'movie_id': 'movie_id id you want to add'
})(add_movie_into_wishlist)

# get host ip
from routes.user import get_host_ip
api.route('/user/get_host_ip')(get_host_ip)
api.doc(params={})(get_host_ip)


if __name__ == '__main__':
  init_db()
  insert_test_data()
  app.debug = True
  app.run(host='0.0.0.0', port=5000)
