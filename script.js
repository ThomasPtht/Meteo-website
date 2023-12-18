// Fonction pour afficher la météo par défaut (Paris)
function afficherMeteoParDefaut() {
  const villeParDefaut = "Paris";
  afficherMeteoActuelle(villeParDefaut);
  afficherMeteo5Jours(villeParDefaut);
}

// Appel de la fonction au chargement de la page
afficherMeteoParDefaut();

// Sélectionnez l'élément par son ID
const dateElement = document.querySelector(".date-today");

// Créez un objet Date pour obtenir la date actuelle
const currentDate = new Date();

// Options pour formater la date
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// Formatez la date en utilisant les options
const formattedDate = currentDate.toLocaleDateString("fr-FR", options);

// Insérez la date dans l'élément HTML
dateElement.textContent = formattedDate;

const containerMeteo = document.querySelector(".container-meteo");
const containerForcast = document.querySelector(".container-forecast");

const cityElement = containerMeteo.querySelector(".city");
const tempElement = containerMeteo.querySelector(".temp");
const humidityElement = containerMeteo.querySelector(".humidity");
const windElement = containerMeteo.querySelector(".wind");
const weatherImageElement = containerMeteo.querySelector(".weather-image");

// Elément du DOM qui accueille la barre de recherche
const searchContainer = document.querySelector(".search-container");

// Création de la balise input pour la recherche
const searchBar = document.createElement("input");
searchBar.setAttribute("type", "text");
searchBar.setAttribute("placeholder", "Recherche");
searchBar.className = "search-bar";

// Création de l'icône de recherche
const iconElement = document.createElement("i");
iconElement.className = "fa-solid fa-magnifying-glass fa-rotate-90";

// Ajout de l'icône à la balise input
searchBar.appendChild(iconElement);

// Ajout de la barre de recherche au conteneur de recherche
searchContainer.appendChild(searchBar);

let searchTimeout; // Variable pour stocker le minuteur

// Événement d'entrée dans la barre de recherche
searchBar.addEventListener("input", function (event) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(function () {
    const cityName = capitalizeFirstLetter(searchBar.value); // Convertir la première lettre en majuscule
    afficherMeteoActuelle(cityName);
    afficherMeteo5Jours(cityName);
  }, 500);
});

// Fonction pour capitaliser la première lettre
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Fonction pour afficher la météo actuelle
export function afficherMeteoActuelle(cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=0ad687d92e8faa31ef918eff2e362358&lang=fr&units=metric"
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.name === cityName) {
        cityElement.textContent = data.name;
        tempElement.textContent = Math.round(data.main.temp) + "°C";
        humidityElement.innerHTML = `<i class="fa-solid fa-droplet"></i> ${data.main.humidity}%`;
        windElement.innerHTML = `<i class="fa-solid fa-wind"></i> ${data.wind.speed}km/h`;

        const weatherMain = data.weather[0].main;
        const weatherImageSrc = getWeatherImage(weatherMain);

        weatherImageElement.src = weatherImageSrc;
      } else {
        console.log("Ville non trouvée dans les données");
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
}

function getWeatherImage(weatherMain) {
  switch (weatherMain) {
    case "Clear":
      return "images/sun.png";
    case "Rain":
      return "images/rain.png";
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Dust":
    case "Fog":
    case "Sand":
    case "Ash":
    case "Squall":
    case "Tornado":
      return "images/mist.png";
    case "Snow":
      return "images/snow.png";
    case "Clouds":
      return "images/cloudy.png";
    case "Drizzle":
      return "images/shower-rain.png";
    case "Thunderstorm":
      return "images/storm.png";
    default:
      return "images/cloud.png";
  }
}

////////////////////// METEO 5 JOURS //////////////////////////////

function afficherMeteo5Jours(cityName) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=0ad687d92e8faa31ef918eff2e362358&lang=fr&units=metric"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.city.name === cityName) {
        // Récupérez les éléments de la section de prévision
        const forecastCards =
          containerForcast.querySelectorAll(".card-forecast");

        // Créez un objet pour stocker les prévisions par jour
        const dailyForecasts = {};

        // Itérez sur toutes les entrées de la liste de prévisions
        data.list.forEach((forecastData) => {
          const forecastDate = new Date(forecastData.dt_txt);

          // Vérifiez si la date de la prévision est à l'avenir
          if (forecastDate > currentDate) {
            // Utilisez seulement les prévisions pour midi (ou une heure spécifique)
            if (forecastDate.getHours() === 9) {
              const dateKey = forecastDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Ajoutez la première prévision au jour correspondant dans l'objet dailyForecasts
              if (!dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = forecastData;

                // Affichez les données pour le jour correspondant
                const forecastDateElement =
                  forecastCards[
                    Object.keys(dailyForecasts).length - 1
                  ].querySelector(".date");
                const forecastTemp =
                  forecastCards[
                    Object.keys(dailyForecasts).length - 1
                  ].querySelector(".temp");
                const forecastHumidity =
                  forecastCards[
                    Object.keys(dailyForecasts).length - 1
                  ].querySelector(".humidity");
                const forecastWind =
                  forecastCards[
                    Object.keys(dailyForecasts).length - 1
                  ].querySelector(".wind");
                const forecastImageElement =
                  forecastCards[
                    Object.keys(dailyForecasts).length - 1
                  ].querySelector(".weather-image");

                // Affichez les données pour le jour correspondant
                const dayOfWeek = forecastDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                });
                forecastDateElement.textContent = dayOfWeek;
                forecastTemp.textContent =
                  Math.round(forecastData.main.temp) + "°C";
                forecastHumidity.innerHTML = `<i class="fa-solid fa-droplet"></i> ${forecastData.main.humidity}%`;
                forecastWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${forecastData.wind.speed}km/h`;

                // Récupérez le chemin de l'image en fonction du temps
                const weatherMain = forecastData.weather[0].main;
                const weatherImageSrc = getWeatherImage(weatherMain);

                // Définissez le chemin de l'image pour la prévision
                forecastImageElement.src = weatherImageSrc;
              }
            }
          }
        });
      } else {
        console.error(
          "La requête n'a pas réussi. Vérifiez la console pour plus de détails."
        );
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
}
