const puppeteer = require('puppeteer');
const $ = require('cheerio');
const fs = require('fs');

require('dotenv').config();
let cnf = require('../config/config.json');

let followerCount = null;

/**
 * Launches a seperate Puppeteer instance to scrape the target account for the current
 * number of followers
 */
async function getFollowerCount() {
  const url = `https://www.instagram.com/${process.env.URL_TO_SCRAPE}/`;
  console.log('Accessing site for follower count');
  puppeteer
    .launch()
    .then(function(browser) {
      return browser.newPage();
    })
    .then(function(page) {
      return page.goto(url).then(function() {
        return page.content();
      });
    })
    .then(function(html) {
      let arr = [];
      console.log('Scraping for follower count');
      $('span.g47SY ', html).each(function() {
        arr.push($(this).text());
      });
      followerCount = parseInt(arr[1].replace(',', ''));
      console.log(`Number of followers: ${followerCount}`);
    })
    .catch(function(err) {
      console.log(err);
    });
}

/**
 * Pulls out the followers
 */
const extractFollowers = () => {
  let followers = [];
  let elements = document.getElementsByClassName('FPmhX notranslate _0imsa ');
  for (let element of elements) followers.push(element.textContent);
  return followers;
};

/**
 * Scrolls to the bottom of the modal holding the followers
 */
async function scrapeInfiniteScrollItems(
  page,
  extractFollowers,
  followersTargetCount,
  browser
) {
  let items = [];
  // Next line returns undefined
  let x;
  try {
    while (items.length < followersTargetCount) {
      items = await page.evaluate(extractFollowers);
      childToSelect = items.length;
      console.log(`scrolling though follower number: ${childToSelect}`);
      await page.hover(`div.isgrP > ul > div > li:nth-child(${childToSelect})`);
    }
    items.length = followersTargetCount;
    fs.writeFileSync(`./data/followers.json`, JSON.stringify(items));
    console.log(
      `${items.length} followers usernames writen to JSON file in data folder`
    );
    browser.close();
    process.exit(0);
    console.time('Account Scaper');
  } catch (e) {
    console.log(e);
  }
}

let getFollowers = async function() {
  console.time('Account Scaper');

  /**
   * Calls the function to get follower count
   */
  getFollowerCount();

  console.log('Launching Follower List generator');
  // set up Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 764 });
  await page.waitFor(2000);

  // Load Instagram
  await page.goto('https://www.instagram.com');
  await page.waitFor(2500);
  await page.click(cnf.selectors.switch_button);
  await page.waitFor(2500);
  console.log('Instagram loaded');
  // Login
  await page.click(cnf.selectors.username_field);
  await page.keyboard.type(process.env.USERNAME, { delay: 100 });
  await page.click(cnf.selectors.password_field);
  await page.keyboard.type(process.env.PASSWORD, { delay: 100 });
  await page.click(cnf.selectors.login_button);
  await page.waitForNavigation();
  console.log('Logging in');
  console.log('Logged in');
  await page.waitFor(2500);

  console.log('Going to requested account');
  // Go to requested page
  await page.goto(`https://www.instagram.com/${process.env.URL_TO_SCRAPE}/`);
  // Click followers button
  console.log('Clicking on followers button');
  await page.waitFor(3000);
  await page.click(cnf.selectors.followers_button);
  await page.waitFor(3000);
  await page
    .hover('div.pbNvD.fPMEg.HYpXt')
    .then(() => {
      console.log('Got to step 1');
      console.log('Scrolling though followers');
      scrapeInfiniteScrollItems(
        page,
        extractFollowers,
        followerCount,
        browser
      );
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = getFollowers;
