import globalvar
import time
from db.mongodb.mongodbmanager import MongoDBManager
from db.mongodb.mongoQueryUtil import MongoQueryUitl
# global g_DataBaseManager
class DataReader():
	def __init__(self):
		print("[PointReadWriter]: initiate")
	#Given the DataSetName, query points by abstract atti constriant,
	# and geometirc constraint
	def queryPoints(self, constraint):
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];
			if('geoquery' in constraint):
				geoquery = {}
			else:
				geoquery = constraint['geoquery'];			
			return globalvar.g_DataBaseManager.query(dataBaseType, dataSetName, 'point', geoquery);
		except:
			print('[PointReader] query constraint error')
			return [];
		return [];

	def queryCurtime(self, constraint):
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];	

			return globalvar.g_DataBaseManager.queryCurtime(dataBaseType, dataSetName, constraint);
		except:
			print('[CurtimeReader] query constraint error')
			return 

	def queryMonthSta(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];	
			return globalvar.g_DataBaseManager.queryMonthSta(dataBaseType, dataSetName, constraint);
		except:
			print('[CurtimeReader] query constraint error')
			return 

	def queryDaySta(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];
			dateTime = constraint['dateTime'];	
			return globalvar.g_DataBaseManager.queryDaySta(dataBaseType, dataSetName, dateTime);
		except:
			print('[CurtimeReader] query constraint error')
			return 
	def queryCDM(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];
			stTime = constraint['stTime'];
			enTime = constraint['enTime'];
			return globalvar.g_DataBaseManager.queryCDM(dataBaseType, dataSetName, stTime, enTime);
		except:
			print('[CDMReader] query constraint error')
			return 

	def queryCallsign(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];
			dataSetCallsign = constraint['callsign'];
			return globalvar.g_DataBaseManager.queryCallsign(dataBaseType, dataSetName, dataSetCallsign);
		except:
			print('[CallsignReader] query constraint error')
			return 



	def queryFilterCircle(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];
			query = constraint['query'];

			start = time.clock()
			result =  globalvar.g_DataBaseManager.queryFilterCircle(dataBaseType, dataSetName, query);
			end = time.clock()
			print('queryFilterCircle running time: %s Seconds'%(end-start))

			return result
		except:
			print('[filterCircleReader] query constraint error')
			return 

	def queryFixpot(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];

			return globalvar.g_DataBaseManager.queryFixpot(dataBaseType, dataSetName);
		except:
			print('[CurtimeReader] query constraint error')
			return 	

	def queryAirport(self, constraint):
		
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];

			return globalvar.g_DataBaseManager.queryAirport(dataBaseType, dataSetName);
		except:
			print('[AirportReader] query constraint error')
			return 

	def queryTrajID(self, constraint):
		#print(constraint)
		try:			
		# '''
		# 	databasetype: 'mongodb' etc.
		# 	datasetname: collection name, e.g. 'airflight'
		# 	geoquery: the query constraint, if not exist, return 	
		# '''
			dataBaseType = constraint['databasetype'];
			dataSetName = constraint['datasetname'];	
			trajName = constraint['trajid'];	
			#print(dataSetName)
			#print(dataBaseType)
			#print(trajName)
			return globalvar.g_DataBaseManager.queryTrajID(dataBaseType, dataSetName, trajName);
		except:
			print('[TrajIDReader] query constraint error')
			return [];
		return [];

class PointQueryConstraint():
	def __init__(self, constraint): 
		self.m_DataSetName = ""
		self.m_AbsAttCon = []
		self.m_GeoCon = []