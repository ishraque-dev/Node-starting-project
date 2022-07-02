const fs = require('fs');
const http = require('http');
const url = require('url');
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avocado : ${textIn}\n Created on ${new Date(
//   new Date().getTime()
// ).toUTCString()}`;

// fs.writeFileSync('./txt/out-put.txt', textOut);

// non-blocking asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         './txt/final-file.txt',
//         `${data2}\n${data3},"utf-8"`,
//         (err) => {
//           console.log('Your file has been successfully created');
//         }
//       );
//     });
//   });
// });
// console.log('Will read file...');
// Creating a simple server

const replaceTemplate = (tem, product) => {
  let outPut = tem
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%DESCRIPTION%}/g, product.description)
    .replace(/{%ID%}/g, product.id);

  if (!product.organic)
    outPut = outPut.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return outPut;
};

const templateOverview = fs.readFileSync(
  './templates/template-overview.html',
  'utf-8'
);
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const templateProduct = fs.readFileSync(
  './templates/template-product.html',
  'utf-8'
);
//JSON
const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const pathName = req.url;
  //Overview page
  if (pathName == '/' || pathName === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');

    const outPut = templateOverview.replace('{%PRODUCTCARD%}', cardHtml);

    res.end(outPut);
  }
  //Product page
  else if (pathName === '/products') {
    res.end('This is the products page');
  }
  //API
  else if (pathName === '/api') {
    res.writeHead(200, {
      ContentType: 'application/json',
    });
    res.end(data);
  }
  //Not found
  else {
    res.end('Not found');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
