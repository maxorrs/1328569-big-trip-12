import Observer from '../utils/observer.js';

export default class Waypoints extends Observer {
  constructor() {
    super();
    this._waypoints = [];
    this._wapointsCount = 0;
  }

  getWaypoints() {
    return this._waypoints;
  }

  setWaypoints(updateType, waypoints) {
    this._waypoints = waypoints.slice();
    this._wapointsCount = this._waypoints.length;
    this._notify(updateType);
  }

  updateWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      update,
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this._waypoints = [
      update,
      ...this._waypoints
    ];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this._waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete`);
    }

    this._waypoints = [
      ...this._waypoints.slice(0, index),
      ...this._waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
