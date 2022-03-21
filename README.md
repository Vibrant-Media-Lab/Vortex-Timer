# Vortex Timer

### To view the web app, follow this link:

[Visit Web App](https://jennzheng12315.github.io/Archipelago)

# About
Created with JavaScript, HTML, and CSS, this web app sets up a series of timers based on user inputs. Each timer has three buttons:
* _Start/Pause_: starts the timer if it is not running, stops the timer if it is running
* _Reset_: reverts the timer back to its original time (based on user input)
* _Next_: Ends the round and moves on to the next timer. If the last timer is reached, all timers reset.  

Clicking the gear icon on the right takes the user back to the input fields, where they can enter new starting times. 

## Modifications
To change the default time of a timer:
* In `const DEFAULT_TIME` at the top of `script.js`, change the default time at the index the timer is at to the time you want (**IN SECONDS!**). For example, if you want timer 1 to have a default of 10 seconds, change `DEFAULT_TIME[1]` from 15 to 10.

To change the label of a timer:
* In `const LABELS` at the top of `script.js`, change the label at the index the timer is at to the label you want. For example, if you want timer 1 to have a label of "Timer 1", change `LABELS[1]` from "Planning/Minor Actions" to "Timer 1".

To change the number of timers that are created:
* Set `const NUM_OF_TIMERS` at the top of `script.js` equal to the number you want (**WHOLE NUMBES ONLY!**).

To change the tab name of the site:
* In line 8 of `index.html`, replace the text betwteen the `<title>` tags with the text you want. 

To change the top graphic:
* Upload your graphic into the `assets` folder. 
* In line 21 of `index.html`, change the img src to `src="assets/name-of-file"`.
* Change the height and width as needed. (To modify height, just add `height="your-number"` between the width and the >).

To add your own alarm:
* Upload your audio file into the `assets` folder.
* In lines 25-28 of `index.html`, create a new audio line or modify existing line(s) so that `src="assets/name-of-file"`. If your file is not a mp3, you may need to change the type as well. 
* Change the id to what you would like. There may not be two or more of the same ids.

To assign alarms to a specific timer:
* At the top of `script.js`, there is an array ALARMS that contains the ids of the alarms associated with each timer. e.g. `const ALARMS = ["", "default", "alarm2", "default", "default"]`.
* Change the id at the index the timer is at. For example, if you want to change timer 1's alarm to the second alarm, you will change the second element (a.k.a the element at index 1), "default" with "alarm2". Therefore, your array looks like this:  `const ALARMS = ["", "alarm2", "alarm2", "default", "default"]`.
* **MAKE SURE THAT THE IDS MATCH AN AUDIO ID IN `index.html`!**
* _Note: The first id, "", is not used since there is not a timer 0. Furthermore, if no ids are provided or if the id is "", the alarm with the id "default" is used._ 

To change the background image:
* Upload your background image into the `assets` folder.
* In the `body` section of `style.css`, change line 12 to `background-image: url('assets/name-of-file)`.
