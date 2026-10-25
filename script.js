/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let pointerX = window.innerWidth/2; //the current pointer position
let pointerY = window.innerHeight/2;
let speed =0;                  //pinter speed(pixels/second)-calulated across events
let lastX= pointerX,lastY =pointerY;         // pointer position at the previous event
let lastTime= 0;                //time of previous event
let toneStarted = false;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
const dot = createShape();

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
   // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  dot.setPositionPixels(pointerX - dot.width / 2, pointerY - dot.height / 2); //keep the shape's center on the pointer
  const hue = Math.min(speed/ 10, 360);  //speed to colour(0 red, 120 green, 24 0blue)
  dot.setColour(hue, 100, 50);
  console.log("speed:", speed.toFixed (0));

  //sound: speed changes pitch
  if (speed > 100){          //only make sound when actually moving
  const hz = 200 + speed / 10; // speed changes to frequency(Hz)
  synth.triggerAttackRelease(Tone.Frequency(hz, "hz"), "16n"); //play a short sound using the frequency directly
  }
  // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  if (!toneStarted){
  Tone.start(); // browsers only allow sound after the player has pressed something
  toneStarted = true;
}
  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

 function pointerMove(event){
  const currentTime =performance.now();  //current time(milliseconds)
  if (lastTime > 0){      //the first event has no "previous" event, so skip it
    const secondsSinceLastMove = (currentTime - lastTime)/1000;    //seconds since the last event
    const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);   //distance moved in pixels
    speed = distance/secondsSinceLastMove;      //speed=distance ÷ time
  }
  pointerX = event.clientX;
  pointerY = event.clientY;
  lastX = event.clientX;
  lastY = event.clientY;
  lastTime = currentTime;
 }

 function pointerUp(){
  speed = 0;    //release the mouse button to reset the speed
 }
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  function loop(){
  update(); // start the update loop
  use(); // start the use loop
}
setInterval(loop, 100)
  // Example: a shape near the middle of the window. Replace it with your own.

//own
 window.addEventListener("pointermove", pointerMove);  //add the pointermove event listener
  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointerleave", pointerUp);
}

setup(); // Always remember to call setup()!
