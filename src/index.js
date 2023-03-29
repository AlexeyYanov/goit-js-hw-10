import './css/styles.css';
import debounce from 'lodash.debounce';

import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
function markUpList(countries) {
  const CountriesList = countries
    .map(country => {
      return `<li class="item">
        <img class="item_flag" src="${country.flags.svg}"><span class="item_name">${country.name.common}</span>
        </li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('afterbegin', CountriesList);
}
function markUpCard([{ name, capital, population, flags, languages }]) {
  const countryCard = `<img src="${
    flags.svg
  }" class="item_flag"><span class="item_name">${
    name.official
  }</span><p class="item_prop">Capital: <span class="item_details">${capital}</span></p><p class="item_prop">Population: <span class="item_details">${population}</span></p><p class="item_prop">Languages: <span class="item_details">${Object.values(
    languages
  ).join(', ')}</span></p>`;
  countryInfo.insertAdjacentHTML('afterbegin', countryCard);
}

function clearmarkUp() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function notificationTooMany() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
function renderCountryData() {
  let searchQuery = inputCountry.value.trim();
  console.log(searchQuery);

  if (!searchQuery) {
    Notiflix.Notify.warning('Fill input');
    return;
  }
  fetchCountries(searchQuery)
    .then(country => {
      clearmarkUp();
      if (country.length > 10) {
        notificationTooMany();
      } else if (country.length >= 2 && country.length <= 10) {
        markUpList(country);
        console.log(country);
      } else if (country.length === 1) {
        markUpCard(country);
        console.log(country);
      }
    })
    .catch(showError);
}
function showError(error) {
  console.log(error.message);
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
inputCountry.addEventListener(
  'input',
  debounce(renderCountryData, DEBOUNCE_DELAY)
);
