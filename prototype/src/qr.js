import { deg2rad, rad2deg } from "./utilities";
import { Euler, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Quaternion, SphereGeometry, Vector3 } from "three";
import Experience from "./experience";
import pat1 from './inputImages/patterns/Pat_ 01_firstPattern.json'
import pat2 from './inputImages/patterns/Pat_ 02_payment.json'
import pat3 from './inputImages/patterns/Pat_ 03_information.json'
import pat4 from './inputImages/patterns/Pat_ 04_covid19.json'
import pat5 from './inputImages/patterns/Pat_ 04-5_black.json'
import pat6 from './inputImages/patterns/Pat_06_checker.json'
import high1 from './inputImages/highlights/High_Position.json'
import high2 from './inputImages/highlights/High_error.json'
import high3 from './inputImages/highlights/High_message.json'
import high4 from './inputImages/highlights/High_01_version.json'

const patternOrder = [pat1, pat2, pat3, pat4, pat5, pat6];
const highlightOrder = [high1, high2, high3, high4];

export default class QR{
  constructor(width, height){
    // order of states
    this.stateIndex = 0;
    this.orderOfStates = [
      'pat-0',
      'pat-5', //black and white checker
      'pat-0',
      'high-0',
      'high-3',
      'high-1',
      'high-2',
      'char',
      'binary-char',
      'hide-chars-and-snake'
    ];

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
    this.unhighlightedScale = 0.5;
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
    
    this.updatePattern(pat1);
     
    // start with black screen
    this.updatePattern(patternOrder[0]);
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
     

    arr.forEach((row, index)=>{
      const newRow = [];
      const rowString = row.split('');

      rowString.forEach((val)=>{
        newRow.push(val==='#'? true : false);
      })
       
      this.goalHighlights[index] = newRow;
    });
  }
   
  callNextState(index){
    // get next index
    let nextState = null
    if(index){nextState = index}
    else{index = this.stateIndex + 1}

    // update state index counter
    this.stateIndex = index;
     
    // process state
    this.processCurrentState(this.stateIndex);
  }
   
  callPreviousState(){
    // update state index counter
    const index = this.stateIndex - 1
    this.stateIndex = index;
     
    // process state
    this.processCurrentState(index);
  }
   
  processCurrentState(index){
    // get current command
    const command = this.orderOfStates[index].split('-');

    // match case the index
    const elBinary = document.querySelector('.binary');
    const elChar = document.querySelector('.cat');
    switch(command[0]){
      case 'pat':
        // patterns
        this.updatePattern(patternOrder[command[1]])
        // highlights
        this.updateHighlights(pat5);
        // additioanls
        elBinary.classList.add('binaryHide');
        elChar.classList.add('catHide');
        break;
      case 'high':
        // pattern
        this.updatePattern(patternOrder[0]);
        // highliights
        this.updateHighlights(highlightOrder[command[1]])
        // additionals
        elBinary.classList.add('binaryHide');
        elChar.classList.add('catHide');
        break;
      case 'char':
        // patterns
        this.updatePattern(patternOrder[0]);
        // highlights
        this.updateHighlights(pat5)
        // additionals
        elBinary.classList.add('binaryHide');
        elChar.classList.remove('catHide');
        break;
      case 'binary':
        // pattern
        this.updatePattern(patternOrder[0]);
        // highlight
        this.updateHighlights(pat5);
        // additionals
        elBinary.classList.remove('binaryHide');
        break;
      case 'hide':
        // pattern 
        this.updatePattern(patternOrder[0]);
        // highlight
        this.updateHighlights(pat5);
        // additionals
        elBinary.classList.add('binaryHide');
        elChar.classList.add('catHide');
        break;
      default:
        console.log('state broken woops');
    }
  }
}