# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.options
import os
import sys
from tornado.options import define, options
import tornado.websocket
import json, ast
import numpy as np
from pymongo import MongoClient

# import frq_path_stat
define("port", default=20768, type=int, help = "run on the given port")
client = MongoClient('192.168.10.9',27066)
os.path.join(os.path.split(__file__)[0],'./cython/arrContain/build/lib/')
# the path to server html, js, css files
client_file_root_path = os.path.join(os.path.split(__file__)[0],'../client')
client_file_root_path = os.path.abspath(client_file_root_path)
# datamanager
# print data_dict_path
print('Init data manager');

# cal_freq = frq_path_stat.FrqPathStat();
class wsHandler(tornado.web.RequestHandler):
    def get(self):
      print('...............wsHandler')
      data = self.get_argument('data');
      message = self.get_argument('message');
      '''
      print(data);
      print(message);
      '''

      # if message == 'GetExampleData':
      #     result = data_manager.getExampleData(data);
   

      # evt_unpacked = {'message': message, 'data': result};
      #print('SEND ', message);
      evt = json.dumps({'success': 'success'})
      self.write(evt);

def queryDatabase(databaseName):
  db = client['vastchallenge2017mc1']
  collection = db[databaseName]
  cur = collection.find({})

  result = []
  for index in cur:
    del index['_id']
    result.append(index)
  return result

def writeDatabase(databaseName,data):
  db = client['vastchallenge2017mc1']
  collection = db[databaseName]
  for index in data:
    del index["deleted"]
    del index["new"]
  cur = collection.insert_many(data)


class checkClassNameHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      print("dawwed")
      self.write({'suc':'success'})

    def get(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      print('...............checkClassNameHandler')
      name = self.get_argument('data');
      message = self.get_argument('message');
      '''
      print(name);
      print(message);
      '''
      console.log("dasdww")
      result = queryDatabase('label')
      flag = "success"
      for index in result:
        #print(index)
        try:
          if index["class"] == name:
            flag = 'fail'
        except:
          pass

      evt_unpacked = {'message': message, 'data': flag};
      #print('SEND ', message);
      evt = json.dumps(evt_unpacked)
      self.write(evt);

# json encode for numpy ndarray and so on
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    print('server running at 127.0.0.1:%d ...'%(tornado.options.options.port))
    app = tornado.web.Application(
        handlers=[
                  (r'/ws', wsHandler),
                  (r'/checkClassName', checkClassNameHandler),
                  # (r'/queryCarList', queryCarListHandler),
                  (r'/(.*)', tornado.web.StaticFileHandler, {'path': client_file_root_path,
                                               'default_filename': 'index.html'}) # fetch client files
                  ],
        debug=True,
    )


    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
