#!/usr/bin/env python
#coding:utf-8

import sys
import os
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
from uuid import uuid4
from handler.databasehandler import DataBaseHandler

# from handler.data.pointhandler import PointReadHandler
# from handler.data.pointhandler import PointMetaReadHandler
# from handler.data.pointhandler import PointWriteHandler

from handler.data.pointhandler import TrajIDReadHandler
from handler.data.pointhandler import CurtimeReadHandler
from handler.data.pointhandler import DayStaReadHandler
from handler.data.pointhandler import MonthStaReadHandler
from handler.data.pointhandler import AirportReadHandler
from handler.data.pointhandler import FixpotReadHandler
from handler.data.pointhandler import FliterCircleReadHandler
from handler.data.pointhandler import LoginReadHandler
from handler.data.pointhandler import CDMReadHandler
from handler.data.pointhandler import ProjectionAlgorithmHandler
from handler.data.pointhandler import CallsignReadHandler
from handler.model.logitmodelhandler import LogitModelHandler

# from db.databasemanager import DataBaseManager
# import globalvar
# client_file_root_path = os.path.join(os.path.split(__file__)[0],'../')
# client_file_root_path = os.path.abspath(client_file_root_path)
#print(client_file_root_path)

client_file_root_path = os.getcwd()

url=[
	#database configuration
	(r'/db/connect', DataBaseHandler),

	# (r'/point/query', PointReadHandler),
	# (r'/pointmeta/get', PointMetaReadHandler),
	# #data write api
	# (r'/point/write', PointWriteHandler),
	(r'/query/trajID', TrajIDReadHandler),
	(r'/query/curtime', CurtimeReadHandler),
	#get current 2 hour time data 
	(r'/query/daysta', DayStaReadHandler),
	#
	(r'/query/monthsta', MonthStaReadHandler),
	
	(r'/query/airports', AirportReadHandler),
	(r'/query/fixpot', FixpotReadHandler),
	(r'/query/filtercircle', FliterCircleReadHandler),
	(r'/query/projectionAlgorithm', ProjectionAlgorithmHandler),
	(r'/query/cdm', CDMReadHandler),
	(r'/login', LoginReadHandler),
	(r'/query/callsign', CallsignReadHandler),

	(r'/logitmodel', LogitModelHandler),

	(r'/(.*)', tornado.web.StaticFileHandler, {'path': client_file_root_path, 'default_filename': 'index.html'}) # fetch client files
]
