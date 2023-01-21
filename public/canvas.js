let canvas = document.querySelector("canvas");
let tool = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let mouseDown = false;
let penColor = "red";
let eraserColor = "white";
let penWidth = "3";
let eraserWidth = "3";
let undoRedoTracker = [];
let track = 0;
let eraserFlag = false;


let download = document.querySelector(".download");
let penWidthElem = document.querySelector(".pen-width");
let penColorElems = document.querySelectorAll(".pen-color");
let eraserWidthElem = document.querySelector(".eraser-width");
let undoBtn = document.querySelector(".undo");
let redoBtn = document.querySelector(".redo");
let eraser = document.querySelector(".eraser");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    socket.emit("beginPath", {
        x: e.clientX,
        y: e.clientY,
    });
})
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        socket.emit("drawStroke", {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth,
            type: eraserFlag ? "erase" : "pen",
        })
    }
})
canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    undoRedoTracker.push(canvas.toDataURL());
    track = undoRedoTracker.length - 1;
})

undoBtn.addEventListener("click", (e) => {
    if (track > 0) track--;
    socket.emit("undoRedo", {
        undoRedoTracker,
        track
    })
})

redoBtn.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    socket.emit("undoRedo", {
        undoRedoTracker,
        track
    })
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


penWidthElem.addEventListener("change", (e) => {
    penWidth = e.target.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = e.target.value;
    tool.lineWidth = eraserWidth;
})
penColorElems.forEach((elem) => {
    elem.addEventListener("click", (e) => {
        penColor = elem.classList[0];
        tool.strokeStyle = penColor;
    })
})
eraser.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;

    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }
    else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    if (strokeObj.type === "pen") penWidthElem.value = strokeObj.width;
    else eraserWidthElem.value = strokeObj.width;
    penColor = strokeObj.color;
    penWidth = strokeObj.width;
    tool.lineWidth = strokeObj.width;
    tool.strokeStyle = strokeObj.color;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}
function undoRedoCanvas(trackObj) {
    track = trackObj.track;
    undoRedoTracker = trackObj.undoRedoTracker;
    console.log(trackObj);
    let img = new Image();
    img.src = undoRedoTracker[track];
    img.onload = (e) => tool.drawImage(img, 0, 0, canvas.width, canvas.height);
}

// Sockets listening
socket.on("beginPath", (data) => {
    beginPath(data);
})
socket.on("drawStroke", (data) => {
    drawStroke(data);
})
socket.on("undoRedo", (data) => {
    console.log("Listening");
    undoRedoCanvas(data);
})