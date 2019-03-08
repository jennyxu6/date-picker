import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './index.css';
import 'react-virtualized/styles.css';

const canvasW = 400;
const canvasH = 400;

class PaintBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images : [],
      drawType : null,
      isDrawing: false
    };
    this.mouse = {
      startX: 0,
      startY: 0
    }
  }

  handleUpload(){
    // Check extension first
    var fileExtension = ['jpg', 'png'];
    var file = this.uploader.files[0];
    var name = file.name.split('.');
    var extension = name[name.length - 1];
    if (fileExtension.indexOf(extension) === -1) {
      alert("请上传JPG或PNG图片！");
      return;
    }

    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasW, canvasH); //Clear the whole canvas
    var imageObj = new Image();
    var reader = new FileReader();
    reader.onloadend = () => {
      imageObj.onload = () => {
        if (imageObj.width > canvasW || imageObj.height > canvasH) {
          var ratio = Math.min(canvasW/imageObj.width, canvasH/imageObj.height);
          ctx.scale(ratio, ratio);
        }
        ctx.drawImage(imageObj, 0, 0);
      };
      imageObj.src = reader.result;

      var savedImg = this.createImg(reader.result);
      document.getElementById('savedImgs').appendChild(savedImg); // Save the uploaded image

    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  selectType(type) {
    this.setState({
      drawType: type
    });
  }

  // Dot: draw dot when mousedown
  // Line: draw line when mousemove
  // Rectangle & circle: record the starting point, draw image when mouseup
  handleMouseDown(e) {
    this.setState({
      isDrawing: true
    });
    var ctx = this.canvas.getContext('2d');
    this.mouse.startX = e.pageX - this.canvas.offsetLeft;
    this.mouse.startY = e.pageY - this.canvas.offsetTop;

    switch (this.state.drawType) {
      case "dot":
        ctx.fillRect(this.mouse.startX, this.mouse.startY, 2, 2); // Set width and height to 2 makes it easier to see the dot
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(this.mouse.startX, this.mouse.startY);
        break;
      case "delete":
        ctx.clearRect(this.mouse.startX, this.mouse.startY, 20, 20); // Set the size of rubber
        break;
      default:
        break;
    }
  }

  handleMouseMove(e) {
    if (this.state.isDrawing === false) {
      return;
    }
    var ctx = this.canvas.getContext('2d');
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;

    switch (this.state.drawType) {
      case 'line':
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'delete':
        ctx.clearRect(x, y, 20, 20);
        break;
      default:
        break;
    }
  }

  handleMouseUp(e) {
    this.setState({
      isDrawing: false
    })
    var ctx = this.canvas.getContext('2d');
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;
    var left = (x < this.mouse.startX) ? x : this.mouse.startX;
    var top = (y < this.mouse.startY) ? y : this.mouse.startY;
    var width = Math.abs(x - this.mouse.startX);
    var height = Math.abs(y - this.mouse.startY);

    switch (this.state.drawType) {
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.stroke();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(left + width/2, top + height/2, width/2, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      default:
        break;
    }
  }

  saveCanvas() {
    var dataURL = this.canvas.toDataURL();
    var ctx = this.canvas.getContext('2d');
    var image = this.createImg(dataURL);

    document.getElementById('savedImgs').appendChild(image);
    $('#savedImgs').on('click', '.savedImg', function(){ // Load a saved image to canvas
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(this, 0, 0);
    });
  }

  clearCanvas() {
    var ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasW, canvasH);
  }

  createImg(src) {
    var imageObj = new Image();
    imageObj.src = src;
    imageObj.style.width = '60px';
    imageObj.style.height = 'auto';
    imageObj.className = 'savedImg';
    return imageObj;
  }

  render() {
    return (
      <div id='container'>
        <h2>图片编辑器</h2>
        <div>
          上传图片：<input type='file' id='getval' name='background-image'
            accept='image/jpg, image/png' // Only accepts jpg and png files
            onChange={() => this.handleUpload()}
            ref={ref => this.uploader = ref}
          />
        </div>
        <canvas
          id='canvas1'
          width='400' height='400'
          ref={ref => this.canvas = ref}
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseUp={e => this.handleMouseUp(e)}
        ></canvas>
        <div>
          <button onClick={() => this.selectType('dot')}>点</button>
          <button onClick={() => this.selectType('line')}>线</button>
          <button onClick={() => this.selectType('rectangle')}>矩形</button>
          <button onClick={() => this.selectType('circle')}>圆形</button>
          <button onClick={() => this.selectType('delete')}>橡皮擦</button>
          <button onClick={() => this.saveCanvas()}>保存图片</button>
          <button onClick={() => this.clearCanvas()}>清除图片</button>
        </div>
        <div id='savedImgs' ref={ref => this.savedImgs = ref}>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <PaintBoard />,
  document.getElementById('root')
);
