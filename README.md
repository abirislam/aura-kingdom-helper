# aura-kingdom-helper
Finds in-game items referencing https://www.aurakingdom-db.com/

# Architecture
- The frontend is displayed using Electron and Node.js
- The Ctrl+F hotkey launches a Python child process that uses Numpy, Tesseract, and OpenCV

## Start Guide
### 
- Launch the executable file after installing
- After opening the Aura Kingdom game, you can hit Ctrl+D to open DB [page](https://www.aurakingdom-db.com/)
- If you hover over an item, you can hit Ctrl+F to search for that item on the DB page
- The Ctrl+D option will retain its state so you can continue where you left off
- The Ctrl+F option will not retain its state as it will attempt to search for a new item each time