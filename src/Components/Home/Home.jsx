import "./Home.css";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const notFoundNotify = (msg) => toast.error(msg);

const Home = () => {
  const [data, setData] = useState();
  const [temperature, setTemperature] = useState("C");

  const fetchData = (location) => {
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&aqi=no`
    )
      .then((res) => res.json())
      .then((newData) => {
        if (newData.error) {
          notFoundNotify(newData.error.message);
        } else {
          setData(newData);
        }
      });
  };

  const handleClick = (temp) => {
    setTemperature(temp);
  };

  const currentDate = () => {
    const day = new Date();
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let weekDay = weekDays[day.getDay()];
    let month = months[day.getMonth()];
    let date = day.getDate();
    let year = day.getFullYear();
    const time = data.current.last_updated.split(" ")[1];

    return `${weekDay}, ${month} ${date}, ${year} at ${time}`;
  };

  useEffect(() => {
    fetchData("Kalakad");
  }, []);

  const handleEnter = (value) => {
    fetchData(value);
  };

  return (
    <>
      <Toaster />
      {data ? (
        <div className="flex-div">
          <div className="container">
            <div className="top">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Search for a city..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEnter(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              <div className="temp">
                <p
                  className={temperature === "C" ? "active" : ""}
                  onClick={() => {
                    handleClick("C");
                  }}
                >
                  °C
                </p>
                <p
                  className={temperature === "F" ? "active" : ""}
                  onClick={() => {
                    handleClick("F");
                  }}
                >
                  °F
                </p>
              </div>
            </div>
            <h1>
              {data.location.name}, {data.location.country}
            </h1>
            <p>{currentDate()}</p>
            <p className="condition">{data.current.condition.text}</p>
            <img src={data.current.condition.icon} alt="icon" />
            <p className="temperature">
              {temperature === "C" ? data.current.temp_c : data.current.temp_f}°
            </p>
            <div className="flex-bottom">
              <div className="box l-box">
                <p>Real Feel</p>
                <p>
                  {temperature === "C"
                    ? data.current.feelslike_c
                    : data.current.feelslike_f}
                  °
                </p>
              </div>
              <div className="box r-box">
                <p>Humidity</p>
                <p>{data.current.humidity}%</p>
              </div>
            </div>
            <div className="flex-bottom">
              <div className="box l-box">
                <p>Wind</p>
                <p>{data.current.wind_kph} km/h</p>
              </div>
              <div className="box r-box">
                <p>Pressure</p>
                <p>{data.current.pressure_mb} hPa</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader-div">
          <div class="loader"></div>
        </div>
      )}
    </>
  );
};

export default Home;
