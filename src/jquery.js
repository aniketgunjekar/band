//import $
import $ from "jquery";

let cycleState = {//equals to initial power-state
    pState : "on",
    bState : "on",
    dState : "on",
    padState: "on"
}

$( document ).ready(function() {
    //$("#slider").addClass("form-range");
    document.getElementById('slider').classList.add('form-range');
    document.getElementById('display').classList.add('displayOn');
    document.getElementById('pswitch').classList.add('switchOn');
    document.getElementById('bswitch').classList.add('switchOn');
    document.getElementById('pad').classList.add('padOn');
    //onclick event calls
    // document.getElementById('powerSwitch').onclick = () => handlePbClick("display", "displayOn", "displayOff");
    // document.getElementById('powerSwitch').onclick = () => handlePbClick("pswitch", "switchOn", "switchOff");
    document.getElementById('powerSwitch').addEventListener('click', () => handlePbClick("dState", "display", "displayOn", "displayOff"));
    document.getElementById('powerSwitch').addEventListener('click', () => handlePbClick("pState", "pswitch", "switchOn", "switchOff"));
    document.getElementById('powerSwitch').addEventListener('click', () => handlePbClick("padState", "pad", "padOn", "padOff"));
    document.getElementById('bankSwitch').onclick = () => handlePbClick("bState", "bswitch", "switchOn", "switchOff");
});

function handlePbClick(status, id, on, off) {
    if(cycleState[status] == "on") {
        cycleState[status] = "off";
        document.getElementById(id).classList.remove(on);
        document.getElementById(id).classList.add(off);
    } else {
        cycleState[status] = "on";
        document.getElementById(id).classList.remove(off);
        document.getElementById(id).classList.add(on);
    }
}
