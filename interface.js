let ui;
let rightui;
let interfaceH = 120;
let interfaceW = 150;
let colorSelector =-1;
let brushTxt;
let PreventBWChange=false;

let swatches = {
  size:60,
  spacing:60,
  indent:35,
  y:35,
  selection:-1,
  coords:{x:0,y:0}
}

let ui_fill = "#cccf";
let img;
let imageDisplayed = false;
let brushButtons;
let finalizeButton;
let colorCheckboxes = [];

function setupInterface(){
  ui = {
    y: height - interfaceH
  }

  rightui = {
    x: width - interfaceW
  }

  for(let i=0; i<colors.length; i++){
    let checkbox = createCheckbox('', true);
    let x = swatches.indent + swatches.spacing * i;
    let y = ui.y + swatches.size/2 + 10 + swatches.y;
    position(checkbox,x,y);

    colorCheckboxes.push(checkbox);
  }

  brushButtons = {
    x: swatches.indent - 20,
    y: ui.y + 100,
    spaceY: 80
  }

  brushTxt = createDiv("brush size: "+brushSize);
  position(brushTxt,brushButtons.x,brushButtons.y +7);

  let brushPlusButton = createButton("+ <span class='keys'>[+]</span>");
  position(brushPlusButton,brushButtons.x + 160,brushButtons.y);
  brushPlusButton.mousePressed(plusBrushSize);

  let brushMinusButton = createButton("- <span class='keys'>[-]</span>");
  position(brushMinusButton,brushButtons.x+215,brushButtons.y)
  brushMinusButton.mousePressed(minusBrushSize);

  brushButtons += 200;

  /*
  finalizeButton = createButton("finalize<br>stroke <span class='keys'>[enter]</span>");
  position(finalizeButton, brushButtons.x + 100, brushButtons.y + 40);
  finalizeButton.mousePressed(flushBuffer);
  */

  let toggleGrid = createButton("Toggle Grid");
  position(toggleGrid, brushButtons.x + 200, brushButtons.y-30);
  toggleGrid.mousePressed(()=>{
    gridEnabled = !gridEnabled;
  });

  let toggleGrid2 = createButton("Toggle Grid2");
  position(toggleGrid2, brushButtons.x + 280, brushButtons.y-30);
  toggleGrid2.mousePressed(()=>{
    frontGridEnabled = !frontGridEnabled;
  });

  let gridPlus = createButton("Grid ++");
  position(gridPlus, brushButtons.x + 200, brushButtons.y -10);
  gridPlus.mousePressed(()=>{
    interval += 5;
  });


  let gridMinus = createButton("Grid --");
  position(gridMinus, brushButtons.x + 200, brushButtons.y + 10);
  gridMinus.mousePressed(()=>{
    interval -= 5;
  });


  let repeatPlus = createButton("repeat ++");
  position(repeatPlus, brushButtons.x + 200, brushButtons.y + 35);
  repeatPlus.mousePressed(()=>{
    defaultRepeats ++;
    repeats = defaultRepeats;
  });


  let repeatMinus = createButton("repeat --");
  position(repeatMinus, brushButtons.x + 200, brushButtons.y + 55);
  repeatMinus.mousePressed(()=>{
    defaultRepeats --;
    repeats = defaultRepeats;
  });

  let imageUpload = createFileInput(handleImageFile);
  position(imageUpload, brushButtons.x+200, brushButtons.y + 80);

  let toggleImage = createButton("toggle image");
  position(toggleImage, brushButtons.x+200, brushButtons.y+100);
  toggleImage.mousePressed(()=>{
    if(img!=null)
    imageDisplayed = !imageDisplayed;
  });


  let loadSaveFile = createFileInput(handleSaveFile);
  position(loadSaveFile, brushButtons.x + 100, brushButtons.y + 75);


  // right ui!

  rightui_el = createDiv();
  rightui_el.elt.setAttribute("class","rightUI");

  let toggleRepeat = createButton("Répéter <span class='keys'>[c], [v]</span>");
  toggleRepeat.mousePressed(()=>{
    if(repeats==defaultRepeats) repeats=0;
    else repeats = defaultRepeats;
  });
  toggleRepeat.parent(rightui_el);
  toggleRepeat.class("show_all_btn");

  let showAll = createButton("Display toute");
  let scrollThingsTxt = createDiv("<span class='keys'>[z], [x]</span> to search");
  scrollThingsTxt.class("show_all_btn");

  showAll.mousePressed(()=>{
    showMe =-1;
    //repeats = defaultRepeats;
  });
  showAll.parent(rightui_el);
  scrollThingsTxt.parent(rightui_el);
  showAll.class("show_all_btn");


  createDiv("[N] to clear screen. [S] to save seamless square. If there's an image, O to resize and P to position image.")
}


