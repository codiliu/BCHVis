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
# import frq_path_stat

from api_process import get_all




define("port", default=22068, type=int, help = "run on the given port")

os.path.join(os.path.split(__file__)[0],'./cython/arrContain/build/lib/')
# the path to server html, js, css files
client_file_root_path = os.path.join(os.path.split(__file__)[0],'../client')
client_file_root_path = os.path.abspath(client_file_root_path)


def get_page(url):
    user_agent_str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
    time.sleep(random.uniform(0,1))
    return json.loads(requests.get(url, headers={"Connection":"keep-alive", "User-Agent": user_agent_str}).text)


def filterData(address):
    url = "http://123.207.75.151:9999/bch/api/viabtc/txs/get_all/1MEPB525tEHRFLdq6aR8d2t8jaaRQj2iWX"
    dataArr = get_page(url)
    # for i in range(1, 10000):
    #     url = "https://blockchain.info/rawaddr/" + address +'?offset='
    #     url += str(i*50)
    #     data = get_page(url)
    #     try:
    #         if len(data['txs']) == 0:
    #             break
    #         dataArr['txs'].extend(data['txs'])
    #     except: 
    #         break
    return dataArr


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

      

      #print(get_all("1Ctj8MbJ8NodXBREu9bztGWyy7HMVY5s9T"))

      data = get_all(address)

      #data = filterData(address)
      #print(data)

      print(len(data['msg']))

      # address='1MEPB525tEHRFLdq6aR8d2t8jaaRQj2iWX'
      addrData={}
      txData={}
      txData['addr']=address
      txData['n_tx']=len(data['msg'])
      
      txData['received']=0
      txData['sent']=0
      txData['balance']=0
      txData['txs']=[]
      received=0
      sent=0
      balance=0
      for index in data['msg']:
          record={}
          record['inputs']=[]
          record['outputs']=[]

          # print('***')
          # print(index['time'])
          record['time']=float(index['time'])


          record['confirmations']=index['confirmations']
          record['income']=float(index['income'])
          record['txid']=index['txid']
          record['hash']=index['txid']
          balance+=float(index['income'])
          record['in_value']=0
          record['out_value']=0
          for put in index['inputs']:
              temp={}
              temp['txid']=put['prev_txid']
              temp['value']=float(put['prev_value'])
              record['in_value']+=temp['value']
          
              temp['addr']=put['prev_addresses'][0]
              if temp['addr'] == address:
                  sent+=temp['value']
                  
              if temp['addr'] not in addrData:
                  addrData[temp['addr']]={'addr': temp['addr'], 'sent': temp['value'], 'received': 0, 'balance': -temp['value'], 'input_n': 1, 'output_n': 0, 'tx_n': 1, 'txid': [record['txid']]}
              else:
                  addrData[temp['addr']]['sent']+=temp['value']
                  addrData[temp['addr']]['balance']-=temp['value']
                  addrData[temp['addr']]['input_n']+=1
                  addrData[temp['addr']]['tx_n']+=1
                  addrData[temp['addr']]['txid'].append(record['txid'])
              record['inputs'].append(temp)
       
          for put in index['outputs']:
              temp={}
              temp['txid']=put['next_txid']
              temp['value']=float(put['value'])
              record['out_value']+=temp['value']

              temp['addr']=put['addresses'][0]
              if temp['addr'] == address:
                  received+=temp['value']
                  
              if temp['addr'] not in addrData:
                  addrData[temp['addr']]={'addr': temp['addr'], 'sent': 0, 'received': temp['value'], 'balance': temp['value'], 'input_n': 0, 'output_n': 1, 'tx_n': 1, 'txid': [record['txid']]}
              else:
                  addrData[temp['addr']]['received']+=temp['value']
                  addrData[temp['addr']]['balance']+=temp['value']
                  addrData[temp['addr']]['output_n']+=1
                  addrData[temp['addr']]['tx_n']+=1
                  addrData[temp['addr']]['txid'].append(record['txid'])
                  
              record['outputs'].append(temp)
          
          record['fee'] = record['in_value'] - record['out_value']

          txData['txs'].append(record)
 
      txData['received']=received
      txData['sent']=sent
      txData['balance']=received-sent

      temp=[]
      for index in addrData:
          temp.append(addrData[index])


      addrData=temp
      #print(addrData['1MEPB525tEHRFLdq6aR8d2t8jaaRQj2iWX'])

      self.write({'txData': txData, 'addrData': addrData})
      # with open('data.json', 'w') as f:
      #   json.dump({'txData': data, 'addrData': txData}, f)

    # def get(self):
    #   self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
    #   self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
    #   self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
    #   print('...............checkClassNameHandler')
      
    #   self.write({'suc':'success'})


class txidHandler(tornado.web.RequestHandler):
    def post(self):
      self.set_header('Access-Control-Allow-Origin','*')  # 添加响应头，允许指定域名的跨域请求
      self.set_header("Access-Control-Allow-Headers", "X-Requested-With");  
      self.set_header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS"); 
      constraint=self.get_argument('constraint')
      constraint = json.loads(constraint)
      #print(constraint)
      txid=constraint['txid']

      txidData = get_page('http://35.201.193.149:9999/bch/api/viabtc/get_txs_by_layer/'+txid+'/3')['result']['msg']
      self.write({'txidData': txidData})
      print("Search " + str(txid))

if __name__ == "__main__":
    tornado.options.parse_command_line()
    print('server running at 127.0.0.1:%d ...'%(tornado.options.options.port))
    print(client_file_root_path)
    app = tornado.web.Application(
        handlers=[
                  (r'/ws', wsHandler),
                  (r'/searchAddress', addressHandler),
                  (r'/searchTxId', txidHandler),
                  # (r'/queryCarList', queryCarListHandler),
                  (r'/(.*)', tornado.web.StaticFileHandler, {'path': client_file_root_path,
                                               'default_filename': 'index.html'}) # fetch client files
                  ],
        debug=True,
    )

    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
