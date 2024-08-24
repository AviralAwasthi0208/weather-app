// tab switch

 const usertab = document.querySelector("[data-user-weather]" );
 const searchtab =document.querySelector("[data-search-weather]");

 const usercontainer = document.querySelector(".weather-container");

 const grantacess =document.querySelector(".grant-loacation-container");

 const searchform = document.querySelector("[data-searchform]");

 const loadingscreen = document.querySelector(".loading-container");

 const userinfocontainer = document.querySelector(".user-info-container");



 //intially varibles??

let currenttab =usertab;
 const API_KEY = "beab00eeea0dec3a095ab65651e8b6f0";

 const API = "https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric";
 currenttab.classList.add("current-tab");

function switchTab(clickedtab){
    if (clickedtab !=currenttab){
         currenttab.classList.remove("current-tab");
         currenttab = clickedtab;
         currenttab.classList.add("current-tab");


         if(!searchform.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantacess.classList.remove("active");
            searchform.classList.add("active");

         }
         else{
            // main pehle search vaale tab pr tha ab your weather tab visible karana hai
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionstorage();

        }
    };
}
 usertab.addEventListener("click",()=>{

    // pass the clicked tab
    switchTab(usertab);
    console.log("event listner is clicked");
 });

 searchtab.addEventListener("click",()=>{

    // pass the clicked tab
    switchTab(searchtab);
    console.log("event listner is clicked");

 });
//check if coordinates are already present in session storage
 function getfromsessionstorage(){

    const  localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantacess.classList.add("active");
    }

    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchuserweatherinfo(coordinates);
    }

 }
 async function fetchuserweatherinfo(coordinates){

    const {lat,lon} = coordinates;
    grantacess.classList.remove("active");

    //make loader visible

    loadingscreen.classList.add("active");

    //api call 
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude={part}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        console.log(data);

        // function to display data on ui
        renderweatherinfo(data);
 
    }
    catch(err){
        loadingscreen.classList.remove("active");
        console.log("error in fetching api");

    }
}

function renderweatherinfo(weatherinfo){  

    const cityname = document.querySelector("[data-cityname]");

    const countryicon = document.querySelector("[data-countryicon]");

    const humidity =document.querySelector("[data-humidity]");
 
    const windspeed =document.querySelector("[data-windspeed]");

    const cloud =document.querySelector("[data-clouds]");

    const temp = document.querySelector("[data-temp]");

    const weathericon = document.querySelector("[data-weathericon]");

    const weatherdesc = document.querySelector("[data-weatherdesc]");

    cityname.innerText = weatherinfo?.name;

    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;

    weatherdesc.innerText = weatherinfo?.weather?.[0]?.description;

    weathericon.src = `https://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherinfo?.main?.temp} °C` ;

    humidity.innerText = `${weatherinfo?.main?.humidity}%`;

    windspeed.innerText = `${weatherinfo?.wind?.speed}m/s`;

    cloud.innerText = `${weatherinfo?.clouds?.all}%` ;
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("no geolocation support available");
    }
}

function showposition(position){

    const usercoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,

    }

    console.log(usercoordinates);

    sessionStorage.setItem ("user-coordinates", JSON.stringify(usercoordinates));
    fetchuserweatherinfo(usercoordinates);

}
const grantacessbtn = document.querySelector("[data-grant-acess]");



grantacessbtn.addEventListener("click",getlocation);

const searchinput = document.querySelector("[data-searchinput]");

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname =searchinput.value;


    if(cityname ==="")
        return;

    else 
    fetchsearchweatherinfo(cityname);

})

async function fetchsearchweatherinfo(city){

    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantacess.classList.remove("active");


    try{

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await res.json();

        // console.log(data);

        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");



        renderweatherinfo(data);

    }

    catch(err){
        //
    }



}