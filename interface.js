let ui;
let rightui;
let interfaceH = 120;
let interfaceW = 200;
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

let ui_fill = "#666f";
let img;
let imageDisplayed = false;
let brushButtons;
let finalizeButton;
let colorCheckboxes = [];
let grille;
let imgArea;
let loadarea;

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

  brushTxt = createDiv("epaisseur: "+brushSize);
  position(brushTxt,brushButtons.x,brushButtons.y +15);

  let brushPlusButton = createButton("+ <span class='keys'>[+]</span>");
  position(brushPlusButton,brushButtons.x + 160,brushButtons.y +10);
  brushPlusButton.mousePressed(plusBrushSize);

  let brushMinusButton = createButton("- <span class='keys'>[-]</span>");
  position(brushMinusButton,brushButtons.x+215,brushButtons.y +10)
  brushMinusButton.mousePressed(minusBrushSize);

  grille = {
    x: brushButtons.x + 370,
    y: brushButtons.y - 80
  }



  /*
  finalizeButton = createButton("finalize<br>stroke <span class='keys'>[enter]</span>");
  position(finalizeButton, brushButtons.x + 100, brushButtons.y + 40);
  finalizeButton.mousePressed(flushBuffer);
  */

  let grilleDiv = createDiv("grille");
  position(grilleDiv, grille.x, grille.y );

  let toggleGrid = createButton("deriere");
  position(toggleGrid, grille.x, grille.y + 15);
  toggleGrid.mousePressed(()=>{
    gridEnabled = !gridEnabled;
  });

  let toggleGrid2 = createButton("devant");
  position(toggleGrid2, grille.x, grille.y + 38 );
  toggleGrid2.mousePressed(()=>{
    frontGridEnabled = !frontGridEnabled;
  });

  let gridPlus = createButton("++");
  position(gridPlus,  grille.x, grille.y + 61 );
  gridPlus.mousePressed(()=>{
    interval += 5;
  });


  let gridMinus = createButton("--");
  position(gridMinus,  grille.x + 35, grille.y + 61);
  gridMinus.mousePressed(()=>{
    interval -= 5;
  });



  imgArea = {
    x: grille.x + 20,
    y: grille.y
  }

  let imageDiv = createDiv("image");
  position(imageDiv, imgArea.x + 80, imgArea.y);

  let imageUpload = createFileInput(handleImageFile);
  position(imageUpload, imgArea.x + 80, imgArea.y + 20);

  let instruImage = createDiv(
    "<span class='keys'>[o]</span> = resize"
    +"<br><span class='keys'>[p]</span> = position"
  );
  position(instruImage, imgArea.x + 80, imgArea.y+74);

  let toggleImage = createButton("toggle");
  position(toggleImage, imgArea.x + 80, imgArea.y + 47);
  toggleImage.mousePressed(()=>{
    if(img!=null)
    imageDisplayed = !imageDisplayed;
  });


  loadarea = {
    x: grille.x + 235,
    y: grille.y - 0
  }

  let saveDiv = createDiv("load file");
  position(saveDiv, loadarea.x,loadarea.y);

  let loadSaveFile = createFileInput(handleSaveFile);
  position(loadSaveFile, loadarea.x,loadarea.y + 15);

  let saveBtn = createButton("save project " + kspan("q"));
  position(saveBtn,  loadarea.x + 90,loadarea.y+0 );
  saveBtn.mousePressed(()=>{
    saveDataToFile();
  });

  let savePngBtn = createButton("save png " + kspan("s"));
  position(savePngBtn,  loadarea.x + 90,loadarea.y+22 );
  savePngBtn.mousePressed(()=>{
    saveImage();
  });


  let newBtn = createButton("efface toute "+kspan("n"));
  position(newBtn,  loadarea.x,loadarea.y + 75);
  newBtn.mousePressed(()=>{
    clearEverything();
  });

  let eraseColorBtn = createButton("efface couleur selectionee "+kspan("d"));
  position(eraseColorBtn,  loadarea.x,loadarea.y + 97);
  eraseColorBtn.mousePressed(()=>{
    deleteLinesOfSelectedColor();
  });

  // right ui!

  rightui_el = createDiv();
  rightui_el.elt.setAttribute("class","rightUI");
  rightui_el.elt.setAttribute("onscroll","doscroll()");

  let toggleRepeat = createButton("Répéter <span class='keys'>[c], [v]</span>");
  toggleRepeat.mousePressed(()=>{
    if(repeats==defaultRepeats) repeats=0;
    else repeats = defaultRepeats;
  });
  toggleRepeat.parent(rightui_el);
  toggleRepeat.elt.setAttribute("class","show_all_btn");

  let repeteDiv = createDiv("duplicats");
  repeteDiv.class("repeteDiv");
  repeteDiv.parent(rightui_el);
  //position(repeteDiv, grille.x, grille.y + 86);

  let repeatPlus = createButton("+");
  //position(repeatPlus, grille.x + 0, grille.y + 102);
  repeatPlus.parent(repeteDiv);
  repeatPlus.elt.classList.add("plusminus");
  repeatPlus.mousePressed(()=>{
    defaultRepeats ++;
    repeats = defaultRepeats;
  });


  let repeatMinus = createButton("-");
  repeatMinus.elt.classList.add("plusminus");
  //position(repeatMinus, grille.x + 28, grille.y + 102);
  repeatMinus.parent(repeteDiv);
  repeatMinus.mousePressed(()=>{
    defaultRepeats --;
    repeats = defaultRepeats;
  });

  let showAll = createButton("Display toute");
  let scrollThingsTxt = createDiv("<span class='keys'>[z],[x]</span> to search");
  scrollThingsTxt.elt.setAttribute("class","show_all_btn");

  showAll.mousePressed(()=>{
    showMe =-1;
    //repeats = defaultRepeats;
  });
  showAll.parent(rightui_el);
  scrollThingsTxt.parent(rightui_el);
  showAll.elt.setAttribute("class","show_all_btn");


  //createDiv("[N] to clear screen. [S] to save seamless square. If there's an image, O to resize and P to position image.")
}

