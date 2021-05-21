import requests
import concurrent.futures
import json
import sys

try:
    startingBits = int(sys.argv[1])
except:
    startingBits = 1


url = 'https://api.hypixel.net/skyblock/auctions'
items = {'Kismet Feather': 1350,
         'God Potion': 1500,
         'Kat Flower': 500}
itemList = ['Kismet Feather', 'God Potion', 'Kat Flower']

aucts = []

req = requests.get(url)
nPages = json.loads(req.text)['totalPages']


def getPage(p):
    req = requests.get(url, params={'page': p})
    data = json.loads(req.text)
    return data['auctions']


with concurrent.futures.ThreadPoolExecutor() as executor:
    results = executor.map(getPage, range(nPages))

aucts = [itms for sublist in results for itms in sublist]


def sBid(e):
    return e['starting_bid']


binned = [a for a in aucts if 'bin' in a and a['bin']]
finals = []
for item in items:
    out = [a for a in binned if a['item_name'] == item]
    out.sort(key=sBid)
    finals.append([a for a in out[:3]])


finishedNums = []
for outs in finals:
    prices = [a['starting_bid'] for a in outs[:3]]
    avr = round(sum(prices) / len(prices))
    coinPerBit = round(avr/items[outs[0]['item_name']])
    finishedNums.append(coinPerBit)

finishedNums, itemList = (list(t)
                          for t in zip(*sorted(zip(finishedNums, itemList), reverse=True)))
chosenItem = itemList[0]
greatest = finishedNums[0]
chosenItemAvr = greatest*items[chosenItem]
amountAvailable = int(startingBits/items[chosenItem])
totalSalePrice = int(chosenItemAvr*amountAvailable)
print(f'The items you should buy are {amountAvailable} {chosenItem}s for a total sale price of',
      totalSalePrice, '.')

sys.stdout.flush()
