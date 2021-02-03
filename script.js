$(document).ready(function() {

  var APIKEY = "b44228de0fff9bb296f65506f3071a2f";
  var searchBtn = $(".search-button");
  var currentCity = "";
  var lastCity = "";

  $("#search-button").on("click", function() {
    var cityID = $("#search-input").val();

    // clear input box
    $("#search-input").val("");
    currentWeather(cityID);
  });

  $(".history").on("click", "li", function() {
    currenthWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $("#history").append(li);
  }
  
  function currentWeather(cityID) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityID + "&units=imperial" + "&appid=" + APIKEY;

    fetch(requestUrl)
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        // create history link for this search
        if (history.indexOf(cityID) === -1) {
          history.push(cityID);
          window.localStorage.setItem("history", JSON.stringify(history));   
          makeRow(cityID);
        }
        
        // clear any old content
        $("#current").empty();

        // create html content for current weather
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        // merge and add to page
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#current").append(card);

        // call follow-up api endpoints
        getForecast(cityID);
        getUVIndex(data.coord.lat, data.coord.lon);
      })
    //});
  };
  
  function getForecast(cityID) {
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



var currentDay = moment().format("dddd, MMMM Do");
function insertCurrentDay() {
    $("#current-date").text(currentDay);
};
insertCurrentDay();
console.log(currentDay);

document.querySelector("#search-button").addEventListener//("click", getcityID);
//("click", cityID);
