$(document).ready(function() {

  var APIKEY = "b44228de0fff9bb296f65506f3071a2f";
  var weather = "";
  var city = "";

  var currentDay = moment().format("dddd, MMMM Do");
  function insertCurrentDay() {
    $("#current-date").text(currentDay);
  };
  insertCurrentDay();
  console.log(currentDay);

  var history = JSON.parse(localStorage.getItem("cities")) === null ? [] : JSON.parse(localStorage.getItem("cities"));

  displaySearchHistory();
  function currentWeather() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityID + "&units=imperial" + "&appid=" + APIKEY;

    if ($(this).attr("id") === "search-button") {
      city = $("#city").val();
    } else {
      city = $(this).text();
    }

    fetch(requestUrl)
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        // create history link for this search
        if (history.indexOf(cityID) === -1) {
          history.push(cityID);
        }
        console.log(history);
        localStorage.setItem("cities", JSON.stringify(history));

        window.localStorage.setItem("history", JSON.stringify(history));     
        
        // clear any old content
        $("#current").empty();

        // create html content for current weather

        $.getJSON(weather, function (json) {
          let temp = (json.main.temp - 273.15) * (9 / 5) + 32;
          let windspeed = json.wind.speed * 2.237;

          $("#current-city").text(json.name + " " + current_date);
          $("#weather-img").attr("src", "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
          $("#temp").text(temp.toFixed(2) + "°F");
          $("#humidity").text(json.main.humidity + "%");
          $("#windspeed").text(windspeed.toFixed(2) + " " + "mph");
        });

      })

  }

  $("#search-button").on("click", function() {
    var cityID = $("#search-input").val();

    // clear input box
    $("#search-input").val("");
    currentWeather(cityID);
  });

  $("#history").on("click", "li", function() {
    currenthWeather($(this).text());
  });

  /*
  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $("#history").append(li);
  }
  */
  function fiveDayForecast(cityID) {
    var requestForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityID + "&units=imperial" + "&appid=" + APIKEY;

    fetch(requestForecastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        
        // overwrite any existing content with title and empty row
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");

            var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());

            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");

            var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + " °F");
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            // merge together and put on page
            col.append(card.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      })

  };

  function getUVIndex(lat, lon) {
       
      var requestUvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;
   
    fetch(requestUvUrl)
      .then(function (response) {
        return response.json();
        })
      .then(function (data) {
        console.log(data);

        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        if (data.value < 3) {
          //btn.addClass("btn-success");
          return "green";
        }
        else if (data.value < 7) {
          //btn.addClass("btn-warning");
          return "orange";
        }
        else {
          //btn.addClass("btn-danger");
          return "red";
        }
        
        $("#current .card-body").append(uv.append(btn));
      })

      //bodyEl,appendChild(uvEl),
      //uvEl,appendChild(buttonEl),
    }
  })

$("#clear-storage").on("click", (event) => {
  localStorage.clear();
});

function displaySearchHistory() {
  $("#search-history").empty();
  history.forEach(function (city) {
      console.log(history);
      let history_item = $("<li>");

      history_item.addClass("list-group-item btn btn-light");
      history_item.text(city);

      $("#search-history").prepend(history_item);
  });
  $(".btn").click(currentWeather);
  $(".btn").click(fiveDayForecast);

}

function clearHistory () {
  $("#search-history").empty();
  history = [];
  localStorage.setItem("cities", JSON.stringify(history));
}

$("#clear-history").click(clearHistory);
$("#search-button").click(displaySearchHistory);
