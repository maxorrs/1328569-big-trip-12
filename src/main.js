'use strict';

import TripInfoView from './view/trip-info.js';
import TripTabsView from './view/trip-tabs.js';
import TripFiltersView from './view/trip-filters.js';
import TripSortView from './view/trip-sort.js';
import EventView from './view/event.js';
import DaysView from './view/days.js';
import OneDayView from './view/one-day.js';
import NoWaypointsView from './view/no-waypoints.js';
import WaypointView from './view/waypoint.js';
import {generateWaypoint} from './mock/waypoint.js';
import {COUNT_WAYPOINTS} from './consts.js';
import {RenderPosition, render, replace} from './utils/render.js';
import Trip from './presenter/trip.js';

const MAX_COUNT_CITY_INFO = 3;
const THREE_HOURS_IN_MS = 10800000;

const waypoints = new Array(COUNT_WAYPOINTS)
  .fill()
  .map(generateWaypoint)
  .sort((a, b) => {
    const firstDate = new Date (a.time.startTime).getTime();
    const secondDate = new Date (b.time.startTime).getTime();
  
    if (firstDate > secondDate) {
      return 1;
    } else if (firstDate < secondDate) {
      return -1;
    } 

    return 0;
  });

const uniqueDates = waypoints
  .slice()
  .map((waypoint) => {
    return waypoint.time.startTime.substr(0,10); 
  });

const uniqueDatesSet = new Set (uniqueDates);

const cities = waypoints
  .slice()
  .map((waypoint) => {
    return {
      city: waypoint.city,
      startTime: waypoint.time.startTime
    }
  })
  .sort((a, b) => {
    const firstDate = new Date(a.startTime).getTime();
    const secondDate = new Date(b.startTime).getTime();
    
    if (firstDate > secondDate) {
      return 1;
    } else if (firstDate < secondDate) {
      return -1;
    } 

    return 0;
  });

const citiesDatalist = cities
  .slice()
  .map((it) => {
    return it.city;
  })
  .sort();

const uniqueCitiesDatalist = new Set(citiesDatalist);

let citiesForInfo = [];

if (cities.length > MAX_COUNT_CITY_INFO) {
  citiesForInfo.push(cities[0].city);
  citiesForInfo.push('...');
  citiesForInfo.push(cities[cities.length - 1].city);
} else {
  citiesForInfo = cities
  .slice()
  .map((it) => {
    return it.city;
  });
}

let finalAmount = 0;

const getFinalAmount = (waypoint) => {
  const amount = Object
    .values(waypoint.offers)
    .filter((it) => {
      return it.isEnabled;
    })
    .map((it) => {
      return it.price;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);

    finalAmount += amount;
};

for (const waypoint of waypoints) {
  getFinalAmount(waypoint)
}

const sitePageBody = document.querySelector('.page-body');

const tripPresenter = new Trip (sitePageBody, uniqueDatesSet, citiesForInfo, finalAmount, uniqueCitiesDatalist);
tripPresenter.init(waypoints);
