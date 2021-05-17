import requests
import concurrent.futures
import json
import sys

url = 'https://api.hypixel.net/skyblock/auctions'
items = ['Kismet Feather',
         'God Potion',
         'Kat Flower']
aucts = []

req = requests.get(url)
nPages = json.loads(req.text)['totalPages']


def getPage(p):
    req = requests.get(url, params={'page': p})
    data = json.loads(req.text)
    return data['auctions']


with concurrent.futures.ThreadPoolExecutor() as executor:
    results = executor.map(getPage, range(nPages))

aucts = [items for sublist in results for items in sublist]


def sBid(e):
    return e['starting_bid']


binned = [a for a in aucts if 'bin' in a and a['bin']]

#startingBits = int(input("How many bits do you have?: "))

for item in items:
    out = [a for a in binned if a['item_name'] == item]
    out.sort(key=sBid)
    prices = [a['starting_bid'] for a in out[:3]]
    print(round(sum(prices) / len(prices)))
sys.stdout.flush()
