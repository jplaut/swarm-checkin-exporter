const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');
require('dotenv').config()

type Checkin = {
  venue: {
    name: string;
    location: {
      lat: number;
      lng: number;
      formattedAddress: string[];
    }
  }
}

type CheckinRow = {
  name: string;
  address: string;
  latlng: string;
}

type CheckinResponse = {
  checkins: {
    count: number;
    items: Checkin[];
  }
}

const VERSION: string = new Date().toISOString().slice(0,10).replace(/-/g,"");

const createCSVWriter = (i: number) => (
  createCsvWriter({
    path: `export_${i}.csv`,
    header: [
      {id: 'name', title: 'NAME'},
      {id: 'address', title: 'ADDRESS'},
      {id: 'latlng', title: 'LAT/LNG'}
    ]
  })
);

const createRows = (checkins: Checkin[]): CheckinRow[] => (
  checkins.map(checkin => ({
    name: checkin.venue.name,
    // need to replace cross streets (eg 253 W 51st St (btwn Broadway & 8th Ave))
    address: checkin.venue.location.formattedAddress.join(', ').replace(/ \([^)]*\)/g, ''),
    latlng: `${checkin.venue.location.lat},${checkin.venue.location.lng}`
  }))
)

async function main() {
  let totalCount = 1, csvIndex = 1, csvWriter = createCSVWriter(csvIndex), checkinRequest;

  const params = {
    v: VERSION,
    offset: 0,
    oauth_token: process.env.OAUTH_TOKEN
  }

  while (params.offset < totalCount) {
    checkinRequest = await axios.get(`https://api.foursquare.com/v2/users/${process.env.USER_ID}/historysearch`, { params });
    let response: CheckinResponse = checkinRequest.data.response;
    totalCount = response.checkins.count;
    console.log(`Exporting ${params.offset} - ${params.offset + response.checkins.items.length} of ${totalCount}`);
    params.offset += response.checkins.items.length;

    // limit each CSV to 2000 so upload to My Maps works
    if (params.offset > csvIndex * 2000) {
      csvIndex += 1;
      csvWriter = createCSVWriter(csvIndex);
    }

    await csvWriter.writeRecords(createRows(checkinRequest.data.response.checkins.items));
  }
  
  console.log(`Completed exporting ${params.offset} checkins.`);
}

main();