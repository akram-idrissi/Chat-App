import requests


links = [
    f'https://bootdey.com/img/Content/avatar/avatar{i + 1}.png' for i in range(8)]

for i in range(len(links)):
    try:
        with open(f'public/assets/avatar{i + 1}.png', 'wb') as f:
            f.write(requests.get(links[i]).content)
    except Exception as e:
        print(e)
