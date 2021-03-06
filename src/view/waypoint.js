import {getType} from '../utils/waypoint.js';
import {formatTimeForWaypoint, getTimeRange, formatDateForWaypoint} from '../utils/date.js';
import AbstractView from './abstract.js';

const COUNT_OFFERS = 3;

const createOffersDescriptionTemplate = (offers) => {
  return (Object
    .values(offers)
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    }).join(``)
  );
};

const createWaypointTemplate = (waypoint) => {
  const startDateForAttr = formatDateForWaypoint(waypoint.startDate);
  const endDateForAttr = formatDateForWaypoint(waypoint.endDate);

  const startDate = formatTimeForWaypoint(waypoint.startDate);
  const endDate = formatTimeForWaypoint(waypoint.endDate);

  const diffTime = getTimeRange(waypoint.startDate, waypoint.endDate);
  const nameImage = waypoint.type === `check` ? `check-in` : waypoint.type;

  const type = getType(waypoint.type);
  const price = waypoint.price;
  const destinationName = waypoint.destination.name;

  const offersDescription = Object
    .values(waypoint.offers)
    .slice(0, COUNT_OFFERS);

  const templateOffersDescription = createOffersDescriptionTemplate(offersDescription);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${nameImage}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destinationName}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDateForAttr}">${startDate}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDateForAttr}">${endDate}</time>
        </p>
        <p class="event__duration">${diffTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${templateOffersDescription}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class Waypoint extends AbstractView {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
    this._clickHandler = this._clickHandler.bind(this);
    this._rollupBtn = this.getElement().querySelector(`.event__rollup-btn`);
  }

  _clickHandler() {
    this._callback.click();
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this._rollupBtn.addEventListener(`click`, this._clickHandler);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }
}
