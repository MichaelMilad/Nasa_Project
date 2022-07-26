const express = require('express');
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.route('/').get(httpGetAllLaunches).post(httpAddNewLaunch);

launchesRouter.route('/:id').delete(httpAbortLaunch);

module.exports = launchesRouter;
