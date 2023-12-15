// Sélectionnez l'élément par son ID
const dateElement = document.querySelector(".date");

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
    const cityName = searchBar.value;
    afficherMeteoActuelle(cityName);
    afficherMeteo5Jours(cityName); // Ajout de l'appel à la fonction pour les prévisions
  }, 500);
});

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
        let weatherImage = "";

        switch (weatherMain) {
          case "Clear":
            weatherImage = "images/sun.png";
            break;
          case "Rain":
            weatherImage = "images/rain.png";
            break;
          case "Mist":
          case "Smoke":
          case "Haze":
          case "Dust":
          case "Fog":
          case "Sand":
          case "Ash":
          case "Squall":
          case "Tornado":
            weatherImage = "images/mist.png";
            break;
          case "Snow":
            weatherImage = "images/snow.png";
            break;
          case "Clouds":
            weatherImage = "images/cloudy.png";
            break;
          case "Drizzle":
            weatherImage = "images/shower-rain.png";
            break;
          case "Thunderstorm":
            weatherImage = "images/storm.png";
            break;
          default:
            weatherImage = "images/cloud.png";
        }

        weatherImageElement.src = weatherImage;
      } else {
        console.log("Ville non trouvée dans les données");
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
    });
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

        // Itérez sur les prévisions (les 5 prochains jours)
        for (let i = 0; i < 5; i++) {
          const forecastData = data.list[i]; // Récupérez les données pour la journée

          // Utilisez les éléments des cartes de prévision
          const forecastCity = forecastCards[i].querySelector(".city");
          const forecastTemp = forecastCards[i].querySelector(".temp");
          const forecastHumidity = forecastCards[i].querySelector(".humidity");
          const forecastWind = forecastCards[i].querySelector(".wind");

          // Affichez les données pour la journée i

          forecastTemp.textContent = Math.round(forecastData.main.temp) + "°C";
          forecastHumidity.innerHTML = `<i class="fa-solid fa-droplet"></i> ${forecastData.main.humidity}%`;
          forecastWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${forecastData.wind.speed}km/h`;
        }
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
