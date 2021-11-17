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

let positionImage = false;
let resizeImage = false;

let imgPos = {
  x:0,y:0
}

let imgSize = {
  x:300,y:300
}

let PMouseX =0;
let PMouseY =0;

function preload(){
  wheel = loadImage("wheel.png");
}

function setup(){
  preloadColorPicker();
  PMouseX = mouseX;
  PMouseY = mouseY;
  frameRate(5);
  createCanvas(window.innerWidth-30, window.innerHeight-30);
  imageMode(CENTER);
  setupInterface();

  clearEverything();
}

function preloadColorPicker(){
  createCanvas(swatches.size,swatches.size);
  image(wheel, 0, 0, swatches.size, swatches.size);
  loadPixels();
}

function clearEverything(){
  console.log("clear")

  buffer = [];
  strokes = [];
  showMe = -1;
  repeats = defaultRepeats;
  refreshRightUI();
}

function draw(){
  //if(drawing&&mouseIsPressed) return;
  //if(buffer.length>0) finalizeButton.show();
  //else finalizeButton.hide();

  background(235);


  // show selected line clearly
  let els = document.getElementsByClassName("line_box");
  for(let i=0; i<els.length; i++){
    if(showMe==i){
      els[i].style.backgroundColor = "gold";
      els[i].scrollIntoView();
    }
    else els[i].style.backgroundColor = "white";
  }

  if(imageDisplayed){
    image(img,imgPos.x,imgPos.y,imgSize.x,imgSize.y);
    background(235,180);
  }

  if(gridEnabled && !saveimage){
    showGrid();
  }

  displayStrokes();

  displayLineBuffer();

  if(frontGridEnabled&&!saveimage){
    showGrid();
  }

  showPointer();


  // interface
  showInterface()


  if(saveimage){
    saveCanvas();
    createCanvas(window.innerWidth-30, window.innerHeight-30);
    saveimage = false;
  }
}



function showPointer(){
  // draw point under mouse
  if(!saveimage){
    stroke(color);
    strokeWeight(brushSize);
    point(mouseX,mouseY);
  }
}





function displayStrokes(){

  for(let j=0; j<strokes.length; j++){

    let c = strokes[j][0].stroke;
    let s = strokes[j][0].size;

    if(colorCheckboxes[c].checked()){

      if(showMe==-1||showMe==j)
      stroke(colors[c]);
      else stroke(0,20);
      strokeWeight(s);

      for(let i=0; i<strokes[j].length; i++){

        let l = strokes[j][i];

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




function deleteLinesOfSelectedColor(){
  for(let i=strokes.length-1; i>=0; i--){
    if(strokes[i][0].stroke==colorSelection) strokes.splice(i,1);
  }

  refreshRightUI();
}





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



function mousePressed(){

  PMouseX = mouseX;
  PMouseY = mouseY;

  if(positionImage||resizeImage){
    positionImage = false;
    resizeImage = false;
    return;
  }

  drawing = mouseY<ui.y && mouseX<rightui.x;

  if(drawing){
    repeats=defaultRepeats;
    showMe=-1;
    flushBuffer();
    colorSelector=-1;
  }
}




function mouseMoved(){
  if(positionImage){
    imgPos.x = mouseX;
    imgPos.y = mouseY;
  }
  else if(resizeImage){
    imgSize.x += mouseX - pmouseX;
    imgSize.y += mouseY - pmouseY;
  }

  // draw point under mouse
  if(!saveimage){
    stroke(color);
    strokeWeight(brushSize);
    point(mouseX,mouseY);
  }
}





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






function mouseReleased(){
  if(drawing)
  flushBuffer();
}







function mouseDragged(){
  if(!drawing){
    if(swatches.selection!=-1){
      let i = 4*(swatches.coords.x + swatches.coords.y * swatches.size);
      colors[colorSelection] = `rgb(${pixels[i]},${pixels[i+1]},${pixels[i+2]})`;
    }
    return;
  }

  buffer.push({
    size:brushSize,
    stroke:color,
    x1:mouseX,
    y1:mouseY,
    x2:PMouseX,
    y2:PMouseY
  });

  stroke("green");//colors[colorSelection]);
  line(mouseX,mouseY,PMouseX,PMouseY);

  PMouseX = mouseX;
  PMouseY = mouseY;
}

function keyTyped() {
  if(key==1) colorSelection=0;
  if(key==2) colorSelection=1;
  if(key==3) colorSelection=2;
  if(key==4) colorSelection=3;
  if(key==5) colorSelection=4;
  if(key==6) colorSelection=5;
  color = colors[colorSelection];

  if(keyCode==13) flushBuffer();

  // esc
  if(keyCode==27) selectNone();

  if(key=='n') clearEverything();
  if(key=='+') plusBrushSize();
  if(key=='-') minusBrushSize();

  if(key=='z') showLast();
  if(key=='x') showNext();
  if(key=='c') showSingle();
  if(key=='v') showAll();

  if(key=='o'){
    resizeImage = true;
    positionImage = false;
  }
  if(key=='p'){
    positionImage = true;
    resizeImage = false;
  }

  if(key=='s'){
    saveimage = true;
    createCanvas(interval,interval);
  }

  if(key=='q') saveDataToFile();

  if(key=='d') deleteLinesOfSelectedColor();
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
  flushBuffer();
  console.log(showMe+"/"+(strokes.length-1));
}

function showNext(){
  showMe = constrain(showMe+1, -1, strokes.length-1);
  repeats =0;
  flushBuffer();
  console.log(showMe+"/"+(strokes.length-1));
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
