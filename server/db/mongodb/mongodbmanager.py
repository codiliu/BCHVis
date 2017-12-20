import pymongo
from pymongo import MongoClient
# import mongoQueryUtil
import time
# from datastru.pointstru import Point
# import fileopt
import pandas as pd

class MongoDBManager():
	def __init__(self): #, dbName, host = "192.168.10.9", port=27066):
		print('[MongoDBManager] initiate')

		self._host = "192.168.10.9"
		self._port = 27066
		self._dbName = None
		self._client = None
		self._db = None

	#api to DataBaseManager
	def connectDB(self, dbConfig):
		''''
		dbConfig: config 'dbName', 'port', 'host'
		'''

		if(self._client == None):

			if('host' in dbConfig):
				self._host = dbConfig['host']
			if('port' in dbConfig):
				self._port = dbConfig['port']
			if('dbName' in dbConfig):
				self._dbName = dbConfig['dbName']

			self.m_Conn = MongoClient(self._host, self._port)
			try:
				print('[MongoDBManager] connecting...')
				self._client = pymongo.MongoClient(self._host, self._port,
				                                 serverSelectionTimeoutMS=10*1000, maxPoolSize=100)
				self._client.server_info() # force connection on a request as the
				                     # connect=True parameter of MongoClient seems
				                     # to be useless here
				self._db = self._client.get_database(self._dbName)
				print("[MongoDBManager] connect success! ")
			except pymongo.errors.ServerSelectionTimeoutError as err:
				print("[MongoDBManager] connect fail! ")
				print(err)


	def queryCurtime(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		curtime = condition['curtime']
		# curtime is the 13 bit stamptime
		duration = condition['duration']
		# duratime is the hour
		collection = self._db.get_collection(datasetname)

		#print('datasetname',datasetname)

		start = time.clock()
		if duration==0:
			print('duration',duration)
			cur = collection.find({ '$and' : [{'stTime' : {'$lte' : curtime}}, {'enTime' : {'$gte' : curtime}}] })
		else:
			enTime = curtime + duration*3600*1000
			cur = collection.find({ '$or' : [{'stTime' : {'$gte' : curtime, '$lte' : enTime}}, {'enTime' : {'$gte' : curtime, '$lte' : enTime}}] })

			cur1 = collection.find({ '$and' : [{'stTime' : {'$gte' : curtime}}, {'enTime' : {'$lte' : enTime}}] })

		trajData = []
		for r in cur:
			#if r['arrdir'] == 0 and r['loc']['coordinates'][0][2]==0 or r['arrdir'] == 1 and r['loc']['coordinates'][-1][2]==0:
			if r['loc']['coordinates'][0][2]==0 or r['loc']['coordinates'][-1][2]==0:
				trajData.append(r)

		for r in cur1:
			#if r['arrdir'] == 0 and r['loc']['coordinates'][0][2]==0 or r['arrdir'] == 1 and r['loc']['coordinates'][-1][2]==0:
			if r['loc']['coordinates'][0][2]==0 or r['loc']['coordinates'][-1][2]==0:
				trajData.append(r)

		print("trajData len",len(trajData))

		#collection = self._db.get_collection('CDM')
		# if duration==0:
		# 	print('duration',duration)
		# 	cur = collection.find({ '$and' : [{'stTime' : {'$lte' : curtime}}, {'enTime' : {'$gte' : curtime}}] })
		# else:
		# 	enTime = curtime + duration*3600*1000
		# 	cur = collection.find({ '$or' : [{'stTime' : {'$gte' : curtime, '$lte' : enTime}}, {'enTime' : {'$gte' : curtime, '$lte' : enTime}}] })

		# 	cur1 = collection.find({ '$and' : [{'stTime' : {'$gte' : curtime}}, {'enTime' : {'$lte' : enTime}}] })

		end = time.clock()
		print('query curtime time: %s Seconds'%(end-start))

		CDMData = []

		# start = time.clock()
		# for r in cur:
		# 	CDMData.append(r)

		# for r in cur1:
		# 	CDMData.append(r)

		# print(len(CDMData))
		# end = time.clock()
		print('query curtime time: %s Seconds'%(end-start))

		#print("****")
		#print(len(res))
		
		#print(len(res))
		return {'trajData':trajData,'CDMData':CDMData}

	def queryMonthSta(self, datasetname, dateRange):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query monthSta data from', datasetname)

		#print(dateRange)

		#print("AAA",datasetname)
		collection = self._db.get_collection(datasetname)

		cur = collection.find()
		#cur = collection.find({'time' : {'$gte' : dateRange['stTime'], '$lte' : dateRange['enTime']}})

		res = []
		for r in cur:
			res.append(r)

		print('Mon Num',len(res))

		return res

	def queryDaySta(self, datasetname, dateTime):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query dataTime data from', datasetname)
		
		collection = self._db.get_collection(datasetname)
		

		# cursor = db_collection.find()
		

		print(datasetname)
		start = time.clock()

		if dateTime=='*':
			cur = collection.find()
		else:
			cur = collection.find({'time': dateTime})
		
		end = time.clock()
		print('query day time1: %s Seconds'%(end-start))
		
		start = time.clock()
		res = []

		#print("AAA", cur)
		#cur.bath_size(100000)

		res = list(cur)
		print("AAA", len(res))
		# for r in cur:
		# 	res.append(r)
		# 	#break
		
		# print('Day Num',len(res))

		# print(len(res))
		end = time.clock()
		print('query day time2: %s Seconds'%(end-start))
		
		return res

	def queryCDM(self, datasetname, stTime, enTime):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query dataTime data from', datasetname)

		collection = self._db.get_collection(datasetname)

		cur = collection.find({ '$or' : [{'stTime' : {'$gte' : stTime, '$lte' : enTime}}, {'enTime' : {'$gte' : stTime, '$lte' : enTime}}] })
		
		CDMData = []
		for r in cur:
			CDMData.append(r)
		
		return CDMData

	def queryCallsign(self, datasetname, callsign):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query dataTime data from', datasetname)

		collection = self._db.get_collection(datasetname)
		cur = collection.find({"航班号":callsign})

		res = []
		#print(cur)
		for r in cur:
			res.append(r)
		
		return res



	def queryAirport(self, datasetname):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query dataTime data from', datasetname)
		collection = self._db.get_collection(datasetname)
		cur = collection.find()

		res = []
		for r in cur:
			res.append(r)
		return res


	def queryTrajDay(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query ', datasetname)
		#print(datasetname)
		day = 24*3600*1000
		cur = self._db.get_collection(datasetname).find({ '$or' : [{'stTime' : {'$gte' : condition, '$lte' : condition+day}}, {'enTime' : {'$gte' : condition, '$lte' : condition+day}}] })
		res = []
		for r in cur:
			res.append(r)
		return res

	def queryAllTraj(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query ', datasetname)
		#print(datasetname)
		cur = self._db.get_collection(datasetname).find({})
		res = []
		for r in cur:
			res.append(r)
		return res

	def queryTrajID(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query ', datasetname)
		print('trajID',datasetname,condition)

		cur = self._db.get_collection(datasetname).find({'trajID': condition})
		res = []


		for r in cur:
			res.append(r)
			
		return res[0]

	def queryCDMTrajID(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		#print('[MongoDBManager] query ', "CDM")
		#print(datasetname)
		cur = self._db.get_collection("CDM").find({'trajID': condition})
		res = []
		for r in cur:
			res.append(r)
		return res

	def query(self, datasetname, condition):
		''''
			query by geometic condition
		'''
		#print(444444444)

		#print(condition)
		#print('[MongoDBManager] query ', datasetname)
		
		collection = self._db.get_collection(datasetname)
		cur = collection.find(condition)
		res = []
		for r in cur:
			res.append(r)
		return res
		# print("[MongoDBManager] query points by constraint");
		# #todo
		# liPoint = [];
		# #point = Point()
		# return liPoint;

	def write(self, datasetname, dataList):
		''''
		dataList must in GeoJson format! 
		Each enrty has 'loc' field with 'type' and 'coordinates'
		'''
		collection = self._db.get_collection(datasetname)
		collection.insert_many(dataList)

	def build2dsphereIndexes(self, datasetname):
		collection = self._db.get_collection(datasetname)
		collection.create_index([( "loc" , "2dsphere" )] )

	#check if datasetname exist for datatype, e.g. point
	def isDataSetNameExist(self, datatype, datasetname):
		# datafile = "";
		# if(datatype == 'point'):
		# 	datafile = "PointFileList";
		# doc = self.m_DB[datafile].find_one({"datasetname": datasetname})
		# if(doc == None):
		# 	return False;
		return True;
