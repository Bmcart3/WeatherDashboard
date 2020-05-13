//Starts with previously stored searches or starts with an empty array.
var searches = JSON.parse(localStorage.getItem("searches")) || [];

//history of searches functionality. loops through array and appends buttons with text of the input and adds data-attribute and class.
function renderHistory() {
    $("#history").empty();
    for (var i = 0; i < searches.length; i++) {
        $("#history").append($("<button>").text(searches[i]).attr("data-value", searches[i]).addClass("buttons"));
    }
};

//Pushes form value into empty searches array. sets local storage. clears the form. calls both renderHistory and getWeather functions.
$("form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#city").val().trim();
    console.log(city);
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
};

renderHistory();
