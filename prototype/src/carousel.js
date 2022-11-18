import Experience from "./experience";

const experience = new Experience();

const paragraphs = [
  "QR codes have become an integral part of our lives that no one thinks twice about. So this article will be a quick dive into what makes them tick.",
  "A QR code, or a quick response code is essentially 2D array of black and white squares.",
  "They are arranged in a pattern to allow a scanner such as your phone camera to read a message.",
  "These patterns range in functions such as allowing quick identification of the QR's position and rotation.",
  "Noting which version of the QR code is being used.",
  "Relaying its error correction level.",
  "And finally of course the actual message itself",
  "It works by mapping different characters into different numbers",
  "Using pattern of 8 squares to convey this number. these patterns are then chained together snaking through the code to finally form the message",
  "All of this to quickly and reliably relay information, easing our daily digital lives. And thats how the QR code works",
]


export default function initCarousel(){
  // get elements
  const elScroller = document.querySelector('.sliderScroller');
  const elButtons = document.getElementsByClassName('nextPrevButtons');
  const elBullets = document.getElementsByClassName('bullets');
  const elParagraphs = document.getElementsByClassName('slide');
  
  // variables
  const width = 20;
  const noOfElements = 9;

  // insert paragraphs
  for (let index = 0; index < elParagraphs.length; index++) {
    elParagraphs[index].innerHTML = paragraphs[index];
  }

  // sync button to states
  function checkToDisableButtons(){
    if(experience.qr.stateIndex === 0){
      elButtons[0].disabled = true
    }else{
      elButtons[0].disabled = false
    }

    if(experience.qr.stateIndex === noOfElements){
      elButtons[1].disabled = true
    }else{
      elButtons[1].disabled = false
    }
  } 
  checkToDisableButtons();
   
  // sync bullets with states
  function highlightBullets(){
    const currentIndex = experience.qr.stateIndex;
    // only highlight correct buttons
    for (let index = 0; index < elBullets.length; index++) {
      if(index === currentIndex){
        // elBullets[index].classList.add('current');
        elBullets[index].disabled = true;
      }else{
        // elBullets[index].classList.remove('current');
        elBullets[index].disabled = false;
      }
    }
  }
  highlightBullets();
   
  // buttons events
  [...elButtons].forEach((val, index)=>{
    val.addEventListener('pointerup', ()=>{
      if(index===0){
        // call prev qr 
        experience.qr.callPreviousState();
        // slide carousel
        elScroller.style = `left: -${width*experience.qr.stateIndex}em`
        // check to disable buttons
        checkToDisableButtons()
        // highlight bullets
        highlightBullets();
      }else{
        // call next qr
        experience.qr.callNextState();
        // slide carousel
        elScroller.style = `left: -${width*experience.qr.stateIndex}em`
        // check to disable buttons
        checkToDisableButtons()
        // highlight bullets
        highlightBullets();
      }
    })
  })


  // bullet events
  const elBulletsArr = [];
  for (let index = 0; index < elBullets.length; index++) {
    elBulletsArr.push(elBullets[index]);
  }
  elBulletsArr.forEach((val, index)=>{
    val.addEventListener('pointerup', ()=>{
      // update qr
      experience.qr.callNextState(index);
      // scroll carousel
      elScroller.style = `left: -${width*experience.qr.stateIndex}em`
      // check to disable buttons
      checkToDisableButtons()
      // highlight bullets
      highlightBullets();
    })
  });
}