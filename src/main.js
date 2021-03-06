import {RenderPosition, render, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './consts.js';
import InfoPresenter from './presenter/info.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoints.js';
import ExtraModel from './model/extra.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const ApiConfig = {
  AUTHORIZATION: `Basics 9889asfhsalkjlfLJ`,
  END_POINT: `https://12.ecmascript.pages.academy/big-trip`
};

const sitePageBody = document.querySelector(`.page-body`);
const sitePageBodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);

const api = new Api(ApiConfig.END_POINT, ApiConfig.AUTHORIZATION);
const store = new Store(window.localStorage);
const apiWithProvider = new Provider(api, store);

const waypointsModel = new WaypointsModel();
const extraModel = new ExtraModel();

const filterModel = new FilterModel();

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.enableFilters();
      infoPresenter.destroyFormNewWaypoint();
      tripPresenter.destroy();
      tripPresenter.init();
      infoPresenter.setMenuItemTable();

      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }
      break;
    case MenuItem.STATS:
      const waypointCounts = waypointsModel.getWaypoints().length;
      if (waypointCounts > 0) {
        filterPresenter.disableFilters();
        filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        infoPresenter.destroyFormNewWaypoint();
        infoPresenter.setMenuItemStats();
        tripPresenter.destroy();

        if (statisticsComponent === null) {
          statisticsComponent = new StatisticsView(waypointsModel.getWaypoints());
          render(sitePageBodyContainer, RenderPosition.BEFOREEND, statisticsComponent);
        }
      }

      break;
    case MenuItem.ADD_WAYPOINT:
      filterPresenter.enableFilters();
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      infoPresenter.createFormNewWaypoint();
      infoPresenter.setMenuItemTable();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }

      break;
  }
};

const filterPresenter = new FilterPresenter(sitePageBody, filterModel, waypointsModel);
const tripPresenter = new TripPresenter(sitePageBody, waypointsModel, filterModel, apiWithProvider, extraModel);
const infoPresenter = new InfoPresenter(sitePageBody, waypointsModel, tripPresenter, handleSiteMenuClick);

infoPresenter.init();
filterPresenter.init();
tripPresenter.init();

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getWaypoints()
])
  .then((response) => {
    extraModel.setOffers(response[0]);
    extraModel.setDestinations(response[1]);
    waypointsModel.setWaypoints(UpdateType.INIT, response[2]);
  })
  .catch(() => {
    waypointsModel.setWaypoints(UpdateType.ERROR, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
