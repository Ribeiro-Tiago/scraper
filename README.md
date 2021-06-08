# Scraper

This is a web scraper for whatever I might need. Currently on google's cloud functions. Stores the date of the last post checked on DB to see when a new post has appeared
Runs at midnight and if there's any new post will send an email with the information.

### Deplyoment

- Only certain function -> `firebase deploy --only "functions:<function name>" --token "$FIREBASE_TOKEN"`
- All functions -> `firebase deploy --only functions --token "$FIREBASE_TOKEN"`

##### After deployment

Because firebase likes to get money sneakily, when new versions of an existing function are pushed there's stuff created in storage. After pushing new function, go to https://console.cloud.google.com/storage/browser to make sure there's no unnecesary leftovers occupying space
