# RetrieveText
RetrieveText is a Chromium extension for retrieving the text that's been highlighted, sending it to an API to be translated, and then displaying the translated text on the screen in a popup element above the text that was highlighted.

## How to use it
Simply highlight text on a page and it will be translated.

Note that you need to replace the variable for constructedAPIURL in apiUtil.ts with your own translation API URL.

Works in Chromium-based browsers such as Google Chrome and Microsoft Edge.

Languages can be configured by clicking the extension icon and selecting the source and target language.

## Requirements:
Node, TypeScript, Webpack, Tailwind

# Installation
Clone the repository and then replace the variable for constructedAPIURL in apiUtil.ts with your own translation API URL.

Then run:
`npm install`

This will install the node modules needed.

To build:
`npm run build`

This will transpile the TypeScript files to JavaScript so the extension can use them.