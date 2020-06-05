# Scraper

This is a web scraper for whatever I might need. Currently on google's cloud functions.

### TODO
Setup pipeline to autodeploy on push to master

#### Carga de trabalhos

Scrapes http://www.cargadetrabalhos.net/category/web-design-programacao?s=+freelance daily to check for new job postings as this site doesn't have job alert system. 
Stores the URL of the last post checked in a DB to see when a new post has appeared
Runs at midnight and if there's any new post will send me an email with the information.
