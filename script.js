const NUM_OF_TIMERS = 5;  // total number of timers

// Array of alarm ids. Timer n uses the id from ALARMS[n].
// Index 0 is not used. If no id is provided, the alarm named default plays
// MAKE SURE THAT IDS MATCH WITH THE IDS IN THE HTML FILE!
const ALARMS = ["", "default", "alarm2", "default", "default"];

// Array of labels for input form. Works similarly to ALARMS.
// If no label is provided, the label is blank
const LABELS = ["", "Planning/Minor Actions", "Movement, Rank 1", "Movement, Rank 2", "Movement, Rank 3", "Choose Major Action"];

// Array of default times. Works similarly to ALARMS and LABELS.
// If no time is provided, the default is 0
const DEFAULT_TIME = [0, 15, 15, 15, 15, 8];

var timerInfo;    // dictionary containing timer defaults 
                  // {timerName: {h: hours (int), m: minutes (int), s: seconds (int)}}

var currentTimes; // dictionary containing the current times of the timers
                  // {timerName: time (in seconds)}

var isPaused;     // array of booleans (true for paused, false for not paused)

var timers; // dictionary of timer variables for startTimer() and stopTimer()
            // {timerName: timer_variable}

/**
 * Starts counting down the timer
 * 
 * @param {number} num the timer number
 */
function startTimer(num) {
    
    // Don't do anything if there is a timer already running
    if (isPaused.includes(false))
      return
  
    isPaused[num] = false;
  
    var duration = currentTimes['timer' + num];
    
    // Do nothing if time is 0
    if (duration == 0)
      return;
  
    // Highlight current timer, revert others back to original state
    for (var i = 1; i <= NUM_OF_TIMERS; i++){
        if (i != num) {
            document.getElementById('time'+i).style.color = "black";
        } else {
            document.getElementById('time'+i).style.color = "red";
        }
    }
  
    // Display timer counting down
    var display = document.querySelector('#time' + num);
    var timer = duration, hours, minutes, seconds;
    timers['timer'+num] = setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt(timer - (hours * 3600))
        minutes = parseInt(minutes / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerHTML = hours + ":" + minutes + ":" + seconds + "<br>";
        currentTimes['timer' + num] -= 1;  // decrement current time

      // Timer reached 0
      if (--timer < 0) {
            
        // play alarm sound using id from ALARMS[num]
        if (num < ALARMS.length && ALARMS[num] != ""){
          var x = document.getElementById(ALARMS[num]); 
          x.play();
        } else {  // play default alarm if id not specified in ALARMS
          var x = document.getElementById("default");
          x.play();
        }
         
        pauseTimer(num);
        nextTimer(num);
      }
    }, 1000);
}

/**
 * Stops counting down the timer
 *
 * @param {number} num The number of the timer
 */
function pauseTimer(num){
  
  // stop if timer is not already running
  if (isPaused[num] == false){
    clearInterval(timers['timer'+num]);
    isPaused[num] = true;
  }
  // start again if timer is already stopped
  else
    startTimer(num);
}

/**
 * Resets the timer
 *
 * @param {number} num The number of the timer 
 */
function resetTimer(num){
  if (isPaused[num] == false)
    pauseTimer(num);
  
  // get default hours, minutes, and seconds
  var hr = timerInfo['timer' + num]['h'];
  var min = timerInfo['timer' + num]['m'];
  var sec = timerInfo['timer' + num]['s'];
  
  // reset current time of timer to the default 
  currentTimes['timer'+num] = (3600 * hr) + (60 * min) + sec - 1;
  
  document.getElementById("timer" + num).remove();  
  createTimer(num, hr, min, sec, true);
}

/**
 * Move on to next timer
 * 
 * @param {number} num The number of the timer
 */
