//this App is build with React-Redux
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

//import hooks
import { useState, useEffect, useRef } from 'react';

//import redux and react-redux
import { createSlice } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { Provider } from 'react-redux'

//link css
import "./index.scss"

//import jquery
import "./jquery.js";

//import bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.css"

//import audio
//-- bank_on --
import Cev_H2 from "./audio/bank_on/Cev_H2.mp3";
import Dsc_Oh from "./audio/bank_on/Dsc_Oh.mp3";
import Heater_1 from "./audio/bank_on/Heater-1.mp3";
import Heater_2 from "./audio/bank_on/Heater-2.mp3";
import Heater_3 from "./audio/bank_on/Heater-3.mp3";
import Heater_4_1 from "./audio/bank_on/Heater-4_1.mp3";
import Heater_6 from "./audio/bank_on/Heater-6.mp3";
import Kick_n_Hat from "./audio/bank_on/Kick_n_Hat.mp3";
import RP4_KICK_1 from "./audio/bank_on/RP4_KICK_1.mp3";
//-- bank_off --
import bomb_explotion from "./audio/bank_off/bomb_explotion.wav";
import bomb_impact from "./audio/bank_off/bomb_impact.wav";
import drum_bass from "./audio/bank_off/drum_bass.wav";
import game_explotion from "./audio/bank_off/game_explotion.wav";
import insect_buzzing from "./audio/bank_off/insect_buzzing.wav";
import insect_laught from "./audio/bank_off/insect_laught.wav";
import insect_scape from "./audio/bank_off/insect_scape.wav";
import orchesteral_violine from "./audio/bank_off/orchesteral_violine.wav";
import trailer_horn from "./audio/bank_off/trailer_horn.wav";

//-- React App --
//power is responsible for updating and displaying power state status and nothing else
function Power({setPower}) {
  //it is the powerswitch of the drum-machine
  function handleClick() {
    setPower(powerReducer());
  }

  return(
    <div>
      <p>Power</p>
      <button id="powerSwitch" onClick={handleClick}>
        <div id="pswitch"></div>
      </button>
    </div>
  );
}

//bank is responsible for updating bank "on" or "off" status and nothing else
function Bank({setBank}) {
  //contains bank switch to change the music composition/library for the pads
  function handleClick() {
    setBank(bankReducer());
  }

  return(
    <div>
      <p>Bank</p>
      <button id="bankSwitch" onClick={handleClick}>
        <div id="bswitch"></div>
      </button>
    </div>
  );
}

//drumpads is responsible for selecting sound from database playin it and displaying based and bank and power status. it works if power is on or else do not update display
function Drumpads({bank, power, dispatch, volume}) {
  //renders pads for the drum and rings the associated audios
  const dataBase = [
    {audioBankon: "Cev_H2", audioBankoff: "bomb_explotion", key: "Q", src_on: Cev_H2, src_off: bomb_explotion, keycode: 81},
    {audioBankon: "Dsc_Oh", audioBankoff: "bomb_impact", key: "W", src_on: Dsc_Oh, src_off: bomb_impact, keycode: 87},
    {audioBankon: "Heater_1", audioBankoff: "drum_bass", key: "E", src_on: Heater_1, src_off: drum_bass, keycode: 69},
    {audioBankon: "Heater_2", audioBankoff: "game_explotion", key: "A", src_on: Heater_2, src_off: game_explotion, keycode: 65},
    {audioBankon: "Heater_3", audioBankoff: "insect_buzzing", key: "S", src_on: Heater_3, src_off: insect_buzzing, keycode: 83},
    {audioBankon: "Heater_4_1", audioBankoff: "insect_laught", key: "D", src_on: Heater_4_1, src_off: insect_laught, keycode: 68},
    {audioBankon: "Heater_6", audioBankoff: "insect_scape", key: "Z", src_on: Heater_6, src_off: insect_scape, keycode: 90},
    {audioBankon: "Kick_n_Hat", audioBankoff: "orchesteral_violine", key: "X", src_on: Kick_n_Hat, src_off: orchesteral_violine, keycode: 88},
    {audioBankon: "RP4_KICK_1", audioBankoff: "trailer_horn", key: "C", src_on: RP4_KICK_1, src_off: trailer_horn, keycode: 67}
  ];

  let album = `audioBank${bank}`; //based on bank state album is selected dynamically
  //map method to generate 9 clickable drum-pads, saves me ton of code lol.
  const drumPads = dataBase.map((obj) => {
    //template litral ${} does not add inverted commas. they are add once at the extreame of entire string
    return(
      <button key={obj[album]+"_"+obj.key} className="drum-pad" id={obj[album]} onClick={() => handleClick(obj.key, obj[album])}>
        <audio src={obj[`src_${bank}`]} className="clip" id={obj.key}></audio>
        {/*(obj.key).toUpperCase()*/}
        {obj.key}
      </button>
    );
  });

  function handleClick(key, album) {
    if(power === "on") {
      dispatch(displayReducer(album));
      dispatch(audioIdReducer(key));
      document.getElementById(key).currentTime = 0;
      document.getElementById(key).volume = volume/100;
      document.getElementById(key).play();
    }
  }

  //key binding feature drumpads--
  function keyBinding() {
    for (let i=0; i<dataBase.length; i++) {
      document.addEventListener('keydown', (e) => {
        if (e.keyCode == dataBase[i].keycode) {
          //handleClick(dataBase[i].key, dataBase[i][album]); [deprecated method with anamolies]
          document.getElementById(dataBase[i][album]).click();
          document.getElementById(dataBase[i][album]).classList.remove("padOff");
          document.getElementById(dataBase[i][album]).classList.add("padOn");
        }
      });
    }
  }
  if(power == 'on') {
    keyBinding();
  }

  return (
    <div id="pad">{drumPads}</div>
  );
}

