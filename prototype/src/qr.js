import { deg2rad, rad2deg } from "./utilities";
import { Euler, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, SphereGeometry, Vector3 } from "three";
import Experience from "./experience";
import * as qr1 from  './qr1.json';
import * as qr2 from './qr2.json';

export default class QR{
  constructor(width, height){
    // objects
    this.experience = new Experience();
    this.planesArray = [];
    this.material = new MeshBasicMaterial({color: 0x000000});
    this.geo = new PlaneGeometry(1, 1);
    this.width = width; this.height = height;
    this.root = new Group(); this.experience.scene.add(this.root); // create root

    // variables
    this.gap = 0.0;
    this.rotatedQuat = new Quaternion();
    this.unhighlightedScale = 0.3;
    this.lerpSpeed = 8;
    // phsysical vars
    this.physicalQRLength = width;
    // this.unrotatedQuat = new Quaternion().rotateX(deg2rad(180));
     
    // states
    this.goalRotations = [];
    this.goalHighlights = [];
    // this.currentRotations = [];
    // this.currentHighlights = [];

    // create temp reticle for center
    // const retMesh = new Mesh(new SphereGeometry(0.5, 32, 16), new MeshBasicMaterial({color: 'red'}));
    // this.experience.scene.add(retMesh);
     
    // create qr code
    this.createPlanes();
    
    window.addEventListener('keydown', (e)=>{
      if(e.key === '1'){this.updateHighlights(qr1)};
      if(e.key === '2'){this.updateHighlights(qr2)};
      if(e.key === '3'){this.updatePattern(qr1)};
      if(e.key === '4'){this.updatePattern(qr2)};
    })
  }
  createPlanes(){
    for (let yIndex = 0; yIndex < this.width; yIndex++) {
      // create arrays
      const rowArray = [];
      const goalRotRow = [];
      const goalHLRow = [];
      // const currHLRow = [];
      // const currRotRow = [];

      // create row
      for (let xIndex = 0; xIndex < this.height; xIndex++) {
        // create plane
        const posArr = [
          (xIndex + xIndex*this.gap) - this.width/2, 
          -(yIndex + yIndex*this.gap) + this.width/2,
          0
        ]
        const newPlane = new Mesh(this.geo, this.material);
        newPlane.position.set(posArr[0], posArr[1], posArr[2])
        this.root.add(newPlane);
         
        // add to arrays
        rowArray.push(newPlane)
        goalRotRow.push(true);
        goalHLRow.push(true);
        // currRotRow.push(false);
        // currHLRow.push(false);
      }
       
      // add row to array
      this.planesArray.push(rowArray);
      this.goalRotations.push(goalRotRow);
      this.goalHighlights.push(goalHLRow);
      // this.currentRotations.push(currRotRow);
      // this.currentHighlights.push(currHLRow);
    }

    // create ornaments
    const ornamentPositionValues = [
      [1,-1,0],
      [-1,-1, 90],
      [-1,1, 180],
      [1,1, 270],
    ]
    for (let index = 0; index < 4; index++) {
      const ornamentSize = {width: 0.5, height:7}
      // create ornament
      const group = new Group();
      const plane1 = new Mesh(this.geo, this.material)
      const plane2 = new Mesh(this.geo, this.material)
      group.add(plane1); group.add(plane2);
      // transform ornaments
      plane1.scale.set(ornamentSize.width, ornamentSize.height, 1);
      plane2.scale.set(ornamentSize.width, ornamentSize.height, 1);
      plane2.rotateZ(deg2rad(90));
      plane1.translateOnAxis(new Vector3(1, 0, 0), -ornamentSize.width/2);
      plane1.translateOnAxis(new Vector3(0, 1, 0), ornamentSize.height/2);
      plane2.translateOnAxis(new Vector3(1, 0, 0), ornamentSize.width/2);
      plane2.translateOnAxis(new Vector3(0, 1, 0), ornamentSize.height/2);

      // create temp reticle for center
      // const retMesh = new Mesh(new SphereGeometry(0.5, 32, 16), new MeshBasicMaterial({color: 'red'}));
      // group.add(retMesh);

      // place ornament in correct position
      group.translateOnAxis(new Vector3(1, 0, 0), ornamentPositionValues[index][0] * (this.physicalQRLength+ornamentSize.width+4)/2)
      group.translateOnAxis(new Vector3(0, 1, 0), ornamentPositionValues[index][1] * (this.physicalQRLength+ornamentSize.width+4)/2)
      group.translateOnAxis(new Vector3(0, 1, 0), 0.5)
      group.translateOnAxis(new Vector3(1, 0, 0), -0.5)
      // group.translateOnAxis(new Vector3(0, 1, 0), ornamentPositionValues[index][1] * (this.physicalQRLength+ornamentSize.width+4)/2)
      group.rotateZ(deg2rad(-ornamentPositionValues[index][2]))

      // add to scene
      this.root.add(group);
    }

  }
   
  update(){
    // process each square
    for (let yIndex = 0; yIndex < this.planesArray.length; yIndex++) {
      for (let xIndex = 0; xIndex < this.planesArray[0].length; xIndex++) {
        // * process rotations 
        const degToRotate = this.goalRotations[yIndex][xIndex] ? 0 : 180;
        const goalRot = (new Quaternion()).setFromEuler(new Euler(deg2rad(degToRotate), 0, 0));
        this.planesArray[yIndex][xIndex].quaternion.slerp(goalRot, this.lerpSpeed*this.experience.currentDelta)
         
         
        // * process highlight
        const scaleGoal = this.goalHighlights[yIndex][xIndex] ? new Vector3(1,1,1) : new Vector3(this.unhighlightedScale, this.unhighlightedScale, this.unhighlightedScale);
        this.planesArray[yIndex][xIndex].scale.lerp(scaleGoal, this.lerpSpeed*this.experience.currentDelta)
      }
    }
  }

  updatePattern(data){
    const arr = data.data;
    const length = this.goalRotations.length;

    arr.forEach((row, index)=>{
      const newRow = [];
      const rowString = row.split('');

      rowString.forEach((val)=>{
        newRow.push(val==='#'? true : false);
      })
       
      this.goalRotations[index] = newRow;
    });
  }
   
  updateHighlights(data){
    const arr = data.data;
    const length = this.goalRotations.length;
     
    //understanding scale
    console.log(this.planesArray[2][2].scale)

    arr.forEach((row, index)=>{
      const newRow = [];
      const rowString = row.split('');

      rowString.forEach((val)=>{
        newRow.push(val==='#'? true : false);
      })
       
      this.goalHighlights[index] = newRow;
    });
  }
}
