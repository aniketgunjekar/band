//this App is build with react only
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

//import hooks
import { useState } from 'react';
import { useEffect } from 'react';

//import jquery
import $ from "jquery";
import "./jquery.js";

//link css
import "./index.scss"

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

//rendering api
const output = ReactDOM.createRoot(document.getElementById("page"));
output.render(<App />);

//-- React App --
function Power({power, setPower, setDisplay}) {
  //it is the powerswitch of the drum-machine
  function handleClick() {
    if(power == "on") {
      setDisplay("Power_Off");
      setPower("off");
      return;
    } else if(power == "off") {
      setPower("on");
      setDisplay("Power_On");
      return;
    }
  }

  return(
    <div id="powerSocket">
      <button id="powerSwitch" onClick={handleClick}></button>
    </div>
  );
}

function Bank({bank, setBank}) {
  //contains bank switch to change the music composition/library for the pads
  function handleClick() {
    if(bank == "on") {
      setBank("off");
      return;
    } else if(bank == "off") {
      setBank("on");
      return;
    }
  }

  return(
    <div id="bankSocket">
      <button id="bankSwitch" onClick={handleClick}></button>
    </div>
  );
}

function Drumpads({bank, power, setDisplay, volume}) {
  //renders pads for the drum and rings the associated audios
  const dataBase = [
    {audioBankon: "Cev_H2", audioBankoff: "bomb_explotion", key: "Q", src_on: Cev_H2, src_off: bomb_explotion},
    {audioBankon: "Dsc_Oh", audioBankoff: "bomb_impact", key: "W", src_on: Dsc_Oh, src_off: bomb_impact},
    {audioBankon: "Heater_1", audioBankoff: "drum_bass", key: "E", src_on: Heater_1, src_off: drum_bass},
    {audioBankon: "Heater_2", audioBankoff: "game_explotion", key: "A", src_on: Heater_2, src_off: game_explotion},
    {audioBankon: "Heater_3", audioBankoff: "insect_buzzing", key: "S", src_on: Heater_3, src_off: insect_buzzing},
    {audioBankon: "Heater_4_1", audioBankoff: "insect_laught", key: "D", src_on: Heater_4_1, src_off: insect_laught},
    {audioBankon: "Heater_6", audioBankoff: "insect_scape", key: "Z", src_on: Heater_6, src_off: insect_scape},
    {audioBankon: "Kick_n_Hat", audioBankoff: "orchesteral_violine", key: "X", src_on: Kick_n_Hat, src_off: orchesteral_violine},
    {audioBankon: "RP4_KICK_1", audioBankoff: "trailer_horn", key: "C", src_on: RP4_KICK_1, src_off: trailer_horn}
  ];

  let album = `audioBank${bank}`; //based on bank state album is selected dynamically
  //map method to generate 9 clickable drum-pads, saves me ton of code lol.
  const drumPads = dataBase.map((obj) => {
    //template litral ${} does not add inverted commas. they are add once at the extreame of entire string
    return(
      <button key={obj[album]+"_"+obj.key} className="drum-pad" id={obj[album]} onClick={() => handleClick(obj.key, obj[album])}>
        <audio src={obj[`src_${bank}`]} className="clip" id={obj.key}></audio>
        {obj.key}
      </button>
    );
  });

  function handleClick(key, album) {
    if(power == "on") {
      setDisplay(album);
      document.getElementById(key).currentTime = 0;
      document.getElementById(key).volume = volume/100;
      document.getElementById(key).play();
    } else {
      document.getElementById(key).pause();
    }
  }

  return (
    <div id="pad">{drumPads}</div>
  );
}

function Display({display}) {
  return(
    <div id="display">{display}</div>
  );
}

function Volume({volume, setVolume, display, setDisplay, power}) {
  function handleChange(value) {
    if(power == "on") {
      setVolume(value);
      setDisplay(`Volume:${value}`);
    };
  }

  function wipeDisplay() {
    if((/volume:\d+/i).test(display)) {
      setTimeout(() => {
        setDisplay("");
      }, 200);
    }
  }

  return(
    <div id="volume">
      <input type="range" min="0" max="100" value={volume} onChange={(e) => handleChange(e.target.value)} onMouseOut={wipeDisplay} id="slider"></input>
    </div>
  );
}

//parent app that is responsible for rendering the entire app
function App() {
  const [power, setPower] = useState("on");
  const [bank, setBank] = useState("on");
  const [display, setDisplay] = useState("Power_On");
  const [volume, setVolume] = useState("100");

  return(
    <div id="drum-machine">
      <Drumpads bank={bank} power={power} setDisplay={setDisplay} volume={volume} />
      <div>
        <Power power={power} setPower={setPower} setDisplay={setDisplay} />
        <Display display={display} />
        <Volume volume={volume} setVolume={setVolume} display={display} setDisplay={setDisplay} power={power} />
        <Bank bank={bank} setBank={setBank} />
      </div>
    </div>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
