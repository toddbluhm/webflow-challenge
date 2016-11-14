# webflow-challenge
Crawls a url and gets all the font families used on the page

## Usage

Run the server by using the command `npm start`

After the server is running us an HTTP client to query the server at the default address `localhost:3000`

All responses are json objects/arrays

Example using curl
```
curl localhost:3000/github.com
["consolas","liberation mono","menlo","courier","monospace","-apple-system","blinkmacsystemfont","segoe ui","helvetica","arial","sans-serif","apple color emoji","segoe ui emoji","segoe ui symbol","roboto","helvetica neue","oxygen","ubuntu","cantarell","open sans","inherit","monaco","courier new","arial black","arial bold","gadget","brush script mt","cursive"]
```

## APIs

**Please URL-encode all urls passed to the API.** Here is a handy [web url-encoder](http://meyerweb.com/eric/tools/dencoder/).

- **/:url** - Returns a list of font families found on that url page. This only includes font-families found on that specific page.
  ```
  ["consolas","liberation mono","menlo","courier"]
  ```

- **/family-total/:url** - Returns an object where the keys are the font family name and the value is the number of times that font-family is used in css on the page.
  ```
  {
    "consolas": 35,
    "liberation mono": 35,
    "menlo": 35,
    "courier": 36,
  }
  ```

## Contributing

All pull requests are welcome!

Please lint/format your code before opening a PR using `npm run lint`
