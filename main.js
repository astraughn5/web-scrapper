const { Worker }  = require('worker_threads')
let workDir = __dirname + '/dbWorker.js'

const axios = require('axios')
const cheerio = require('cheerio')
const url = 'https://www.houseplantsexpert.com/growing-belladonna-lily-plants-indoors.html'


const mainFunc = async () => {
	// fetch html data from iban website
	let res = await fetchData(url);
	if(!res.data){
	  console.log("Invalid data Obj");
	  return;
	}
	const html = res.data;
	let dataObj = {};
	// mount html page to the root element
	const $ = cheerio.load(html);
	
	const plantData = $('.table > tbody > tr')
	const plantImageUrl = $('.img-responsive').attr('src')
	const plantDescription = $('.col-sm-5 > p')
	console.log(plantImageUrl)
	dataObj.image = plantImageUrl
		//loop through all table rows and get table data
	plantData.each(function() {
	let title = $(this).find('td').text(); // get the text in all the td elements
	let newStr = title.split('\:'); // convert text (string) into an array
	
	newStr.forEach(function (item, index){
		if (index % 2 === 0){
			dataObj[item] = newStr[index + 1]
		}
	})
});
	return dataObj
}


mainFunc().then((res) => {
    // start worker
    const worker = new Worker(workDir); 
    console.log("Sending crawled data to dbWorker...");
    // send formatted data to worker thread 
    worker.postMessage(res);

    // listen to message from worker thread
    worker.on("message", (message) => {
        console.log(message)
    });
});



async function fetchData(url){
    console.log("Crawling data...")
    // make http call to url
    let response = await axios(url).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}