function kspan(i){
  return "<span class='keys'>["+i+"]</span>";
}


function doscroll(){
  breakFocus=true;
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

  stroke(185);
  strokeWeight(1);
  line(grille.x - 20,grille.y - 10,grille.x - 20,grille.y+160);
  line(imgArea.x + 60, imgArea.y - 10, imgArea.x + 60, imgArea.y+160);
  line(loadarea.x - 20,loadarea.y,loadarea.x - 20,loadarea.y+160);

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
  circle(swatches.indent + 98,ui.y+swatches.y + 75, brushSize);
  //fill(0);
  //text(brushSize, swatches.indent + 145,ui.y+swatches.y + 68);



  // Right UI
  noStroke();
  fill(ui_fill);
  rect(rightui.x,0,interfaceW,height);
}

let rui = [];
let rightui_el;

function selectStroke(i){
  showMe = i;
  breakFocus=false;
}

function refreshRightUI(){
  for(let i=rui.length-1; i>=0; i--){
    rui[i].remove();
  }

  rui = [];

  for(let i=0; i<strokes.length; i++){

    // a box to contain all of this stroke's settings
    let controlpannel = createDiv(`${i}  `);
    rui.push(controlpannel);
    controlpannel.parent(rightui_el);
    controlpannel.elt.setAttribute("class","line_box");

    controlpannel.mousePressed(()=>{
      selectStroke(i);
    });

    // delete button
    let deleteBtn = createButton("delete");
    rui.push(deleteBtn);
    deleteBtn.parent(controlpannel);
    deleteBtn.elt.setAttribute("class","deletebtn");

    deleteBtn.mousePressed(()=>{
      strokes.splice(i,1);
      refreshRightUI();
    });

    // line thickness control:

    let plusThickness = createButton("+");
    plusThickness.parent(controlpannel);
    rui.push(plusThickness);

    plusThickness.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.size++;
        selectStroke(i);
      });
    });

    let minusThickness = createButton("-");
    minusThickness.parent(controlpannel);
    rui.push(minusThickness);

    minusThickness.mousePressed(()=>{
      strokes[i].forEach(stroke=>{
        stroke.size--;
        selectStroke(i);
      });
    });

    // color selection button
    let colorSelect = createButton("colo");
    colorSelect.parent(controlpannel);
    rui.push(colorSelect);

    colorSelect.mousePressed(()=>{
      colorSelector =i;
      refreshRightUI();
      selectStroke(i);
    });
    colorSelect.elt.style.color=colors[strokes[i][0].stroke];
    colorSelect.elt.style.backgroundColor="white";

    //controlpannel.elt.innerHTML+="<br>";


    let moveLeft = createButton("gau");
    moveLeft.parent(controlpannel);
    let moveRight = createButton("dro");
    moveRight.parent(controlpannel);
    let moveUp = createButton("hau");
    moveUp.parent(controlpannel);
    let moveDown = createButton("bas");
    moveDown.parent(controlpannel);


    moveLeft.mousePressed(()=>{
      selectStroke(i);
      strokes[i].forEach(stroke=>{
        stroke.x1 -= interval;
        stroke.x2 -= interval;
      });
      repeats =0;
    });

    moveRight.mousePressed(()=>{
      selectStroke(i);
      strokes[i].forEach(stroke=>{
        stroke.x1 += interval;
        stroke.x2 += interval;
      });
      repeats =0;
    });

    moveUp.mousePressed(()=>{
      selectStroke(i);
      strokes[i].forEach(stroke=>{
        stroke.y1 -= interval;
        stroke.y2 -= interval;
      });
      repeats =0;
    });

    moveDown.mousePressed(()=>{
      selectStroke(i);
      strokes[i].forEach(stroke=>{
        stroke.y1 += interval;
        stroke.y2 += interval;
      });
      repeats =0;
    });





    rui.push(moveLeft);
    rui.push(moveRight);
    rui.push(moveUp);
    rui.push(moveDown);

  }
}
