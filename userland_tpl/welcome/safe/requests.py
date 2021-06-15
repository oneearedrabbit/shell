# this scrpit won't be able to access network

import requests

url = 'https://www.facebook.com/favicon.ico'
r = requests.get(url, allow_redirects=True)

print(r)
