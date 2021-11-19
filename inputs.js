
// mousePressed()
//
//
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


// mouseReleased()
//
//
function mouseReleased(){
  if(drawing)
  flushBuffer();
}



// mouseMoved()
//
//
function mouseMoved(){
  if(!started) return;

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
    stroke(colors[colorSelection]);
    strokeWeight(brushSize);
    point(mouseX,mouseY);
  }
}




// mouseDragged()
//
//
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





// keyTyped()
//
//
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
    saveImage();
  }

  if(key=='q') saveDataToFile();

  if(key=='d') deleteLinesOfSelectedColor();
}
