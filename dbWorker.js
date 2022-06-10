const { parentPort } = require('worker_threads');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'plants'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        const db = client.db(dbName)
		const plantsCollection = db.collection('plantsCollection')
		parentPort.on("message", (message) => {
			console.log("Recieved data from mainWorker...");
			console.log(message)
			// store data gotten from main thread in database
			plantsCollection.insertOne(message)
			// db.collection("plants").doc(currDate).set({
			// 	rates: JSON.stringify(message)
				
			})
			// .then(result => { //not working
			// 	// send data back to main thread if operation was successful
			// 	console.log('Data saved successfully')
			// 	//parentPort.postMessage("Data saved successfully");
			// })
			// .catch((err) => console.log(err)) 
    })
	.catch(error => console.error(error))

	   
	
	
	
	
	//});