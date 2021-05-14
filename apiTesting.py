import requests
import concurrent.futures
import json
import sys

url = 'https://api.hypixel.net/skyblock/auctions'
item1 = 'Kismet Feather'
item2 = 'God Potion'
item3 = 'Kat Flower'

aucts1 = []
aucts2 = []
aucts3 = []

req = requests.get(url)
nPages = json.loads(req.text)['totalPages']


def getPage(p):
    req = requests.get(url, params={'page': p})
    data = json.loads(req.text)
    return data['auctions']


with concurrent.futures.ThreadPoolExecutor() as executor:
    results = executor.map(getPage, range(nPages))

aucts1 = [item1 for sublist in results for item1 in sublist]
aucts2 = [item2 for sublist in results for item2 in sublist]
aucts3 = [item3 for sublist in results for item3 in sublist]


def sBid(e):
    return e['starting_bid']


good1 = [x for x in aucts1 if x['item_name'] == item1]
good2 = [x for x in aucts2 if x['item_name'] == item2]
good3 = [x for x in aucts3 if x['item_name'] == item3]

out1 = [a for a in good1 if 'bin' in a and a['bin']]
out2 = [a for a in good2 if 'bin' in a and a['bin']]
out3 = [a for a in good3 if 'bin' in a and a['bin']]

out1.sort(key=sBid)
out2.sort(key=sBid)
out3.sort(key=sBid)

print([a['starting_bid'] for a in out1[:3]], end='')
print([a['starting_bid'] for a in out2[:3]], end='')
print([a['starting_bid'] for a in out3[:3]], end='')
sys.stdout.flush()