//display just gets the information from other components and displays the states and nothing else. used as shared component
function Display({display}) {
  return(
    <div id="display">{display}</div>
  );
}

//volume displays the volume range ui and updates volume state and conditionally displays volume inside display apart from obivioulsly accessed by drumpads.
function Volume({volume, dispatch}) {
  function handleChange(value) {
    dispatch(volumeReducer(value));
  }

  function wipeDisplay() {
    setTimeout(() => {
      return dispatch(wipeDisplayReducer())
    }, 1000);
  }

  return(
    <div id="volume">
      <input type="range" min="0" max="100" value={volume} onChange={(e) => handleChange(e.target.value)} onMouseUp={wipeDisplay} id="slider"></input>
    </div>
  );
}

//parent app that is responsible for rendering the entire app
function App() {
  //--deprecated usestate react hooks
  // const [power, setPower] = useState("on");
  // const [bank, setBank] = useState("on");
  // const [display, setDisplay] = useState("Power_On");
  // const [volume, setVolume] = useState("100");

  //mapStateToProps and mapDispatchToProps method equivivalent
  const drumState = useSelector((state) => state.drumMachine);
  const dispatch = useDispatch();

  return(
    <div id="background">
      <div id="drum-machine">
        <Drumpads bank={drumState.bank} power={drumState.power} dispatch={dispatch} volume={drumState.volume} />
        <div id="controlPanel">
          <Power setPower={dispatch} />
          <Display display={drumState.display} />
          <Volume volume={drumState.volume} dispatch={dispatch} />
          <Bank setBank={dispatch} />
        </div>
      </div>
      <p>by <a href="https://github.com/aniketgunjekar" target="blank">Aniket</a></p>
    </div>
  );
}

// -- redux --
const initialState = {
  power: "on",
  bank: "on",
  display: "--Welcome--",
  volume: "100",
  audioId: "q"
}

const drumMachineSlice = createSlice({
  name: 'drumMachine',
  initialState,
  reducers: {
    powerReducer: (state) => {
      if(state.power == "on") {
        document.getElementById(state.audioId).pause();
        state.display = "Power_Off";
        state.power = "off";
      } else if(state.power == "off") {
        state.display = "Power_On";
        state.power = "on";
      }
    },
    bankReducer: (state) => {
      if(state.bank == "on") {
        state.bank = "off";
      } else if(state.bank == "off") {
        state.bank = "on";
      }
    },
    displayReducer: (state, action) => {
      state.display = action.payload;
    },
    volumeReducer: (state, action) => {
      if(state.power == "on") {
        state.volume = action.payload;
        state.display = `Volume:${state.volume}`;
      };
    },
    wipeDisplayReducer: (state) => {
      if((/volume:\d+/i).test(state.display)) {
        state.display = "--";
      }
    },
    audioIdReducer: (state, action) => {
      state.audioId = action.payload;
    }
  }
});

//atomatically generating actionCreators and combine reducer from slice
const {powerReducer, bankReducer, displayReducer, volumeReducer, wipeDisplayReducer, audioIdReducer} = drumMachineSlice.actions;
const drumMachineReducer = drumMachineSlice.reducer;

//store.createStore equivivalent
const store = configureStore({
  reducer: {
    drumMachine: drumMachineReducer
  }
});

//rendering and Provider api
const apiProvider = (
  <Provider store={store}>
    <App />
  </Provider>
);
const output = ReactDOM.createRoot(document.getElementById("page"));
output.render(apiProvider);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
