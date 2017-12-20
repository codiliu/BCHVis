import time
from db.mongodb.mongodbmanager import MongoDBManager
from db.mongodb.mongoQueryUtil import MongoQueryUitl

class DataBaseManager():
	def __init__(self):
		print("[DataBaseManager]: initiate 1")
		#dababase handler
		self.m_DataBaseHandler = {
			'mongodb': MongoDBManager(),
		}

	#connect to db
	def connectDataBase(self, databasetype, dbconfig):
		# databasetype = databasetype.lower()
		try:
			#self.exitAllDB();
			print('try connect', dbconfig);
			self.m_DataBaseHandler[databasetype].connectDB(dbconfig);
			print(' connect sus')		
			return 'yes'
		except:
			print('[DataBaseManager] connect database error');
		return 'no'

	#exit all db connections
	def exitAllDB(self):
			#TODO
			print('[DataBaseManager] exit all db');

	def queryAllTraj(self, databasetype, datasetname):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		try:
			trajFilter = self.m_DataBaseHandler[databasetype].queryAllTraj(datasetname);
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];

	def queryCurtime(self, databasetype, datasetname, query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()

		try:
			#start = time.clock()
			trajFilter = self.m_DataBaseHandler[databasetype].queryCurtime(datasetname, query);
			end = time.clock()
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];

	def queryMonthSta(self, databasetype, datasetname,query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()

		try:
			start =time.clock()
			trajFilter = self.m_DataBaseHandler[databasetype].queryMonthSta(datasetname,query);
			end = time.clock()
			print('query mon time: %s Seconds'%(end-start))

			return trajFilter
		except:
			print('[DataBaseManager] query error');
		return [];

	def queryDaySta(self, databasetype, datasetname, dateTime):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()

		try:
			#start = time.clock()
			trajFilter = self.m_DataBaseHandler[databasetype].queryDaySta(datasetname, dateTime);
			#end = time.clock()
			#print('query day time: %s Seconds'%(end-start))
			
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query day error');
		return [];


	def queryCDM(self, databasetype, datasetname, stTime, enTime):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		#print("CDMMMMMMMM22")
		try:
			trajFilter = self.m_DataBaseHandler[databasetype].queryCDM(datasetname, stTime, enTime);
			#print(query)
			
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];


	def queryCallsign(self, databasetype, datasetname, callsign):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		#print("CDMMMMMMMM22")
		try:
			trajFilter = self.m_DataBaseHandler[databasetype].queryCallsign(datasetname, callsign);
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];

	


	def queryAirport(self, databasetype, datasetname):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		
		try:
			start = time.clock()
			trajFilter = self.m_DataBaseHandler[databasetype].queryAirport(datasetname);
			end = time.clock()
			print('query airport time: %s Seconds'%(end-start))

			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];

	def queryFixpot(self, databasetype, datasetname):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		try:
			start = time.clock()
			trajFilter = self.m_DataBaseHandler[databasetype].queryAirport(datasetname);
			end = time.clock()
			print('query fixpot time: %s Seconds'%(end-start))
			return trajFilter
		except:
			print('[DataBaseManager] query error');
		return [];

	

	def queryTrajDay(self, databasetype, datasetname, query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		try:
			trajFilter = self.m_DataBaseHandler[databasetype].queryTrajDay(datasetname, query);
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];


	def queryTrajID(self, databasetype, datasetname, query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		try:
			trajFilter = self.m_DataBaseHandler[databasetype].queryTrajID(datasetname, query);
			return trajFilter
		except:
			#print(e)
			print('[DataBaseManager] query error');
		return [];


	#Data Access
	#query data (point, ...) by condition

	def queryFilterCircle(self, databasetype, datasetname, query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()

		try:
			#print(333333333)
			

			# condition={'loc':{'$geoWithin':{'$centerSphere':[[116.58417,40.07807],0]}}}
			# print(condition)
			#condition={'loc': {'$geoIntersects': {'$geometry': {'type': 'Polygon', 'coordinates': [[[116.53336, 40.1025], [116.58142, 40.09593], [116.54366, 40.07282], [116.53336, 40.1025]]]}}}}
			#condition={'loc': { '$nearSphere' : [116.58417,40.07807], '$maxDistance': 0.1 } }
			#condition={'loc': { '$geoWithin': { '$centerSphere': [ [116.60133,40.07203], 11111000] } }}
			loc = query['loc']
			dist = query['dist']
			nowTime = query['time']
			curtime = query['curtime']

			x = time.localtime(nowTime/1000)
			name = time.strftime('%Y%m%d',x)
			print("databaseName", name)

			condition={'loc':{'$near': {'$geometry': {'type': "Point" ,'coordinates': loc},'$maxDistance':dist}}}
			start = time.clock()
			result = self.m_DataBaseHandler[databasetype].query(name, condition)
			end = time.clock()
			print('Filter traj running time: %s Seconds'%(end-start))
			
			data=[]
			for index in result:
				if index['stTime']<=curtime and index['enTime']>=curtime:
					data.append(index)
			
			print(len(data))
			CDMData=[]
			#result = self.m_DataBaseHandler[databasetype].query(name, condition)
			start = time.clock()
			for index in data:
				try:
					temp = self.m_DataBaseHandler[databasetype].queryCDMTrajID("CDM", index['trajID']);				
					CDMData.extend(temp)				
				except:
					pass
			end = time.clock()
			print('Filter CDM running time: %s Seconds'%(end-start))	
			print(len(CDMData))
			return {'trajList': data,"CDMData": CDMData};
		except:
			print('[DataBaseManager] query error');
		return [];

	def query(self, databasetype, datasetname, entitytype, query):
		'''' 
			query by geometic condition:
			- databasetype: the type of db, e.g. 'mongodb'
			- datasetname: name of the dataset
			- condition: query constriant 
		'''
		# databasetype = databasetype.lower()
		try:
			print('[DataBaseManager] database handler ', databasetype, datasetname);
			if(databasetype == 'mongodb'):
				if(entitytype == 'point'):
					condition=MongoQueryUitl.pointCondition2mongo(query)			
				elif(entitytype == 'line'):
					condition=MongoQueryUitl.lineCondition2mongo(query)
			print('[query]', condition);

			# condition=MongoQueryUitl.pointCondition2mongo(query)
			return self.m_DataBaseHandler[databasetype].query(datasetname, condition);
		except:
			print('[DataBaseManager] query error');
		return [];

	#write data
	def write(self, databasetype, datasetname, dataList):
		''''
			write data in database:
			- databasetype: the type of db
			- to save dataset name
		'''
		try:
			print('[DataBaseManager] database write ', databasetype, datasetname);
			if(databasetype == 'mongodb'):
				self.m_DataBaseHandler[databasetype].write(datasetname, dataList);
		except:
			print('[DataBaseManager] write error');

	#build up index
	def buildupIndex(self, databasetype, datasetname):
		'''' 
			build up index:
			- databasetype: the type of db
			- datasetname
		'''
		try:
			print('[DataBaseManager] build up index', databasetype, datasetname);
			if(databasetype == 'mongodb'):
				self.m_DataBaseHandler[databasetype].build2dsphereIndexes(datasetname);
		except:
			print('[DataBaseManager] build up index error')

	#write points
	def writePoints(self, pointmeta, lidatadir):
		try:
			print('[DataBaseManager]: write database handler ', self.m_DataBaseType);
			return self.m_DataBaseHandler[self.m_DataBaseType].writePoints(pointmeta, lidatadir);
		except:
			print("[DataBaseManager]: write points error")
			return 'no'


# class ADataBaseManager():
# 	def __init__(self):
# 		print("[ADataBaseManager] initiate");
# 	def connectDB(self):
# 		print("[ADataBaseManager] connect to a specific database");
# 	def queryPoints(self, datasetname, map_absattrcon, map_geocon):
# 		print("[ADataBaseManager] query points by constraint");
#	def writePoints(self, metadatadir, lidatadir):
#		print('[ADataBaseManager] write metadata and points')
