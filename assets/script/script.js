$(document).ready(function () {


    //Starts with previously stored searches or starts with an empty array.
    var searches = JSON.parse(localStorage.getItem("searches")) || [];

    $("#mainContent").hide();
    //history of searches functionality. loops through array and prepend buttons with text of the input and adds data-attribute and class.
    function renderHistory() {
        $("#history").empty();
        for (var i = 0; i < searches.length; i++) {
            $("#history").prepend($("<button>").text(searches[i]).attr("data-value", searches[i]).addClass("buttons"));
        }
    };

    //Pushes form value into empty searches array. sets local storage. clears the form. calls both renderHistory and getWeather functions.
    $("form").on("submit", function (event) {
        $("#mainContent").show();
        event.preventDefault();
        var city = $("#city").val().trim();
        searches.push(city);

        localStorage.setItem("searches", JSON.stringify(searches));

        $("#city").val("");
        renderHistory();
        getWeather(city);
    });


    //click handler for dynamically created buttons. calls getWeather function.
    $(document).on("click", ".buttons", function () {
        $("#mainContent").show();
        var city = $(this).attr("data-value");
        console.log(city);
        getWeather(city);
    })

    //function getWeather makes 3 api requests for current weather, forecast weather, and uv index information.
    function getWeather(city) {

        $("#fiveDay").empty();
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=b308b6060f06e57b47078db89c772633",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var lat = response.coord.lat;
            var long = response.coord.lon;

            $("#inputCity").text(response.name + " Weather");
            $("#currentDate").text(new Date());
            $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            $("#inputTemp").text("Temperature: " + Math.floor(response.main.temp));
            $("#inputHum").text("Humidity: " + response.main.humidity + "%");
            $("#inputWind").text("Wind speed: " + Math.floor(response.wind.speed) + "mph");

            //api request for the UV. uses lat and long from the input city coordinates.
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=b308b6060f06e57b47078db89c772633&lat=" + lat + "&lon=" + long,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                $("#inputUV").text("UV index: " + Math.floor(response.value));
            })
        });
        //second api request for 5 day forecast section
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=b308b6060f06e57b47078db89c772633",
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //each array item is a 3 hour block. incremented by 24 hours per array item to get the next day at same time block.
            var dataArray = [response.list[4], response.list[12], response.list[20], response.list[28], response.list[36]];
            var $newH1 = $("<h1>").text("5 Day Forecast").css({ "text-decoration": "underline" });
            $("#fiveDay").append($newH1);
            //Loops through each item in data array and dynamically creates 5 day weather forecast.
            dataArray.forEach(function (arrItem) {
                var $div = $("<div>").addClass("whatever");
                var $date = $("<p>").text(arrItem.dt_txt.split(" ")[0]);
                var $icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + arrItem.weather[0].icon + "@2x.png");
                var $temp = $("<p>").text("Temp: " + Math.floor(arrItem.main.temp));
                var $humidity = $("<p>").text("Humidity: " + arrItem.main.humidity + "%");
                $div.append($date, $icon, $temp, $humidity);
                $("#fiveDay").append($div);
            })
        });
    };

    renderHistory();
});
