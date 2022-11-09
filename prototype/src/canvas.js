import { InstancedBufferGeometry, WebGLRenderer } from "three";
import Experience from "./experience";

export default class Canvas{
  constructor(htmlElement){
    this.htmlElement = htmlElement;
    // init renderer
    this.renderer = new WebGLRenderer({antialias: true});
    htmlElement.appendChild(this.renderer.domElement);
    this.updateCanvasSize();
     
    // on resize
    window.addEventListener('resize', this.updateCanvasSize.bind(this))
  }
   
  updateCanvasSize(){
    // get size
    const width = this.htmlElement.clientWidth;
    const height = this.htmlElement.clientHeight;

    //update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // update camera
    const cam = new Experience().camera;
    if(cam){
      cam.aspect = width/height
      cam.updateProjectionMatrix();
    }
  }
   
  update(){
    const experience = new Experience();
    this.renderer.render(experience.scene, experience.camera);
  }
}