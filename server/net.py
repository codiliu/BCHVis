# -*- coding:utf8 -*-
import logging
import requests
import random
import util


def fetch_html(url, headers={}, proxy=None, https_proxy=None, data=None):
    try:
        """
        if not proxy:
            proxy = random.choice(["10.3.14.61:3128", "10.3.14.62:3128"])
        if not https_proxy:
            https_proxy = random.choice(["10.3.14.61:3128", "10.3.14.62:3128"])
        """
        proxies = {"http": proxy, 'https': https_proxy}
        if not headers:
            headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"}
        if not data:
            r = requests.get(url, headers=headers, timeout=100, proxies=proxies, verify=False)
        else:
            r = requests.post(url, headers=headers, timeout=100, proxies=proxies, verify=False, data=data)
        if r.status_code != 200:
            return r.status_code, ''
        body = r.content
        if not body:
            return r.status_code, ''
        body, best_encoding, bad_num = util.smart_decode(body, with_detail=True)
    except Exception as e:
        logging.exception(e)
        return 0, ''
    return r.status_code, body