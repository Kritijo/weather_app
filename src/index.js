import "./styles.css";
const icons = {};

function importIcons() {
    const context = require.context(
        "../images/icons",
        false,
        /\.(png|jpe?g|svg)$/
    );
    context.keys().forEach((key) => {
        const fileName = key.replace("./", "").replace(/\.\w+$/, "");
        icons[fileName] = context(key);
    });
}
importIcons();

async function getWeatherData(input, tempUnit) {
    const gif = document.querySelector(".gif");
    gif.classList.add("loader");

    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input}?unitGroup=${tempUnit}&key=WE3DTCFXMA4ZSAM2M2LYSRYFH&contentType=json`
        );
        const responseJson = await response.json();

        const card = weatherCard();
        card.setUpCard(responseJson);

        gif.classList.remove("loader");
    } catch (error) {
        gif.classList.remove("loader");
        alert("Could not fetch weather data. Please try again.");
    }
}

function weatherCard() {
    const card = document.querySelector(".weather-card");

    const generateCard = () => {
        card.textContent = "";
        const elements = ["address", "temp", "condition", "humidity", "desc"];

        elements.forEach((className) => {
            const div = document.createElement("div");
            div.className = className;
            card.appendChild(div);
        });
    };

    const dispatchIcon = (icon) => {
        const iconImg = document.createElement("img");
        iconImg.src = icons[icon];
        iconImg.alt = icon;
        iconImg.classList.add("weather-icon");

        card.append(iconImg);
    };

    const setUpCard = (responseJson) => {
        generateCard();

        const cardData = {
            address: responseJson.resolvedAddress,
            temp: `${responseJson.currentConditions.temp}°`,
            condition: responseJson.currentConditions.conditions,
            humidity: `Humidity : ${Math.round(
                responseJson.currentConditions.humidity
            )}%`,
            desc: responseJson.description,
        };

        const icon = responseJson.currentConditions.icon;
        dispatchIcon(icon);

        Array.from(card.children).forEach((Item) => {
            Item.textContent = cardData[Item.classList.value];
        });
    };

    return { setUpCard };
}

function Eventlistners() {
    const input = document.querySelector("input");
    let tempUnit = "uk";

    input.addEventListener("keydown", (e) => {
        if (e.code === "Enter" && input.value !== "") {
            getWeatherData(input.value, tempUnit);
        }
    });

    const toggle = document.getElementById("tempToggle");
    const unitDisplay = document.querySelector(".slider .unit");

    toggle.addEventListener("change", () => {
        unitDisplay.textContent = toggle.checked ? "°F" : "°C";
        tempUnit = toggle.checked ? "us" : "uk";
        const query = input.value;
        if (query) getWeatherData(query, tempUnit);
    });
}
Eventlistners();
