
import SmartView from './smart.js';
import {createPhoto, getDatalist, remakeDate} from '../utils/event.js';
import {types, getType, getOffers, generateDescription} from '../utils/waypoint.js';

const createTypeActivityTemplate = (data) => {
  return (Object
    .values(types.activity)
    .map((activity) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${activity}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity}" ${data.type === activity ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${activity.toLowerCase()}" for="event-type-${activity}-1">${activity}</label>
        </div>`
      );
    })
  ).join(``);
};

const createTypeTransferTemplate = (data) => {
  return (Object.
    values(types.transfer)
    .map((transfer) => {
      const type = transfer === `Check` ? `Check-in` : transfer;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${data.type === transfer ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${transfer}</label>
        </div>`
      );
    })
  ).join(``);
};

const createOffersTemplate = (data) => {
  return (Object
    .values(data.offers)
    .map((item) => {
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox visually-hidden" id="${item.name}-1" type="checkbox" name="${item.name}" ${item.isEnabled ? `checked` : ``}>
            <label class="event__offer-label" for="${item.name}-1">
              <span class="event__offer-title">${item.description}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${item.price}
              </span>
          </label>
        </div>`
      );
    }).join(``)
  );
};

const createEventTemplate = (uniqueCitiesDatalist, data) => {
  const {city, isFavorite, price, photos, description} = data;
  const {startTime, endTime} = data.time;
  const photo = createPhoto(photos);
  const startTimeValue = remakeDate(startTime);
  const endTimeValue = remakeDate(endTime);
  const typeForAttr = data.type.toLowerCase() === `check` ? `check-in` : data.type.toLowerCase();
  const type = getType(data.type);

  const datalist = getDatalist(uniqueCitiesDatalist);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${typeForAttr}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${createTypeActivityTemplate(data)}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${createTypeTransferTemplate(data)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${datalist}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTimeValue}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTimeValue}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersTemplate(data)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${description ? `<p class="event__destination-description">${description}</p>` : ``}

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photo}
          </div>
        </div>
      </section>
    </section>
  </form>`
  );
};

export default class EditEvent extends SmartView {
  constructor(uniqueCitiesDatalist, waypoint) {
    super();
    this._uniqueCitiesDatalist = uniqueCitiesDatalist;
    this._data = EditEvent.parseWaypointToData(waypoint);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._clickCloseHandler = this._clickCloseHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseWaypointToData(waypoint) {
    return Object
      .assign(
          {},
          waypoint
      );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    return data;
  }

  reset(waypoint) {
    this
      .updateData(
          EditEvent.parseWaypointToData(waypoint)
      );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._data);
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _clickCloseHandler(evt) {
    evt.preventDefault();
    this._callback.close();
  }

  setClickCloseHandler(callback) {
    this._callback.close = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickCloseHandler);
  }

  _formResetHandler(evt) {
    evt.preventDefault();
    this._callback.reset();
  }

  setFormResetHandler(callback) {
    this._callback.reset = callback;
    this.getElement().addEventListener(`reset`, this._formResetHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.submit);
    this.setFormResetHandler(this._callback.reset);
    this.setClickCloseHandler(this._callback.close);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);
    const typeContainers = this.getElement().querySelectorAll(`.event__type-input`);

    for (const container of typeContainers) {
      container.addEventListener(`input`, this._typeChangeHandler);
    }
  }

  getTemplate() {
    return createEventTemplate(this._uniqueCitiesDatalist, this._data);
  }

  _favoriteHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value
    }, true);
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: getOffers(evt.target.value, true),
      description: generateDescription()
    });
  }
}