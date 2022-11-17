import {BoxGeometry, Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneBufferGeometry, PlaneGeometry, Scene} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Canvas from './canvas';
import QR from './qr';
import { deg2rad } from './utilities';

let instance = null

export default class Experience{
  constructor(){
    // singleton
    if(instance){return instance}else{instance = this}
    console.log('new experience created');

    // clock stuff
    this.clock = new Clock();
    this.currentDelta = 0; this.updateDelta();

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(10, 10/10, 0.1, 1000);
    this.canvas = new Canvas(document.querySelector('#canvas'));
    this.camera.position.set(0, 0 ,225);
    this.orbit = new OrbitControls(this.camera, this.canvas.htmlElement);
    this.orbit.enableRotate = false;
    this.orbit.enabled = false;
     
    // prototyping execution
    this.scene.background = new Color('#FFFFFF');
    // create object to test
    this.qr = new QR(33, 33);
     
    // start render loop
    this.update();
  }
   
  update(){
    // request next frame
    requestAnimationFrame(this.update.bind(this));
    // getdelta 
    this.updateDelta();

    // update stack
    this.orbit.update();
    this.qr.update();

    //render frame
    this.canvas.update();
  }
  updateDelta(){
    return this.currentDelta = this.clock.getDelta();
  }
}