function nextTimer(num){
  if (isPaused[num] == false)
    pauseTimer(num);
  
  // Replace buttons with round complete message
  document.getElementById("roundComplete" + num).style.display = 'unset'; 
  document.getElementById("btns" + num).style.display = "none";
          
  // return old timer to normal
  document.getElementById('time' + num).style.color = 'black';
  
  // start at top again if highlighing reaches bottom
  if (num >= NUM_OF_TIMERS){
    num = 0;
              
    // Return buttons, hide round complete messages
    for (var i = 1; i <= NUM_OF_TIMERS; i++){
      resetTimer(i);
      document.getElementById("roundComplete" + i).style.display = 'none';
      document.getElementById("btns" + i).style.display = "unset";
    }
  }
  
  // highlight next timer once last timer is done and if next timer is not already complete
  if (!isPaused.includes(false) && document.getElementById("roundComplete" + (num+1)).style.display == "none")
    document.getElementById("time" + (num+1)).style.color = "red";
}

/**
 * Creates new timers once using form info
 */
function handleSubmit(){
  event.preventDefault();
  
  // Hide form, show gear and timers
  document.getElementById("form").style.display = 'none';
  document.getElementById("gear_icon").style.display = 'unset';
  document.getElementById("all-timers").style.display = 'unset';

  document.getElementById("all-timers").innerHTML = ""; // Clear any current timers
  
  for (var i = 1; i <= NUM_OF_TIMERS; i++){
    
    var timerName = "timer" + i;
    var hr = document.getElementById("hour" + i).value;
    var min = document.getElementById("min" + i).value;
    var sec = document.getElementById("sec" + i).value;
    
    // Clear input fields
    document.getElementById("hour" + i).value = '';
    document.getElementById("min" + i).value = '';
    document.getElementById("sec" + i).value = '';
    
    // If input is empty, default timer display is 0
    if (hr == "")
      hr = 0;
    if (min == "")        
      min = 0;
    if (sec == "")
      sec = 0;
        
    // Turn str to int
    hr = parseInt(hr);
    min = parseInt(min);
    sec = parseInt(sec);

    
    // Add timer info to dictionaries
    timerInfo[timerName] = {
      "h": hr,
      "m": min,
      "s": sec
    }
        
    createTimer(i, hr, min, sec, false);
  }
}

/**
 * Creates a timer
 * 
 * @param {number} num the number of the timer
 * @param {number} h the starting hour(s)
 * @param {number} m the starting minute(s)
 * @param {number} s the starting second(s)
 * @param {boolean} insert true if the new timer should be inserted at a certain location
 *                         false if the new timer should be inserted at the end
 */
function createTimer(num, h, m, s, insert) {
  
  // set up default
  if (num < DEFAULT_TIME.length) {
    if (h == 0 && m == 0 && s == 0) {
      h = Math.floor(DEFAULT_TIME[num] / 3600);
      m = DEFAULT_TIME[num] - (3600*h);
      m = Math.floor(m / 60);
      s = DEFAULT_TIME[num] % 60;
    }
  } else {
    h = 0;
    m = 0;
    s = 0;
  }

  
  var timeInSecs = (h * 3600) + (m * 60) + s - 1; // get total seconds for startTimer()
  currentTimes["timer" + num] = timeInSecs;
  
  // Create div to hold all timer parts
  const div = document.createElement("div");
  div.setAttribute("class", "timer");
  div.setAttribute("id", "timer" + num);
  
  if (insert == false || num == NUM_OF_TIMERS)
    document.getElementById("all-timers").appendChild(div);
  else {
    var allTimers = document.getElementById("all-timers");
    allTimers.insertBefore(div, allTimers.childNodes[num-1]);
  }

  // Set up starting time
  const span = document.createElement("span");
  span.setAttribute("class", "time");
  span.setAttribute("id", "time" + num);
  
    // Format to two digits
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
  
  span.innerHTML = h + ":" + m + ":" + s + "<br>";
  document.getElementById("timer" + num).appendChild(span);
  
  // div containing buttons
  const btnDiv = document.createElement("div");
  btnDiv.setAttribute("class", "btns");
  btnDiv.setAttribute("id", "btns" + num);
  document.getElementById("timer" + num).appendChild(btnDiv);
  document.getElementById("btns" + num).style.display = 'unset';
  
  // Start button
  const startBtn = document.createElement("button");
  startBtn.setAttribute("class", "start");
  startBtn.innerHTML = "Start";
  startBtn.onclick = function() { 
    startTimer(num) ; 
  };
  document.getElementById("btns" + num).appendChild(startBtn);
  
  // Pause button
  const pauseBtn = document.createElement("button");
  pauseBtn.setAttribute("class", "pause");
  pauseBtn.innerHTML = "Pause";
  pauseBtn.onclick = function() { pauseTimer(num) };
  document.getElementById("btns" + num).appendChild(pauseBtn);
  
  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.setAttribute("class", "reset");
  resetBtn.innerHTML = "Reset";
  resetBtn.onclick = function() { resetTimer(num) };
  document.getElementById("btns" + num).appendChild(resetBtn);
  
  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.setAttribute("class", "next");
  nextBtn.innerHTML = "Next";
  nextBtn.onclick = function() { nextTimer(num) };
  document.getElementById("btns" + num).appendChild(nextBtn);
  
  // Round Complete message - start hidden
  const roundComplete = document.createElement("p");
  roundComplete.setAttribute("id", "roundComplete" + num);
  roundComplete.setAttribute("class", "roundComplete");
  roundComplete.innerHTML = "Round Complete! ✅";
  document.getElementById("timer" + num).appendChild(roundComplete);
  document.getElementById("roundComplete" + num).style.display = 'none';
}

