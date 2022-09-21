import re
from flask import session
from functools import wraps
import socket

genrelist = ['Comedy','Horror','Romance','Sci-Fi','Documentary','Drama','Action','Thriller']


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
	return '.' in filename and \
		filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def admin_auth(fn):
	@wraps(fn)
	def with_admin_auth(*args, **kwargs):
		if session.get('username', None) is None:
			return {'message': 'Please Log In First', 'code': 1}, 401
		if session['adminaccess'] != 'Y':
			return {'message': 'You are not an admin, permission denied', 'code': 1}, 403
		return fn(*args, **kwargs)
	return with_admin_auth


def user_auth(fn):
	@wraps(fn)
	def with_user_auth(*args, **kwargs):
		if session.get('username', None) is None:
			return {'message': 'Please Log In First', 'code': 1}, 401
		return fn(*args, **kwargs)
	return with_user_auth


def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
        return ip
