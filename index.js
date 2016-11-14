'use strict'

const express = require('express')
const app = express()
const getCss = require('get-css')
const URL = require('url-parse')
const fontParse = require('css-font-parser')

/////// API Routes ///////
app.get('/:url', (req, res) => {
  const parsedUrl = new URL(req.params.url)
  if (!parsedUrl.protocol) {
    parsedUrl.protocol = 'http'
    parsedUrl.slashes = true
  }

  GetFontFamiliesForURL(parsedUrl.toString())
    .then((families) => {
      res.json(Object.keys(families)).end();
    })
    .catch(() => {
      req.status(404).end();
    })
})

app.get('/family-totals/:url', (req, res) => {
  const parsedUrl = new URL(req.params.url)
  if (!parsedUrl.protocol) {
    parsedUrl.protocol = 'http'
    parsedUrl.slashes = true
  }

  GetFontFamiliesForURL(parsedUrl.toString())
    .then((families) => {
      res.json(families).end();
    })
    .catch(() => {
      req.status(404).end();
    })
})
/////// End API Routes ///////

// Gets all the font families used on the give url page
// Returns a promise containing an object:
// keys: font-family name
// values: number of times the font family is used on the page
function GetFontFamiliesForURL(url) {
  return getCss(url, {
      timeout: 5000
    })
    .then((response) => {
      console.log(response);
      const fontFamilies = MergeReduceObjects(
        (cur, total) => {
          if (total) {
            return total + cur;
          }
          return cur;
        },
        ParseFonts(response.css),
        ParseFontFamily(response.css),
        ParseFonts(response.styles),
        ParseFontFamily(response.styles)
      )

      return fontFamilies;
    })
    .catch((error) => {
      console.error(error)
    })
}

// Take a list of objects and applies the reduce function to each key's value in each objects
// Returns a newly merged object
function MergeReduceObjects(reducer, ...args) {
  const newObj = {}
  args.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      newObj[key] = reducer(obj[key], newObj[key])
    })
  })
  return newObj;
}

const regexF = /font:.*?(.*?)[;}]/gi
// Parses out font families found in the "font:" css attribute of a
// properly formatted css string
function ParseFonts (css) {
  const families = {}

  let match = regexF.exec(css)
  while (match != null) {
    const paresedFonts = fontParse(match[1])
    if (paresedFonts && paresedFonts.hasOwnProperty('font-family')) {
      paresedFonts['font-family'].forEach((fontFamily) => {
        const familyName = fontFamily.toLowerCase().replace(/"|'/g, '');
        families[familyName] = families[familyName] + 1 || 1;
      })
    }

    // Get the next capture group
    match = regexF.exec(css)
  }

  return families
}

const regexFF = /font-family:(.*?)[;}]/gi
// Parses out font families found in the "font-family:" css attribute of a
// properly formatted css string
function ParseFontFamily (css) {
  const families = {}

  let match = regexFF.exec(css)
  while (match != null) {
    const parsedFamilies = match[1].split(',')
    if (parsedFamilies.length) {
      parsedFamilies.forEach((famName) => {
        const familyName = famName.trim().toLowerCase().replace(/"|'/g, '');
        families[familyName] = families[familyName] + 1 || 1;
      })
    }

    // Get the next capture group
    match = regexFF.exec(css)
  }

  return families
}

app.listen(3000, () => {
  console.log('Font-Family parser api listening on port 3000!')
})
