# Instagram Follower Collector

[![Please](https://img.shields.io/badge/please-buy%20me%20a%20coffee-green)](https://www.buymeacoffee.com/OwATNhIPH)

## TL:DR

Instagram Follower Collector is a nodejs automation script, using puppeteer, that can compile a list of account followers.

### Installation Guide

1. Clone the repo.
2. Run ```npm i``` to install the required packages.
3. In the root of the project create a ```.env``` file.
4. In the ```.env``` you need to include the following:

``` javascript
USERNAME=<An Instagram username>
PASSWORD=<The account password>
URL_TO_SCRAPE=<The suffix of the profile that you want to scrape>
```

5. Run the script by entering ```npm run start```

### Benchmark times

- Coming soon...
- 10 followers
- 100 followers
- 1000 followers
- 5000 followers
- 10,000 followers
- 25,000 followers
- 25k plus followers...

### Todo List

- [ ] If the script bugs out, kill and restart
- [ ] Rewrite scraper in typescript(?)
- [ ] Publish as npm package?
- [ ] Add unit tests
- [ ] Add script execution timer
- [ ] Add better logging

### Credits

Built with the Puppeteer docs and a lot of Stackoverflow.
