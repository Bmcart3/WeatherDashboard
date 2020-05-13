//Starts with previously stored searches or starts with an empty array.
var searches = JSON.parse(localStorage.getItem("searches")) || [];

//history of searches functionality. loops through array and prepend buttons with text of the input and adds data-attribute and class.
function renderHistory() {
    $("#history").empty();
    for (var i = 0; i < searches.length; i++) {
        $("#history").prepend($("<button>").text(searches[i]).attr("data-value", searches[i]).addClass("buttons"));
    }
};

//Pushes form value into empty searches array. sets local storage. clears the form. calls both renderHistory and getWeather functions.
$("form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#city").val().trim();
    searches.push(city);

    localStorage.setItem("searches", JSON.stringify(searches));

    $("#city").val("")
    renderHistory();
    getWeather(city);
});


//click handler for dynamically created buttons. calls getWeather function.
//city variable is set to the data attribute which is the actual city name the user input.
$(document).on("click", ".buttons", function () {
    var city = $(this).attr("data-value");
    console.log(city);
    getWeather(city);
})

//makes api request, inputs requested values into current weather section.
function getWeather(city) {
    $(".col-8").empty();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=b308b6060f06e57b47078db89c772633",
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#inputCity").text(response.name);
        $("#inputTemp").text("Temperature: " + Math.floor(response.main.temp));
        $("#inputHum").text("Humidity: " + response.main.humidity + "%");
        $("#inputWind").text("Wind speed: " + response.wind.speed);
        // $("#inputUV").text(response.Name) cant find the UV index.... nothing in documentation unless im looking in wrong place....
    })
    //second api request for 5 day forecast section
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=b308b6060f06e57b47078db89c772633",
        method: "GET"
    }).then(function(response){
        console.log(response);
        //each array item is a 3 hour block. incremented by 24 hours per array item to get the next day at same time block.
        var dataArray = [response.list[4], response.list[12], response.list[20], response.list[28], response.list[36]];
        var $newH1 = $("<h1>").text("5 Day Forecast");
        $(".col-8").append($newH1);

        dataArray.forEach(function(arrItem){
            var $div = $("<div>").addClass("whatever");
            var $date = $("<p>").text(arrItem.dt_txt.split(" ")[0]);
            var $icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + arrItem.weather[0].icon + "@2x.png");
            var $temp = $("<p>").text("Temperature: " + Math.floor(arrItem.main.temp));
            var $humidity = $("<p>").text("Humidity: " + arrItem.main.humidity + "%");
            $div.append($date, $icon, $temp, $humidity);
            $(".col-8").append($div);
        })
    })
};

renderHistory();
