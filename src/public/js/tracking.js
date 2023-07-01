//Definir variable global
const globalParameters = {
  'app_name': 'Node JS',
    'screen_name' : document.title,
    'enviroment': 'dev'
};

//Enviar evento page_view cuando la página se carga
window.addEventListener("load", (event) => {
  gtag('event', 'page_view', {
    ...globalParameters
  });
});

//Event Listerner Header Elements
const headerNavButtons = document.querySelectorAll(".w3-bar-item.w3-button");
headerNavButtons.forEach(element =>
    element.addEventListener('click',()=>{
        gtag('event', 'Button_Clicked', {
            'link_text': element.innerText,
            ...globalParameters
          });
        //console.log(  "Elemento clickeado " + element)
    }))

//Función que cálcula el porcentaje de Scroll relativo al tamaño de la página
function currentScrollPercentage()
{
    return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
}

//Guardamos en una variable la posición del usuario en porcentaje. Initialment es 0
let lastKnownScrollPosition = 0;

//Definir variable  que define si un usuario ha alcanzado un porcentaje determinado
let threshold_25 = false;
let threshold_50 = false;
let threshold_75 = false;
let threshold_100 = false;

function doSomething(scrollPos) {
    console.log(`Se ha disparado el evento a ${lastKnownScrollPosition} %`);
    gtag('event', 'Screen_Scrolled', {
      'scroll_section_percentage:': lastKnownScrollPosition,
      ...globalParameters
    }); 
}

//Función que detetecta cada vez que un usuario realiza un scroll
document.addEventListener('scroll', (e) => {
  lastKnownScrollPosition = Math.round(currentScrollPercentage());
  //console.log(lastKnownScrollPosition)
  if (!threshold_25 && lastKnownScrollPosition === 25) {
    window.requestAnimationFrame(() => {
      doSomething(lastKnownScrollPosition);
      threshold_25 = true;
    });
  } if (!threshold_50 && lastKnownScrollPosition === 50) {
    window.requestAnimationFrame(() => {
      doSomething(lastKnownScrollPosition);
      threshold_50 = true;
    });
  } if (!threshold_75 && lastKnownScrollPosition === 75) {
    window.requestAnimationFrame(() => {
      doSomething(lastKnownScrollPosition);
      threshold_75 = true;
    });
  } if (!threshold_100 && lastKnownScrollPosition === 100) {
    window.requestAnimationFrame(() => {
      doSomething(lastKnownScrollPosition);
      threshold_100 = true;
    });
  } 
});


//Socket
const socket = io("http://localhost:3000")

//Evento para la autentificación de usuarios
socket.on('User Authenticated Successfully', (user_email, userId) =>{
  console.log('Usuario autenticado');
  gtag('event', 'User Authenticated Successfully', {
    'email:': user_email,
    'userId' : userId,
    ...globalParameters
  });
  alert("Usuario Autenticado Exitosamente");
})

//Evento para creación de usuarios
socket.on('User Registered Successfully', (user_email) =>{
  console.log('Usuario registrado');
  gtag('event', 'User Registered Successfully', {
    'email:': user_email,
    ...globalParameters
  });
  alert("Usuario Registrado Exitosamente");
})

//Evento para eliminación de usuarios
socket.on('User Deleted Successfully', (user_email) =>{
  console.log('Usuario eliminado');
  gtag('event', 'User Deleted Successfully', {
    'email:': user_email,
    ...globalParameters
  });
  alert("Usuario Eliminado Exitosamente");
})

/* Tracking para reproductor de video */
video.onplay = (event) => {
  console.log(event.type);
  gaTagVideos();
};

video.onpause = (event) => {
  console.log(event.type);
  gaTagVideos();
};

video.onplaying = (event) => {
  setTimeout(()=>{
  const timeStampPlaying = player.stats_.stateHistory_.open_.timestamp;
  const statePlayer = player.stats_.stateHistory_.open_.state;
  let nIntervId;
  if (!nIntervId) {
    nIntervId = setInterval(isPlaying,1000);}
  
  function isPlaying(){
  if(player.stats_.stateHistory_.open_.state ==='playing'){
    console.log('Se está reproduciendo el video');
    const d = new Date();
    let currentTime = d.getTime() / 1000;
    //console.log('CurrentTime :' + currentTime);
    //console.log('timeStampPlaying :' + timeStampPlaying);
    let deltaTiming = Math.round(Math.abs(currentTime - timeStampPlaying));
    //console.log('Diferencia entre es ' + deltaTiming);
    const divisorHeartbeat = 10;
    if((deltaTiming % divisorHeartbeat) == 0){
      //console.log('Hearbeat fire');
      let currentTimePosition = Math.round(player.video_.currentTime);
      gtag('event', 'Video', {
        'video_action:': 'Video Content Playing',
        'video_heartbeat_value': divisorHeartbeat,
        'video_playback_position': currentTimePosition,
        ...globalParameters
    })
    }
  }else{
    console.log('El video no se está reproduciendo');
    clearInterval(nIntervId);
    nIntervId = null;
  }}
  //const intervalID = setInterval(myCallback, 500, 'Parameter 1', 'Parameter 2');
},500)
};

function gaTagVideos(){gtag('event', 'Video', {
  'video_action:': event.type,
  ...globalParameters
});}

//Hearbeat Events
//Fire a event whenever the video get paused
video.onpause = (event) => {
  console.log('Video Paused Heartbeat')
  gaTagVideosHeartbeatPause();
};

function gaTagVideosHeartbeatPause(){
  setTimeout(()=>{
    let lastIndex = player.stats_.stateHistory_.closed_.length - 1;
    //console.log(lastIndex);
    if(player.stats_.stateHistory_.closed_[lastIndex].state === 'playing'){
      let duration = Math.round(player.stats_.stateHistory_.closed_[lastIndex].duration);
      let currentTimePosition = Math.round(player.video_.currentTime);
      gtag('event', 'Video', {
        'video_action:': 'Video Content Playing',
        'video_heartbeat_value': duration,
        'video_playback_position': currentTimePosition,
        ...globalParameters
    })
  }},1000)
}