/**
 * Turn on form, hide gear and timers
 */
function turnOnForm(){
  document.getElementById("form").style.display = 'unset';
  document.getElementById("all-timers").style.display = 'none';
  document.getElementById("gear_icon").style.display = 'none';
}

/**
 * Create input fields for timers and submit button
 */
function createForm(){
  var h, m, s;
  
  for (var i = 1; i <= NUM_OF_TIMERS; i++){

      // divide default time into h, m, and s
      if (i < DEFAULT_TIME.length) {
        h = Math.floor(DEFAULT_TIME[i] / 3600);
        m = DEFAULT_TIME[i] - (3600*h);
        m = Math.floor(m / 60);
        s = DEFAULT_TIME[i] % 60;
      } else {
        h = 0;
        m = 0;
        s = 0;
      }
      
      // Format to two digits
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
    
    // create timer text before input fields
    const timerText = document.createElement("label");

    if (i < LABELS.length){
      timerText.innerHTML = LABELS[i];
    }

    document.getElementById('form').appendChild(timerText);
    
    // create hour input
    const hourInput = document.createElement("input");
    hourInput.setAttribute("type", "number");
    hourInput.setAttribute("id", "hour"+i);
    hourInput.setAttribute("min", "0");
    hourInput.setAttribute("placeholder", h);
    document.getElementById('form').appendChild(hourInput);
    const hourText = document.createElement("label");
    hourText.innerHTML = "  hr ";
    document.getElementById('form').appendChild(hourText);
    
    // create minutes input
    const minInput = document.createElement("input");
    minInput.setAttribute("type", "number");
    minInput.setAttribute("id", "min"+i);
    minInput.setAttribute("min", "0");
    minInput.setAttribute("max", "59");
    minInput.setAttribute("placeholder", m);
    document.getElementById('form').appendChild(minInput);
    const minText = document.createElement("label");
    minText.innerHTML = " min ";
    document.getElementById('form').appendChild(minText);
    
    // create seconds input
    const secInput = document.createElement("input");
    secInput.setAttribute("type", "number");
    secInput.setAttribute("id", "sec"+i);
    secInput.setAttribute("min", "0");
    secInput.setAttribute("max", "59");
    secInput.setAttribute("placeholder", s);
    document.getElementById('form').appendChild(secInput);
    const secText = document.createElement("label");
    secText.innerHTML = " sec " + "<br>";
    document.getElementById('form').appendChild(secText);
  }
  
  // create submit button
  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("id", "submit");
  submitBtn.onclick = function() { handleSubmit()};
  submitBtn.innerHTML = "Create Timers";
  document.getElementById("form").appendChild(submitBtn);
  
}

/**
 * Initalize variables and create form upon window load
 */
window.onload = function () {
    timerInfo = {};
    currentTimes = {};
    isPaused = [true] // index 0 is a filler; there is no timer 0
    timers = {};
    for (var i = 1; i <= NUM_OF_TIMERS; i++){
      timers["timer"+i] = null;
      isPaused.push(true);
    }
  
    createForm();
};
