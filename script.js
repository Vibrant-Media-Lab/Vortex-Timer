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

var timerInfo;    // dictionary containing timer defaults in seconds
var currentTimes; // dictionary containing the current times of the timers in seconds
var timers;       // dictionary of timer variables for startTimer() and stopTimer()

var isPaused;     // array of booleans (true for paused, false for not paused)
var isShown;      // array of booleans (true for shown timer, false for hidden)

/**
 * Starts counting down the timer
 * 
 * @param {number} num the timer number
 */
function startTimer(num) {
    
    // Don't do anything if there is a timer already running
    if (isPaused.includes(false))
      return;
  
    isPaused[num] = false;
  
    var duration = currentTimes['timer' + num];
  
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
         
        start_pauseTimer(num); // Pause timer
        nextTimer(num); // Move on to next timer
      }
    }, 1000);
}

/**
 * Starts and stops counting down the timer
 *
 * @param {number} num The number of the timer
 */
function start_pauseTimer(num){
  
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
    start_pauseTimer(num);
  
  // get default hours, minutes, and seconds
  var sec = timerInfo['timer' + num];
  
  // reset current time of timer to the default 
  currentTimes['timer'+num] = sec;
  
  document.getElementById("timer" + num).remove();  
  createTimer(num, sec, true);
}

/**
 * Move on to next timer
 * 
 * @param {number} num The number of the timer
 */
function nextTimer(num){
  if (isPaused[num] == false)
    start_pauseTimer(num);
  
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
  var nextTimer = isShown.indexOf(true, num+1); // Get next shown timer
  if (!isPaused.includes(false) && document.getElementById("roundComplete" + (nextTimer)).style.display == "none")
    document.getElementById("time" + (nextTimer)).style.color = "red";
}

/**
 * Creates new timers once using form info
 */
function handleSubmit(){
  event.preventDefault();

  

  document.getElementById("all-timers").innerHTML = ""; // Clear any current timers
  
  for (var i = 1; i <= NUM_OF_TIMERS; i++){
    
    var timerName = "timer" + i;
    var sec = document.getElementById("sec" + i).value;
    
    // Clear input fields
    document.getElementById("sec" + i).value = '';
    
    // If input is empty, default timer display is 0
    if (sec == "")
      sec = 0;
        
    // Turn str to int
    sec = parseInt(sec);

    // Show error message if negative number is inputted
    if (sec < 0) {
      document.getElementById("error").style.display = "unset";
      return;
    } else {
      document.getElementById("error").style.display = "none";
    }

    // Add timer info to dictionary
    timerInfo[timerName] = sec;

    // Add results of checkboxes to isShown
    isShown[i] = document.getElementById("cb"+i).checked;
        
    createTimer(i, sec, false);
  }

  // Hide form, show gear and timers
  document.getElementById("form").style.display = 'none';
  document.getElementById("gear_icon").style.display = 'unset';
  document.getElementById("all-timers").style.display = 'unset';
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
function createTimer(num, s, insert) {

  // Divide seconds into hours, minutes, and seconds
  var h, m;
  h = Math.floor(s / 3600);
  m = s - (3600*h);
  m = Math.floor(m / 60);
  s = s % 60;
  
  // set up default if needed
  if (h == 0 && m == 0 && s == 0) {
    if (num < DEFAULT_TIME.length) {
      h = Math.floor(DEFAULT_TIME[num] / 3600);
      m = DEFAULT_TIME[num] - (3600*h);
      m = Math.floor(m / 60);
      s = DEFAULT_TIME[num] % 60;
    } else {
      h = 0;
      m = 0;
      s = 0;
    }
  }
  
  // Must have -1 to start counting down immediately after button press
  currentTimes["timer" + num] = s - 1;
  
  // Create div to hold all timer parts
  const div = document.createElement("div");
  div.setAttribute("class", "column");
  div.setAttribute("id", "timer" + num);
  
  // Add new timer at the end or at a certain location depending on insert boolean
  if (insert == false || num == NUM_OF_TIMERS)
    document.getElementById("all-timers").appendChild(div);
  else {
    var allTimers = document.getElementById("all-timers");
    allTimers.insertBefore(div, allTimers.childNodes[num-1]);
  }

  // Hide timers that are not checked, show timers that are checked
  if (isShown[num] == false)
    document.getElementById("timer" + num).style.display = "none";
  else
    document.getElementById("timer" + num).style.display = "unset";

  // Set up labels before timers
  const labeldiv = document.createElement("div");
  labeldiv.setAttribute("class", "label_name");
  labeldiv.innerHTML = LABELS[num];
  document.getElementById("timer" + num).appendChild(labeldiv);

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
  
  // Start/Pause button
  const pauseBtn = document.createElement("button");
  pauseBtn.setAttribute("class", "start_pause");
  pauseBtn.innerHTML = "Start/Pause";
  pauseBtn.onclick = function() { start_pauseTimer(num) };
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

    // div section for all inputs
    const inputs = document.createElement("div");
    inputs.setAttribute('id', 'input' + i);
    inputs.setAttribute('class', 'inputs');
    document.getElementById('form').appendChild(inputs);
    
    // create timer text before input fields
    const timerText = document.createElement("label");
    timerText.setAttribute("class", "form_labels");

    if (i < LABELS.length){
      timerText.innerHTML = LABELS[i] + ':';
    }

    document.getElementById('input' + i).appendChild(timerText);
    
    // create seconds input
    const secInput = document.createElement("input");
    secInput.setAttribute("type", "number");
    secInput.setAttribute("id", "sec"+i);
    secInput.setAttribute("placeholder", s);
    document.getElementById('input' + i).appendChild(secInput);
    const secText = document.createElement("label");
    secText.setAttribute("class", "secText");
    secText.innerHTML = " sec " + "<br>";
    document.getElementById('input' + i).appendChild(secText);

    // Create checkbox div
    const checkboxDiv = document.createElement("label");
    checkboxDiv.setAttribute("class", "switch");
    checkboxDiv.setAttribute("id", "checkbox"+i);
    document.getElementById('input' + i).appendChild(checkboxDiv);

    // Create checkbox itself
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "cb"+i);
    checkbox.setAttribute("checked", ""); // Start with box checked
    document.getElementById("checkbox"+i).appendChild(checkbox);

    const span = document.createElement("span");
    span.setAttribute("class", "slider round");
    document.getElementById("checkbox" + i).appendChild(span);
  }
  
  // create submit button
  const submitBtn = document.createElement("button");
  submitBtn.setAttribute("id", "submit");
  submitBtn.onclick = function() { handleSubmit()};
  submitBtn.innerHTML = "Create Timers";
  document.getElementById("form").appendChild(submitBtn);
  
  // create error message
  const error = document.createElement("p");
  error.setAttribute("id", "error");
  error.innerHTML = "<br>Error. Cannot have negative seconds.";
  error.style.display = "none";
  document.getElementById("form").appendChild(error);
}

/**
 * Initalize variables and create form upon window load
 */
window.onload = function () {
    timerInfo = {};
    currentTimes = {};
    isPaused = [true] // index 0 is a filler; there is no timer 0
    isShown = [true] // index 0 is a filler; there is no timer 0
    timers = {};
    for (var i = 1; i <= NUM_OF_TIMERS; i++){
      timers["timer"+i] = null;
      isPaused.push(true);
    }
  
    createForm();
    handleSubmit(); // Start on timer page
};
