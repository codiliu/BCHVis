# -*- coding:utf8 -*-
import logging
import hashlib
import json
from lxml import html
from net import fetch_html

def get_all( addr):
        try:
            tx_id_set = set()
            base_api = "https://www.viabtc.com/res/bch/transactions/address?address=%s&page=%d&limit=%d"
            api = base_api % (addr, 1, 50)
            msg = []
            code, body = fetch_html(api)
            if code != 200:
                return {"status": -1, "msg": "code %s, fetch_html error" % str(code)}
            json_data = json.loads(body).get("data", dict())
            total_page = json_data.get("total_page", "")
            if not total_page:
                return {"status": -1, "msg": "total page is null"}
            for i in range(1, int(total_page) + 1):
                api = base_api % (addr, i, 50)
                code, body = fetch_html(api)
                if code != 200:
                    return {"status": -1, "msg": "code %s, fetch_html error" % str(code)}
                datas = json.loads(body).get("data", dict()).get("data", [])
                for data in datas:
                    txid = data.get("txid", "")
                    if not txid:
                        continue
                    if txid in tx_id_set:
                        continue
                    tx_id_set.add(txid)
                    msg.append(data)
            return {"status": 1, "msg": msg, "total": len(msg)}
        except Exception as e:
            logging.info("get_all error, reason: %s" % str(e))
            return {"status": -1, "msg": "get_all error, reason: %s" % str(e)}


