const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let latestFlightNumber = 100;

saveLaunch({
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'ZTM', 'MICHAEL'],
  upcoming: true,
  success: true,
});

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchData() {
  console.log('Downloading Launch Data');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payload',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
}

async function existsLaunchWithId(launchId) {
  return await launches.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne({}).sort('-flightNumber');

  if (!latestLaunch) return 100;

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) throw new Error('No Matching Planet Was Found');

  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'Michael', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(launch);
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
