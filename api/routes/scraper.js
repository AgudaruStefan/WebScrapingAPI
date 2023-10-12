const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

Array.prototype.slice_ = function(start,end,step=1) {
    return this.slice(start,end)
        .reduce((acc, e, i) => i % step == 0 
        ? [...acc, e] 
        : acc, []); 
}

function countConsonants(word) {
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz';
  
    let consonantCount = 0;
  

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (consonants.includes(char)) {
        consonantCount++;
      }
    }
  
    return consonantCount;
  }

function countVowels(word) {
    const vowels = 'AEIOUaeiou';

    let vowelCount = 0;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (vowels.includes(char)) {
        vowelCount++;
      }
    }
  
    return vowelCount;
  }

const avg = arr => {
const sum = arr.reduce((acc, cur) => acc + cur);
const average = sum/arr.length;
return average;
}

async function scrape(URL) {
  try {
    
    const browser = await puppeteer.launch('headless: "new"');
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });


    await page.waitForSelector('html');

    const html = await page.content();


    const TitleMatches = html.match(/<a[^>]*><span[^>]*>(.*?)<\/span>(.*?)<\/a>/gs);
    const title = TitleMatches ? TitleMatches.map(match => match.replace(/<\/?span[^>]*>|<\/?a[^>]*>/g, ''))
    : [];

    const descriptions = await page.$$eval('div div div div div', div => div.map(div => div.textContent));
    const descriptionslice = descriptions.slice_(9,-1,14);

    const imageMatches = html.match(/<img.*?src=["'](.*?)["']/g);
    const images = imageMatches ? imageMatches.map(match => match.match(/src=["'](.*?)["']/)[1])
    .filter(src => src.includes('w=3840&amp')): null;

    const HrefMatches = html.match(/<a[^>]*href="([^"]*)"><span[^>]*>(.*?)<\/span>/gs);
    const hrefs = HrefMatches ? HrefMatches.map(match => match.match(/<a[^>]*href="([^"]*)"/)[1]): null;
    
    
    const wordCounts = [];
    const vowelss = [];
    const cons = [];
    const conminvowelss = []
    const sentiment = []

    for (const href of hrefs) {
        const hrefPage = await browser.newPage();
        await hrefPage.goto(URL + href, { waitUntil: 'domcontentloaded' });
        await hrefPage.waitForSelector('html');

        const hrefHtml = await hrefPage.content();
        const textWithoutHtml = hrefHtml.replace(/<[^>]+>/g, '');
        const words = textWithoutHtml.split(/\s+/);
        const validWords = words.filter(word => word.trim() !== '');
        const vowelCount = countVowels(validWords.join(''));
        const consonantCount = countConsonants(validWords.join(''));
        cons.push(consonantCount)
        vowelss.push(vowelCount)
        if (consonantCount > vowelCount){
            conminvowelss.push(consonantCount - vowelCount)
        }
        wordCounts.push(validWords.length);
    };

    const sentimentAvg = avg(conminvowelss)
    for (let i = 0; i < conminvowelss.length; i++) {
        if (conminvowelss[i] < sentimentAvg){
            sentiment.push("negative")
        } else if (conminvowelss[i] > sentimentAvg){
            sentiment.push("positive")
        } else if ( conminvowelss === sentimentAvg) {
            sentiment.push("neutral")
        }
    };


    const blogInfo = {
        Posts: [],
      };
  
      for (let i = 0; i < title.length; i++) {
        blogInfo.Posts.push({
          title: title[i],
          short_description: descriptionslice[i],
          image: URL + images[i],
          href: URL + hrefs[i],
          sentiment: sentiment[i],
          Words: wordCounts[i],
        });
      }

    await browser.close();
    return(blogInfo);
  } catch (error) {
    console.error(error);
  }
}

router.get('/:url', async (req, res, next) => {
  const url = req.params.url;
  if (url[0,7] === "https://"){
    url = url[8,-1,1]
  }
  res.status(200).json({
      WebScrapingAPI: await scrape(`https://${url}`)
  });
});

module.exports = router;