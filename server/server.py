# -*- coding: utf-8 -*-
import requests
import time
import random
import json
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
from pymongo import  MongoClient

# import frq_path_stat
define("port", default=22068, type=int, help = "run on the given port")
client = MongoClient('192.168.10.9',27066)
os.path.join(os.path.split(__file__)[0],'./cython/arrContain/build/lib/')
# the path to server html, js, css files
client_file_root_path = os.path.join(os.path.split(__file__)[0],'../client')
client_file_root_path = os.path.abspath(client_file_root_path)
# datamanager
# print data_dict_path
print('Init data manager');

def queryDatabase(databaseName):
  db = client['vastchallenge2017mc1']
  collection = db[databaseName]
  cur = collection.find({})

  result = []
  for index in cur:
    del index['_id']
    result.append(index)
  return result

def extractData(data):
    filterData={}
    filterData['address']=data['address']
    filterData['n_tx']=data['n_tx']
    filterData['total_received']=data['total_received']
    filterData['total_sent']=data['total_sent']
    filterData['final_balance']=data['final_balance']
    filterData['txs']=[]
    for index in data['txs']:
        record={}
        record['inputs']=[]
        record['outputs']=[]
        record['block_height']=index['block_height']
        record['time']=index['time']
        record['tx_index']=index['tx_index']
        record['hash']=index['hash']
        for te in index['inputs']:
            temp={}
            temp['spent']=te['prev_out']['spent']
            temp['tx_index']=te['prev_out']['tx_index']
            temp['addr']=te['prev_out']['addr']
            temp['value']=te['prev_out']['value']
            record['inputs'].append(temp)
            
        for te in index['out']:
            temp={}
            
            try:
                temp['addr_tag_link']=te['addr_tag_link']
            except:
                temp['addr_tag_link']=""
            temp['spent']=te['spent']
            temp['tx_index']=te['tx_index']
            temp['addr']=te['addr']
            temp['value']=te['value']
            record['outputs'].append(temp)
        filterData['txs'].append(record)
    return filterData



def get_page(url):
    user_agent_str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
    time.sleep(random.uniform(0,1))
    return extractData(json.loads(requests.get(url, headers={"Connection":"keep-alive", "User-Agent": user_agent_str}).text))

def filterData(address):
    url = "https://blockchain.info/rawaddr/" + address
    dataArr = get_page(url)
    for i in range(1, 10000):
        url = "https://blockchain.info/rawaddr/" + address +'?offset='
        url += str(i*50)
        data = get_page(url)
        try:
            if len(data['txs']) == 0:
                break
            dataArr['txs'].extend(data['txs'])
        except: 
            break
    return dataArr


def writeDatabase(databaseName,data):
  db = client['vastchallenge2017mc1']
  collection = db[databaseName]
  for index in data:
    del index["deleted"]
    del index["new"]
  cur = collection.insert_many(data)

class wsHandler(tornado.web.RequestHandler):
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
      
      self.write({'suc':'success'})

class addressHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      constraint=self.get_argument('constraint')
      constraint = json.loads(constraint)
      #print(constraint)
      address=constraint['address']
      print("Search " + str(address))

      data = filterData(address)
      addr = []
      addrAll = []
      addrData={}
      for index in data['txs']:
          in_value=0
          out_value=0
          index['core_inputs_n']=0
          index['core_outputs_n']=0
          inputs_filter={}
          outputs_filter={}
          
          # inputs_flag = True
          # outputs_flag = True
          for inputs in index['inputs']:
            in_value+=inputs['value']
            addrAll.append(inputs['addr'])
            if inputs['addr'] not in addr:
              addr.append(inputs['addr'])
            if inputs['addr'] not in inputs_filter.keys():
              inputs_filter[inputs['addr']]=inputs
            else:
              inputs_filter[inputs['addr']]['value']+=inputs['value']
            if inputs['addr']=="1DUMifqLdCRvx6tAzafwDC2tKRntRAAm3z":
              index['core_inputs_n']+=1
            
             
          for outputs in index['outputs']:
            out_value+=outputs['value']
            addrAll.append(outputs['addr'])
            if outputs['addr'] not in addr:
              addr.append(outputs['addr'])
            if outputs['addr'] not in outputs_filter.keys():
              outputs_filter[outputs['addr']]=outputs
            else:
              outputs_filter[outputs['addr']]['value']+=outputs['value']
              
            if outputs['addr']=="1DUMifqLdCRvx6tAzafwDC2tKRntRAAm3z":
              index['core_outputs_n']+=1
          
          index['inputs'] = list(inputs_filter.values())
          #index['outputs'] = list(outputs_filter.values())
          index['in_value']=in_value
          index['out_value']=out_value
          index['fee']=in_value - out_value
          
      i = 0
      for index in data['txs']:
        for inputs in index['inputs']:
          if inputs['addr'] not in addrData.keys():
              addrData[inputs['addr']]={'balance':0, "received":0,"sent":0,"tx_n":0,"input_n":0,"output_n":0,"tx_index":[]}
          addrData[inputs['addr']]['sent']+=inputs['value']
          addrData[inputs['addr']]['input_n']+=1
          addrData[inputs['addr']]['tx_n']+=1
          addrData[inputs['addr']]['tx_index'].append(i)
                  
        for outputs in index['outputs']:
          if outputs['addr'] not in addrData.keys():
              addrData[outputs['addr']]={'balance':0, "received":0,"sent":0,"tx_n":0,"input_n":0,"output_n":0,"tx_index":[]}
          addrData[outputs['addr']]['received']+=outputs['value']
          addrData[outputs['addr']]['output_n']+=1
          addrData[outputs['addr']]['tx_n']+=1
          addrData[outputs['addr']]['tx_index'].append(i)
        i+=1

      txData=[]
      for index in addrData:
        addrData[index]['balance'] = addrData[index]['received']-addrData[index]['sent']
        addrData[index]['addr'] = index
        txData.append(addrData[index])
        # if index['fee']<0:
        #   print(index['fee'])
        #   print(index)
        # print("***********")
      #print(data)

      # print(len(addrAll))
      # print(len(addr))
      
      print(data['n_tx'])
      self.write({'txData': data, 'addrData': txData})
      # with open('data.json', 'w') as f:
      #   json.dump({'txData': data, 'addrData': txData}, f)

    def get(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      print('...............checkClassNameHandler')
      
      self.write({'suc':'success'})




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
    print(client_file_root_path)
    app = tornado.web.Application(
        handlers=[
                  (r'/ws', wsHandler),
                  (r'/searchAddress', addressHandler),
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
