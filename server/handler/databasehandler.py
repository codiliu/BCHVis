import tornado.web
from tornado.options import options
import globalvar

class DataBaseHandler(tornado.web.RequestHandler):

	def post(self):
		self.set_header('Access-Control-Allow-Origin', "*");
		databasetype = self.get_argument('databasetype')
		dbname = self.get_argument('dbName');
		port = self.get_argument('port');
		host = self.get_argument('host');
		dbconfig = {
			'dbName': dbname,
			'port': int(port),
			'host': host,
		}
		print(dbconfig)
		result = globalvar.g_DataBaseManager.connectDataBase(databasetype, dbconfig);		
		
		self.write({
			'sus': result,
		})
