import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import className from './style.styl'

const WIDTH = 333

class Canvas extends Component {
  constructor(params) {
    super(params)
    this.state = {
      video: {},
      width: WIDTH,
      height: 0
    }
  }
  buildImage() {
    let idat = ipcRenderer.sendSync('getPNGidat');
    console.log(idat);
  }
  componentDidMount() {
    const { video } = this.refs
    video.addEventListener('loadedmetadata', (res) => {
      this.setState({
        width: WIDTH,
        height: res.target.clientHeight
      }, () => {
        this.loop()
      });
    })
  }
  componentWillReceiveProps(nextProps) {
    const { target } = nextProps;
    this.setState({
      video: target
    });
  }
  loop = () => {
    const { width, height } = this.state
    const canvas = this.refs.canvas.getContext('2d')
    canvas.drawImage(this.refs.video, 0, 0, width, height);
    this.i = requestAnimationFrame(this.loop);
  }
  makePNG = () => {
    const { width, height } = this.state
    const cvs = this.refs.canvas.getContext('2d')
    let pixels = cvs.getImageData(0, 0, width, height);
    console.log(pixels);
    const PNGbase64 = this.refs.canvas.toDataURL()
    this.refs.image.src = PNGbase64
  }
  render() {
    const { cls } = this.props;
    const { width, height, video } = this.state
    return (
      < div >
        <video width={WIDTH} src={video.path} autoPlay ref='video'></video>
        <canvas width={width} height={height} ref='canvas' className='canvas'></canvas>
        <img ref='image' />
        <div className={className.btn} onClick={this.makePNG} >PNG</div>
      </div >
    );
  }
}

export default Canvas;