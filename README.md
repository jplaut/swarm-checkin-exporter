# Swarm Checkin Exporter

### Description
This is a simple script to export Swarm checkins to a CSV. The CSVs are split into groups of 2000 so that they can then be uploaded to [Google My Maps](https://www.google.com/maps/d/u/0/) (see My Maps upload instructions [here](https://support.google.com/mymaps/answer/3024836)).

### Setup
The Swarm API NPM package didn't work for this tool because it could only fetch checkins since a certain timestamp, not by offset. Given the API's impicit 100 checkin limit, it would have been hard to fetch all records. Also, Swarm doesn't have an API dashboard to create client ID/Secret.

I ended up reverse engineering the Swarm website and found a request on the page that included the `OAUTH_TOKEN` and `USER_ID`. To find yours, login to your Swarm account on the web, open the web inspector, scroll down the checkin list until the page loads more checkins, and find the request. The token and userId are there (eg `https://api.foursquare.com/v2/users/${USER_ID}/historysearch?...oauth_token=${OAUTH_TOKEN}`).

Add those to the `.env.example` file and rename it `.env`.

### Running the script
* `npm install`
* `npm run main`

### Output
The script outputs files called `export_${i}.csv`.