# Swarm Checkin Exporter

### Description
This is a simple script to export Swarm checkins to a CSV. The CSVs are split into groups of 2000 so that they can then be uploaded to [Google My Maps](https://www.google.com/maps/d/u/0/) (see My Maps upload instructions [here](https://support.google.com/mymaps/answer/3024836)).

### Setup
The Swarm API NPM package didn't work for this tool because it could only fetch checkins since a certain timestamp, not by offset. Given the API's impicit 100 checkin limit, it would have been hard to fetch all records. Also, Swarm doesn't have an API dashboard to create client ID/Secret.

To authenticate, login to your Swarm account on the web, open the network tab of the web inspector, refresh the activity page, look at the first request, and find the token in the request cookies. Copy it to the `.env.example` file and rename it `.env`.

### Running the script
* `npm install`
* `npm run main`

### Output
The script outputs files called `export_${i}.csv`.