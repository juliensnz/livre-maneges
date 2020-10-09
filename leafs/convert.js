const svgr = require('@svgr/core');
const glob = require('glob');
const fs = require('fs');
const parser = require('xml2json');


const getSvgFiles = async (sourceFolder) => {
  return new Promise((resolve, reject) => {
    glob(`${sourceFolder}/*.svg`, async (error, files) => {
      if (null !== error) {reject(error); return;}

      resolve(files);
    })
  });
}

const convertToReact = async (file, index, target) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const xml = JSON.parse(parser.toJson(data));
        const updatedXml = parser.toXml(JSON.stringify({'g': {'path': xml.svg.g.g.path}}));

        svgr.default(updatedXml, { prettier: false, componentName: `Leaf${index}` }).then(
          reactLeaf => {
            fs.writeFileSync(target, reactLeaf.replace('<g>', '<>').replace('</g>', '</>'));
            resolve();
          },
        )
      }
    });
  });
};

// const svgCode = `
// <?xml version="1.0" encoding="UTF-8"?>
// <svg width="88px" height="88px" viewBox="0 0 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//     <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
//     <title>Dismiss</title>
//     <desc>Created with Sketch.</desc>
//     <defs></defs>
//     <g id="Blocks" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
//         <g id="Dismiss" stroke="#063855" stroke-width="2">
//             <path d="M51,37 L37,51" id="Shape"></path>
//             <path d="M51,51 L37,37" id="Shape"></path>
//         </g>
//     </g>
// </svg>
// `

(async () => {
  try {
    const files = await getSvgFiles('./leafs');
    for (const index in files) {
      convertToReact(files[index], index, `./components/Leafs/Leaf${index}.js`);
    }
    fs.writeFileSync('./components/Leafs/index.tsx', `
import React from 'react';
${files.map((_, index) => (`import Leaf${index} from './Leaf${index}';`)).join('\n')}

export default [${files.map((_, index) => (`<Leaf${index} />`)).join(', ')}]`);
  } catch (e) {
    console.error(e);
  }
})();
