
 let cityInput = document.getElementById("input-field");
 searchBtn = document.getElementById("search_btn")
  api_Key = 'd8e3c802d3c987c1a7233c0bb5b84baf';

 let nextFiveDays = document.getElementById("next-five-day");
 let currentLocation = document.getElementById("current-location");
 let dropBtn = document.getElementById("drop-opt");

    function getWeatherDetails(name,lat,lon,country,state){
        let FORCOST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`,
         WEATHERAPI__URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`,
         days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
            ],
            months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
            //// current day weather information
            fetch(WEATHERAPI__URL).then(res=>res.json()).then(data=>{
                       //console.log(data);
                       let date = new Date();
                       document.getElementById("main-temp").innerHTML= `${(data.main.temp - 273.15).toFixed(2)}&degC`;
                       document.getElementById("feels").innerHTML= `Feels like ${(data.main.feels_like - 273.15).toFixed(2)}&degC`
                      document.getElementById("weather-icon").innerHTML = `<img src = "https:\\openweathermap.org/img/wn/${data.weather[0].icon}.png">`
                       document.getElementById("cloud-condition").innerHTML= `${data.weather[0].description}`
                       document.getElementById("country").innerHTML= `${data.sys.country} ${data.name}`
                       document.getElementById("date-time").innerHTML= `${days[date.getDay()]}   ${date.getDate()}   ${months[date.getMonth()]} ${date.getFullYear()}`

                        document.getElementById("min").innerHTML = `Min ${(data.main.temp_min - 273.15).toFixed()}&degC`;
                        document.getElementById("max").innerHTML = `Max ${(data.main.temp_max - 273.15).toFixed()}&degC`;
                     const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                     const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                     document.getElementById("sunrise").innerHTML = `Sunrise: ${sunriseTime}`;
                     document.getElementById("sunset").innerHTML = `Sunset: ${sunsetTime}`;
                        
                           document.getElementById("humidity").innerHTML = `${data.main.humidity} %`
                           document.getElementById("wind-speed").innerHTML = `${data.wind.speed} m/s`
                         document.getElementById("pressure").innerHTML = `${data.main.pressure} Pa`

            }).catch(()=>{
                alert("Failed to fech current weather")
            })
              ////five days weather information
            fetch(FORCOST_URL).then(RES=>RES.json()).then(data=>{
                let uniqForecostDays = [];
                let fiveDaysForecost = data.list.filter(forcost =>{
                    let forcostDate = new Date(forcost.dt_txt).getDate();
                    if(!uniqForecostDays.includes(forcostDate)){
                        return uniqForecostDays.push(forcostDate);
                    }
                })
               // console.log(fiveDaysForecost)
                nextFiveDays.innerHTML = '';
                for(i=1;i<fiveDaysForecost.length;i++){
                    let date = new Date(fiveDaysForecost[i].dt_txt);
                    nextFiveDays.innerHTML+=`
                       <div class="flex-col justify-center justify-items-center text-center shadow-xl p-4  text-xl ">
                             <img src = "https://openweathermap.org/img/wn/${fiveDaysForecost[i].weather[0].icon}.png" alt = "wether icons">
                             <h1><i class="fa-solid fa-temperature-three-quarters"></i>  ${(fiveDaysForecost[i].main.temp-273.15).toFixed()}&degC</h1>
                             <p><span><i class="fa-solid fa-droplet"></i>   ${fiveDaysForecost[i].main.humidity} %</p>
                             <p>${date.getDate()} ${months[date.getMonth()]}</p>
                             <p>${days[date.getDay()]}</p>
                       </div>
                    `
                }
            }).catch(()=>{
                alert('Failed to fetch weather')
            })
    }
// Search by citiy name
     function getCityCoordinate() {
     let cityName = cityInput.value.trim();
      cityInput.value = '';
      if(!cityName) return;
      let GEOCODE_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;
      fetch(GEOCODE_URL).then(res=>res.json()).then(data=>{
        console.log(data);
        let{name,lat,lon,country,state} = data[0];
        getWeatherDetails(name,lat,lon,country,state);
      }).catch(()=>{
        alert(`Failed to fetch coordinate of${cityName}`);
      })
    const valueStore = cityInput.value;
       localStorage.setItem("storeX", valueStore)
       
 }    
// search by current location    ///
 function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position=>{
        let {latitude,longitude}= position.coords;
        console.log(latitude,longitude)
        let REVERSE_GEOLOCATORURL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_Key}`;
        fetch(REVERSE_GEOLOCATORURL).then(res=>res.json()).then(data=>{
            let{name,country,state} = data[0]
            getWeatherDetails(name,latitude,longitude,country,state);
        }).catch(()=>{
            alert('Failed to fetch user coordinates')
        })
    })
 }

 ///drop down move to input box
 dropBtn.addEventListener("change",function(e){
      let targetV =  e.target.value;
      console.log(targetV)
      cityInput.value = targetV;
 })
 

   
 searchBtn.addEventListener("click",getCityCoordinate);
 currentLocation.addEventListener('click',getUserCoordinates)










