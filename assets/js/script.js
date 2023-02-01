const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "4d8fb5b93d4af21d66a2948710284366";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  // Check if input is already in the list
  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });
    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  // Get inputs from local storage
  let inputs = [];
  if (localStorage.getItem("inputs")) {
    inputs = JSON.parse(localStorage.getItem("inputs"));
  }

  // Add new input to inputs
  inputs.push(inputVal);
  localStorage.setItem("inputs", JSON.stringify(inputs));

  // Display the last five inputs
  const inputList = document.querySelector(".input-list");
  let lastFiveInputs = inputs.slice(Math.max(inputs.length - 5, 0));
  inputList.innerHTML = "";
  lastFiveInputs.forEach((input) => {
    let listItem = document.createElement("li");
    listItem.textContent = input;
    inputList.appendChild(listItem);
  });

  // Fetch weather data
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { list: fiveDaysData } = data;
      const forecastList = document.querySelector(".forecast-list");
      forecastList.innerHTML = "";
      fiveDaysData.forEach(weatherData => {
        const { dt, main, weather } = weatherData;
        const date = new Date(dt * 1000);
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
        }.svg`;
      
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="date">${date.toLocaleDateString()}</div>
          <div class="icon">
            <img src="${icon}" alt="${weather[0]["description"]}">
          </div>
          <div class="temp">
            <span>${Math.round(main.temp)}°C</span>
          </div>`;
        forecastList.appendChild(li);
      });
  
    });
  })