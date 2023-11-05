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

const containerMeteo = document.querySelector(".container");
const containerForcast = document.querySelector("container-forecast");

const cityElement = containerMeteo.querySelector(".city");
const tempElement = containerMeteo.querySelector(".temp");
const tempMinElement = containerMeteo.querySelector(".temp-min");
const tempMaxElement = containerMeteo.querySelector(".temp-max");
const humidityElement = containerMeteo.querySelector(".humidity");
const windElement = containerMeteo.querySelector(".wind");

// Élément du DOM qui accueille la barre de recherche
const searchContainer = document.querySelector(".search-container");

// Création balise
const searchBar = document.createElement("input");
searchBar.setAttribute("type", "text"); // Définition du type "text" pour l'input
searchBar.setAttribute("placeholder", "Recherche");
searchBar.className = "search-bar";

// Création de la balise <i> pour l'icône
const iconElement = document.createElement("i");
iconElement.className = "fa-solid fa-magnifying-glass fa-rotate-90";

// Ajout de l'icône à la balise input
searchBar.appendChild(iconElement);

searchContainer.appendChild(searchBar);

let searchTimeout; // Variable pour stocker le minuteur

searchBar.addEventListener("input", function (event) {
  clearTimeout(searchTimeout); // Réinitialise le minuteur à chaque frappe
});
// Met en place un minuteur pour déclencher la recherche après 500 millisecondes
searchTimeout = setTimeout(function () {
  const cityName = searchBar.value;

  function afficherMeteoActuelle(cityName) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=0ad687d92e8faa31ef918eff2e362358&lang=fr&units=metric"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.name === cityName) {
          cityElement.innerHTML = data.name;

          tempElement.innerHTML = Math.round(data.main.temp) + "°c";
          // tempMinElement.innerHTML = data.main.temp_min + "°c";
          // tempMaxElement.innerHTML = data.main.temp_max + "°c";
          humidityElement.innerHTML = `<i class="fa-solid fa-droplet"></i> ${data.main.humidity}%`;
          windElement.innerHTML = data.wind.speed + "km/h";

          const weatherMain = data.weather[0].main;
          let weatherImage = "";

          switch (weatherMain) {
            case "Clear":
              weatherImage = "images/sun.png";
              break;
            case "Rain":
              weatherImage = "images/rain.png";
              break;
            case "Mist" ||
              "Smoke" ||
              "Haze" ||
              "Dust" ||
              "Fog" ||
              "Sand" ||
              "Ash" ||
              "Squall" ||
              "Tornado":
              weatherImage = "images/mist.png";
              break;
            case "Snow":
              weatherImage = "images/snow.png";
              break;
            case "Clouds":
              weatherImage = "images/cloudy.png";
              break;
            case "Drizzle":
              weatherImage = "images/shoverrain.png";
              break;
            case "Thunderstom":
              weatherImage = "images/storm.png";
              break;
            // Une image par défaut si la météo n'est pas reconnue
            default:
              weatherImage = "images/cloud.png";
          }

          const weatherElement = containerMeteo.querySelector(".weather-image");
          weatherElement.src = weatherImage;

          // Affichage de l'image
          if (weatherImage !== "") {
            weatherElement.src = weatherImage;
          } else {
            console.log("Météo non reconnue.");
          }
        } else {
          console.log("Ville non trouvée dans les données");
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }

  function afficherMeteo5Jours(cityName) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&appid=0ad687d92e8faa31ef918eff2e362358&lang=fr&units=metric"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Faites ce que vous voulez avec les données de la réponse
        if (data.name === cityName) {
          cityElement.innerHTML = data.name;

          tempElement.innerHTML = Math.round(data.main.temp) + "°c";
          // tempMinElement.innerHTML = data.main.temp_min + "°c";
          // tempMaxElement.innerHTML = data.main.temp_max + "°c";
          humidityElement.innerHTML = `<i class="fa-solid fa-droplet"></i> ${data.main.humidity}%`;
          windElement.innerHTML = data.wind.speed + "km/h";
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  }

  // Écouteur d'événement sur la barre de recherche
  searchBar.addEventListener("input", function (event) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      const cityName = searchBar.value;

      // Appelez les fonctions pour afficher la météo actuelle et à 5 jours
      afficherMeteoActuelle(cityName);
      afficherMeteo5Jours(cityName);
    }, 500);
  });
});
