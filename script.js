const cityInput=document.querySelector('.city-input')
const searchBtn=document.querySelector('.search-btn')
const notFoundSection=document.querySelector('.not-found');
const searchCitySection=document.querySelector('.search-city');
const weatherInfoSection=document.querySelector('.weather-info');
const countryTxt=document.querySelector('.country-txt');
const currentDateTxt=document.querySelector('.current-date-txt')
const tempTxt=document.querySelector('.temp-txt')
const conditionTxt=document.querySelector('.condition-txt')
const humidityValueTxt=document.querySelector('.humidity-value-txt');
const windValueTxt=document.querySelector('.wind-value-txt');
const weatherSummaryImg=document.querySelector('.weather-summary-img');
const forecastItemsContainer=document.querySelector('.forecast-items-container');



searchBtn.addEventListener('click',()=>{

   if(cityInput.value.trim()!==""){
   updateWeatherInfo(cityInput.value)
    console.log("btn click",cityInput.value)
    cityInput.value=""
    cityInput.blur()
  }
})

cityInput.addEventListener('keydown',(e)=>{
  if(e.key==="Enter" && cityInput.value.trim()!==""){
    updateWeatherInfo(cityInput.value)
console.log("keydown",cityInput.value)
    cityInput.value=""
    cityInput.blur()
  }
})
const apiId="5b4bee0ba241d092159faf007e166080"

async function getFetchData(endPoint,city){
     const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiId}&units=metric`
     const response=await fetch(apiUrl)
     return response.json()
}
function getWeatherIcon(id){
  if(id <= 232) return "thunderstorm.svg ";
    if(id <= 321) return "drizzle.svg "
    if(id <= 531) return "rain.svg "
    if(id <= 622) return "snow.svg "
    if(id <= 781) return "atmosphere.svg "
    if(id <= 800) return "clear.svg "
  else return "clouds.svg"
}
async function updateWeatherInfo(city){
  const weatherData=await getFetchData('weather',city);
  if(weatherData.cod !==200){
    showDisplaySection(notFoundSection);
    return 
  }
  /*
  object destructiaring method
  const {
  name: country,
  main: { temp, humidity },
  weather: [{ id, main }],
  wind: { speed }
} = weatherData;
*/
  const country = weatherData.name;
const temp = weatherData.main.temp;
const humidity = weatherData.main.humidity;
const id = weatherData.weather[0].id;
const main = weatherData.weather[0].main;
const speed = weatherData.wind.speed;
  
    console.log(weatherData)
 
  countryTxt.textContent=country;
  tempTxt.textContent=Math.round(temp)+' °C';
  conditionTxt.textContent=main;
  humidityValueTxt.textContent=humidity+'%';
  windValueTxt.textContent=speed+' M/s'
  weatherSummaryImg.src=`assets/weather/${getWeatherIcon(id)}`
  currentDateTxt.textContent=getCurrentDate()
  await updateForecastInfo(city)

showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city){
  const forecastData=await getFetchData('forecast',city)
  const timeTaken="12:00:00"
  const todayDate=new Date().toISOString().split('T')[0]
  console.log(todayDate)
//console.log("forecastData",forecastData)
  forecastItemsContainer.innerHTML=""
  forecastData.list.forEach((weather)=>{
if(weather.dt_txt.includes(timeTaken)&& !weather.dt_txt.includes(todayDate)){
      updateForecastItems(weather)
    }
  })
}

function updateForecastItems(weatherData){
  console.log("weatherData",weatherData );
  const date=weatherData.dt_txt.split(" ")[0]
  const temp=Math.round(weatherData.main.temp)
  const id=weatherData.weather[0].id
  const dateTaken=new Date(date)
  const dateOptions={
    day:'2-digit',
    month:'short'
  }
  updatedDate=dateTaken.toLocaleDateString('en-US',dateOptions)
console.log("dateTaken",updatedDate)
  const forecastItem=`
  <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${updatedDate}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img" />                                                                                   <h5 class="forecast-item-temp">${temp} °C</h5>
         </div>
  `
  forecastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)

  
}

function showDisplaySection(section) {
  [searchCitySection,notFoundSection,weatherInfoSection].forEach((sec)=>{
    sec.style.display="none"
    sec.classList.remove("animate-flip-in"); 
    // remove animation if it was added before
  })
  section.style.display="flex"
  void section.offsetWidth;

  section.classList.add("animate-flip-in");
}

function getCurrentDate(){
  currentDate=new Date();
  const options={
    weekday:'short',
    day:'2-digit',
    month:'short'
  }
  return currentDate.toLocaleDateString('en-US',options)
}
