import Glide from '@glidejs/glide'
import Experience from "./src/experience";

const experience = new Experience();
new Glide('.glide').mount()


// connect carousell bullets to qr
const elBullets = document.getElementsByClassName('glide__bullet');
const elNextPrevButtons = document.getElementsByClassName('glideNextPrevButtons');

function checkToDisableButtons(){
  console.log(experience.qr.stateIndex);
  if(experience.qr.stateIndex === 0){
    elNextPrevButtons[0].disabled = true
  }else{
    elNextPrevButtons[0].disabled = false
  }

  if(experience.qr.stateIndex === 9){
    elNextPrevButtons[1].disabled = true
  }else{
    elNextPrevButtons[1].disabled = false
  }
}

checkToDisableButtons();

[...elBullets].forEach((element, index) => {
  element.addEventListener('pointerup', ()=>{
    console.log(index)
    console.log(experience.qr.stateIndex);
    experience.qr.callNextState(index);
  })
   
  // disable buttons at ends
  checkToDisableButtons();
});

[...elNextPrevButtons].forEach((val, index)=>{
  val.addEventListener('pointerup',()=>{
    if(index === 1){
      experience.qr.callNextState();
    }else{
      experience.qr.callPreviousState();
    }

    // disbable buttons at ends
    checkToDisableButtons();
  });

})