function handleImageFile(file){
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
    imageDisplayed = true;
  } else {
    img = null;
    imageDisplayed = false;
  }
}


function handleSaveFile(file){

  if(file.type=="text"){
    let savedata = JSON.parse(file.data);
    strokes = savedata.strokes;
    colors = savedata.colors;
    interval = savedata.interval;
  }

  refreshRightUI();
}

function position(el,x,y){
  el.elt.style.position="absolute";
  el.elt.style.top=y+"px";
  el.elt.style.left=x+"px";
}


function showInterface(){

  // bottom UI

  noStroke();
  fill(ui_fill);
  rect(0,ui.y,width, interfaceH);

  swatches.selection =-1;

  for(let i=0; i<colors.length; i++){
    fill(colors[i]);
    stroke(0);
    strokeWeight(1);
    let x = swatches.indent + i*swatches.spacing;
    let y = ui.y + swatches.y;
    let size = swatches.size;

    if(i!=colorSelection) size = swatches.size-20;
    circle(x, y, size);

    if(mouseIsPressed&&dist(mouseX,mouseY,x,y)<swatches.size/2){
      colorSelection = i;
      color = colors[colorSelection];
      if(colorSelector!=-1){
        console.log("set color to "+i)
        strokes[colorSelector].forEach(stroke=>{
          stroke.stroke = i;
        });
        colorSelector=-1;
      }

      if(!PreventBWChange || (i>0&&i<colors.length-1) ){
        image(wheel, x, y, swatches.size, swatches.size);

        stroke(colors[i]);
        strokeWeight(10);
        noFill();
        circle(x, y, size + 10);

        swatches.selection =i;
        swatches.coords = {
          x: mouseX - x + swatches.size/2,
          y: mouseY - y + swatches.size/2
        }
      }
    }
  }


  // show brushsize
  fill(200);
  stroke(150);
  circle(swatches.indent + 98,ui.y+swatches.y + 68, brushSize);
  //fill(0);
  //text(brushSize, swatches.indent + 145,ui.y+swatches.y + 68);



  // Right UI
  noStroke();
  fill(ui_fill);
  rect(rightui.x,0,interfaceW,height);
}

let rui = [];
let rightui_el;

function refreshRightUI(){
  for(let i=rui.length-1; i>=0; i--){
    rui[i].remove();
  }

  rui = [];
  for(let i=0; i<strokes.length; i++){
    let controlpannel = createDiv(`${i}  `);
    //position(controlpannel, rightui.x + 15, 10+i*90);
    controlpannel.parent(rightui_el);
    controlpannel.class("line_box");
    controlpannel.mousePressed(()=>{
      showMe = i;
      //flushBuffer();
    });

    let deleteBtn = createButton("delete");
    deleteBtn.parent(controlpannel);
    deleteBtn.class("deletebtn");

    let plusThickness = createButton("+");
    plusThickness.parent(controlpannel);
    let minusThickness = createButton("-");
    minusThickness.parent(controlpannel);

    let colorSelect = createButton("couleur");
    colorSelect.parent(controlpannel);
    colorSelect.mousePressed(()=>{
      colorSelector =i;
      console.log("select my color "+ i)
      refreshRightUI();
    });
    colorSelect.elt.style.color=colors[strokes[i][0].stroke];
    colorSelect.elt.style.backgroundColor="white";

    controlpannel.elt.innerHTML+="<br>";

    let moveLeft = createButton("gau");
    moveLeft.parent(controlpannel);
    let moveRight = createButton("dro");
    moveRight.parent(controlpannel);
    let moveUp = createButton("hau");
    moveUp.parent(controlpannel);
    let moveDown = createButton("bas");
    moveDown.parent(controlpannel);



    deleteBtn.mousePressed(()=>{
      strokes.splice(i,1);
      refreshRightUI();
    });

    plusThickness.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.size++;
      });
    });

    minusThickness.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.size--;
      });
    });

    moveLeft.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.x1 -= interval;
        stroke.x2 -= interval;
      });
      repeats =0;
    });

    moveRight.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.x1 += interval;
        stroke.x2 += interval;
      });
      repeats =0;
    });

    moveUp.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.y1 -= interval;
        stroke.y2 -= interval;
      });
      repeats =0;
    });

    moveDown.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.y1 += interval;
        stroke.y2 += interval;
      });
      repeats =0;
    });


    rui.push(controlpannel);
    rui.push(deleteBtn);
    rui.push(plusThickness);
    rui.push(minusThickness);
    rui.push(moveLeft);
    rui.push(moveRight);
    rui.push(moveUp);
    rui.push(moveDown);
    rui.push(colorSelect);
  }
}
