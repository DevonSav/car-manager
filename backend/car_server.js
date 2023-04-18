const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

/**
 * Returns car data from the json file, and creates a new file if it doesn't exist.
 * @returns Car data as json.
 */
function getCars() {
	try {
		const content = fs.readFileSync('cars.json');
		return JSON.parse(content);
	} catch(e) {
		// file non-existent
		fs.writeFileSync('cars.json', '[]');
		return [];
	}
}

/**
 * Checks if a given car ID is already present in the car data array.
 * @param {JSON[]} carArray
 * @param {int} carID
 * @returns If ID already in use returns true, otherwise returns false.
 */
function hasCarID(carArray, carID) {
	// Loop through all cars comparing the ID
	for (const carItem of carArray) {
		if (carItem.id == carID) {
			// ID's match, stop the loop
			return true;
		}
	}
	return false;
}

/**
 * Base function - returns json array of cars
 */
app.get('/api', (req, resp) => {
	const cars = getCars();
	resp.send(cars);
})


/**
 * Adds a car to the file directly using the provided json.
 * @param {JSON} carJSON
 */
function addCarDirect(carJSON) {
	addCar(carJSON.id, carJSON.make, carJSON.model, carJSON.seats);
}

/**
 * Adds a car to the file using the provided information.
 * No safety checks as it assumes valid data is provided.
 * @param {int} id
 * @param {String} make
 * @param {String} model
 * @param {int} seats
 */
function addCar(id, make, model, seats) {
	const cars = getCars();
	const carStr = `{"id":${id},"make":"${make}","model": "${model}","seats":${seats}}`;

	// Parse to make sure formatting is correct
	const carJSON = JSON.parse(carStr);
	cars.push(carJSON);

	// Write to the file
	fs.writeFileSync('cars.json', JSON.stringify(cars, null, "\t"));
}

/**
 * Creates a new car from posted json data (in the request body).
 */
app.post('/api', (request, response) => {
	console.log('Post body: ' + JSON.stringify(request.body));	// FIXME: JSON posted from the body

	const cars = getCars();
	const postedJSON = request.body;

	// ID conflict
	if (hasCarID(cars, postedJSON.id)) {
		// Early return
		const errMsg = `Error! Car already exists with ID ${postedJSON.id}.`;
		response.send({errMsg});
		return;
	}

	// For auto ID
	if (postedJSON.id == -1) {
		let validID = false;
		let newID = cars.length;	// last array position + 1

		while (!validID) {
			if (hasCarID(cars, newID)) {
				newID += 1;
			} else {
				addCar(newID, postedJSON.make, postedJSON.model, postedJSON.seats);
				const msg = `Success. Added car with auto ID ${newID}.`;
				response.send({msg});
				validID = true;
				return;
			}
		}
	}

	// ID was valid
	addCarDirect(postedJSON);
	const msg = `Success. Added car with ID ${postedJSON.id}.`;
	response.send({msg});
});



/**
 * Removes the car with matching ID from the file.
 * Returns true if sucessful, otherwise returns false.
 * @param {int} id
 * @returns true if sucessful, otherwise returns false.
 */
function deleteCar(carID) {
	const cars = getCars();

	// Loop through all cars comparing the ID
	for (const carItem of cars) {
		if (carItem.id == carID) {
			// ID's match so get item index
			const i = cars.indexOf(carItem);
			// Remove the item and rejoin the array
			cars.splice(i, 1);
			// Write the new file contents
			fs.writeFileSync('cars.json', JSON.stringify(cars, null, "\t"));
			return true;
		}
	}

	// No match found; shouldn't happen
	console.log('Error deleting car from file!')
	return false;
}

/**
 * Deletes a car matching the provided ID.
 * Use DELETE at: api/[CAR ID HERE]
 * No body should be provided.
 */
app.delete('/api/:carID', (request, response) => {
	console.log('Delete param: ' + request.params.carID);	// FIXME:

	const cars = getCars();
	const targetID = parseInt(request.params.carID);

	// Missing ID
	if (!hasCarID(cars, targetID)) {
		const errMsg = `Error! No car exists with ID ${targetID}.`;
		response.send({errMsg});
		return;
	}

	// ID was valid, remove car from file
	deleteCar(targetID);
	const msg = `Success. Removed car with ID ${targetID}.`;
	response.send({msg});
});

/**
 * Updates an existing car in the file.
 * Returns true if sucessful, otherwise returns false.
 * @param {int} carID Target car to update.
 * @param {String} newModel The new model name.
 * @param {int} newSeats The new number of seats.
 * @returns true if sucessful, otherwise returns false.
 */
function updateCar(carID, newModel, newSeats) {
	const cars = getCars();

	// Loop through all cars comparing the ID
	for (const carItem of cars) {
		if (carItem.id == carID) {
			// ID's match so update the item
			if (newModel != undefined) {
				carItem.model = newModel;
			} else {
				console.log(`Warning: New model undefined. Leaving as [${carItem.model}].`);
			}
			if (newSeats != undefined) {
				carItem.seats = newSeats;
			} else {
				console.log(`Warning: New seat number undefined. Leaving as [${carItem.seats}].`);
			}
			// Write the new file contents
			fs.writeFileSync('cars.json', JSON.stringify(cars, null, "\t"));
			return true;
		}
	}

	// No match found; shouldn't happen
	console.log('Error updating car in file!')
	return false;
}

/**
 * Updates an existing car.
 * Takes json data that has an ID and either a new model, new seat number, or both.
 */
app.put('/api', (request, response) => {
	console.log(`Put body: ${JSON.stringify(request.body)}`);
	const postedData = request.body;

	const cars = getCars();
	const targetID = parseInt(postedData.id);

	// Missing ID
	if (!hasCarID(cars, targetID)) {
		const errMsg = `Error! No car exists with ID ${targetID}.`;
		response.send({errMsg});

		return;
	}

	const newModel = postedData.model;
	const newSeats = postedData.seats;

	// Check that any data was actually provided
	if (newModel == undefined && newSeats == undefined) {
		const errMsg = `Error missing data! No updates specified.`;
		response.send({errMsg});

		return;
	}

	// ID was valid and at least one value was defined
	updateCar(targetID, newModel, newSeats);
	const msg = `Success. Updated car with ID ${targetID}.`;
	response.send({msg});
});


app.listen(port, ()=>console.log('Listening engaged'));

/** REFERENCES
 * https://stackoverflow.com/questions/3515523/javascript-how-can-i-generate-formatted-easy-to-read-json-straight-from-an-obje
 * https://stackoverflow.com/questions/9830650/how-to-stop-a-javascript-for-loop
 * https://stackoverflow.com/questions/14901245/how-to-style-a-json-block-in-github-wiki
*/
