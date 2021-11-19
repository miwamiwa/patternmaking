let color = "black";
let interval = 300;
let defaultRepeats = 1;
let repeats =defaultRepeats;
let brushSize = 8;
let showMe =-1;
let buffer = [];
let drawing = false;
let strokes = [];
let gridEnabled = false;
let frontGridEnabled = false;
let saveimage = false;
let colors = ["black","blue","tomato","green","orange",235];
let colorSelection =0;
let wheel;
let breakFocus=false;
let positionImage = false;
let resizeImage = false;
let imgPos = {x:0,y:0};
let imgSize = {x:300,y:300};
let started = false;

let PMouseX =0;
let PMouseY =0;

// preload()
//
//
function preload(){
  wheel = loadImage("wheel.png");
}

// setup()
//
//
function setup(){
  preloadColorPicker();
  PMouseX = mouseX;
  PMouseY = mouseY;
  frameRate(5);
  createCanvas(window.innerWidth-30, window.innerHeight-30);
  imageMode(CENTER);
  setupInterface();

  clearEverything();
  started=true;
}

// preloadColorPicker()
//
//
function preloadColorPicker(){
  createCanvas(swatches.size,swatches.size);
  image(wheel, 0, 0, swatches.size, swatches.size);
  loadPixels();
}

// clearEverything()
//
//
function clearEverything(){

  buffer = [];
  strokes = [];
  showMe = -1;
  repeats = defaultRepeats;
  refreshRightUI();
}

// draw()
//
//
function draw(){

  // refresh background
  background(235);

  // show selected line clearly
  let els = document.getElementsByClassName("line_box");
  if(!breakFocus)
  for(let i=0; i<els.length; i++){
    if(showMe==i){
      els[i].style.backgroundColor = "gold";
      els[i].scrollIntoView();
    }
    else els[i].style.backgroundColor = "white";
  }

  // display image
  if(imageDisplayed){
    image(img,imgPos.x,imgPos.y,imgSize.x,imgSize.y);
    background(235,180);
  }

  // display back grid
  if(gridEnabled && !saveimage){
    showGrid();
  }

  // display all lines
  displayStrokes();

  // display line we're currently drawing
  displayLineBuffer();

  // display front grid
  if(frontGridEnabled&&!saveimage){
    showGrid();
  }

  // display brush where mouse is
  showPointer();

  // refresh interface
  showInterface()

  // if save is triggered, resize and save
  if(saveimage){
    saveCanvas();
    createCanvas(window.innerWidth-30, window.innerHeight-30);
    saveimage = false;
  }
}


// showPointer()
//
// draw point under mouse
function showPointer(){
  if(!saveimage){
    stroke(colors[colorSelection]);
    strokeWeight(brushSize);
    point(mouseX,mouseY);
  }
}




// displayStrokes()
//
// display all lines in strokes[]
function displayStrokes(){

  for(let j=0; j<strokes.length; j++){
    let c = strokes[j][0].stroke;
    let s = strokes[j][0].size;

    // prevent display if color is unchecked
    if(colorCheckboxes[c].checked()){

      // assign color depending on line selection
      if(showMe==-1||showMe==j) stroke(colors[c]);
      else stroke(0,20);

      strokeWeight(s);

      // display each segment
      for(let i=0; i<strokes[j].length; i++){
        let l = strokes[j][i];

        // repeat along x and y axis
        for(let x=-repeats; x<repeats+1; x++){
          for(let y=-repeats; y<repeats+1; y++){

            line(
              x*interval+l.x1,
              y*interval+l.y1,
              x*interval+l.x2,
              y*interval+l.y2
            );
          }
        }
      }
    }
  }
}



// deleteLinesOfSelectedColor()
//
// remove all lines matching the currently selected color.
function deleteLinesOfSelectedColor(){
  for(let i=strokes.length-1; i>=0; i--){
    //console.log(strokes[i], colorSelection)
    if(strokes[i][0].stroke==colorSelection) strokes.splice(i,1);
  }
  refreshRightUI();
}




// displayLineBuffer()
//
// display the current line (while mouse is still pressed)
function displayLineBuffer(){
  for(let i=0; i<buffer.length; i++){
    for(let x=-repeats; x<repeats+1; x++){
      for(let y=-repeats; y<repeats+1; y++){

        let l = buffer[i];
        stroke(colors[colorSelection]);
        strokeWeight(brushSize);
        line(
          x*interval+l.x1,
          y*interval+l.y1,
          x*interval+l.x2,
          y*interval+l.y2
        );
      }
    }
  }
}




// showGrid()
//
//
function showGrid(){

  stroke(255);
  strokeWeight(1);
  for(let x=width/2+ interval/4-repeats*interval; x<width/2+repeats*interval; x+=interval){
    line(x, 0, x, height);
  }
  for(let y=height/2+ interval/4-repeats*interval; y<height/2+repeats*interval; y+=interval){
    line(0, y, width, y);
  }
}







// flushBuffer()
//
//
function flushBuffer(){
  for(let i=0; i<buffer.length; i++){
    buffer[i].size=brushSize;
    buffer[i].stroke=colorSelection;
  }
  if(buffer.length>0)
  strokes.push(buffer);
  buffer = [];

  refreshRightUI();
}







function saveImage(){
  saveimage = true;
  createCanvas(interval,interval);
}



function selectNone(){
  console.log("select nonw")
  showMe = -1;
  repeats = defaultRepeats;
}




function saveDataToFile(){
  flushBuffer();

  let toutledata = {
    strokes:strokes,
    colors:colors,
    interval:interval
  }
  let str = JSON.stringify(toutledata);

  // name the file
  let filename = prompt("Name the save file","MyPattern");
  if(filename==null) filename="untitled";

  // write file
  let writer = createWriter(filename+".txt");
  writer.print(str);

  writer.close();
  writer.clear();
}

function showLast(){
  showMe = constrain(showMe-1, -1, strokes.length-1);
  repeats =0;

  breakFocus=false;
  flushBuffer();
  //console.log(showMe+"/"+(strokes.length-1));
}

function showNext(){
  showMe = constrain(showMe+1, -1, strokes.length-1);
  repeats =0;

  breakFocus=false;
  flushBuffer();
  //console.log(showMe+"/"+(strokes.length-1));
}

function showSingle(){
  repeats=0;
  showMe=-1;
  flushBuffer();
}

function showAll(){
  repeats=defaultRepeats;
  showMe=-1;
  flushBuffer();
}

function plusBrushSize(){
  brushSize++;
  strokeWeight(brushSize);
  brushTxt.elt.innerHTML = "brush size: "+brushSize;
}

function minusBrushSize(){
  brushSize--;
  strokeWeight(brushSize);
  brushTxt.elt.innerHTML = "brush size: "+brushSize;
}
