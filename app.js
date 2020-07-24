//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
var moment = require('moment');
const app = express();
let sRise = '';
let sSet = '';
let temp = '';
let cityName = '';
let imageURL = '';
let windSpeed = '';
let humidity = '';



app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long"
  };
  var day = today.toLocaleDateString("hi-IN", options);
  res.render("cityWeather", {
    sunrise: sRise,
    minTemp: sSet,
    kindOfDay: day,
    currentTemp: temp,
    cityName: cityName,
    weatherImage: imageURL,
    windSpeed: windSpeed,
    humidity: humidity
  });

});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "87c109718e36f25f703a8ba7874dad86";
  const unit = "metric";
  const lang = "hi";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit + "&lang=" + lang;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      cityName = weatherData.name;
      temp = Math.floor(weatherData.main.temp);
      windSpeed = weatherData.wind.speed;
      maxTemp = weatherData.main.temp_max;
      minTemp = weatherData.main.temp_min;
      humidity = weatherData.main.humidity;
      dt = weatherData.dt;
      timezone = weatherData.timezone;
      // const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      imageURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

      const today = new Date();
      const options = {
        weekday: "long",
        day: "2-digit",
        month: "long"
      };

      var day = today.toLocaleDateString("hi-IN", options);

      function convertTime(unixTime, offset) {
        let dt = new Date((unixTime) * 1000);
        let h = dt.getHours();
        let m = "0" + dt.getMinutes();
        let t = h + ":" + m.substr(-2);
        return t;
      }

      sRise = convertTime(weatherData.sys.sunrise, weatherData.timezone);
      sSet = convertTime(weatherData.sys.sunset, weatherData.timezone);

      res.render("cityWeather", {
        sunrise: sRise,
        minTemp: sSet,
        kindOfDay: day,
        currentTemp: temp,
        cityName: cityName,
        weatherImage: imageURL,
        windSpeed: windSpeed,
        humidity: humidity
      });
    });
  });
});



app.listen(3000, function() {
  console.log("Server is listening at port 3000");
});
