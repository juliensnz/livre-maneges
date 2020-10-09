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
