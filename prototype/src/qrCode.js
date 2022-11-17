import * as qr from 'qrcode';
import * as fs from 'fs';
import Jimp from 'jimp';
console.clear();


async function createQR(string){
  const data = await qr.toFile('./test.png', string, {margin: 1, version:4});
}

// createQR('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// createQR('https://www.google.com');


async function readImage(path){
  const image = await Jimp.read(path);
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const scaleMultiplier = 4

  const arr = [];
  for (let y = 0; y < height; y+=scaleMultiplier) {
    // ignore the top and bottom rows
    if(y === 0 || y === height-scaleMultiplier){continue}

    let row = '';
    for (let x = 0; x < width; x+=scaleMultiplier) {
      // ignore the edge columns
      if(x === 0 || x === width-scaleMultiplier){continue}

      const hexInt = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(hexInt);

      if(rgba.r === 0){
        row += '#';
      }
      else{
        row += '_';
      }
    }
    arr.push(row);
  }
   
  return arr;
}

async function writeQRData(qrArray ,path){
  // create json to write.
  const obj = {data: await qrArray.map((el)=>{return el})};
  
  // write json
  console.log('writing');
  await fs.writeFileSync(path , JSON.stringify(obj), 'utf-8')
  console.log('written');
}

// (async function(){
//   writeQRData( await readImage('./1.png'), './qr1.json');
//   writeQRData( await readImage('./2.png'), './qr2.json');
// })()




// * get list of files in string array
// const dataPath = './src/inputImages/patterns';
// fs.readdir(dataPath, (err, files)=>{
//   files.forEach(async (element) => {
//     const jsonFileName = element.split('.')[0]
//     writeQRData(await readImage(dataPath+'/'+element), dataPath+'/'+jsonFileName+'.json');
//   });
// } );

//for each file. convert into json

// * create checkerboard pattern
(()=>{
  const final = []
  for (let y = 0; y < 33; y++) {
    let row = []; 
    const isEvenY = y%2===0?true:false;
    for (let x = 0; x < 33; x++) {
      row.push(
        x%2===0?'_':'#'
      )
    }
    if(isEvenY){
      row = row.map((val)=>{
        return val==='#'?'_':'#';
      })
    }
    final.push(row.toString());
    
  }
  writeQRData(final, './checker.json');
})()
