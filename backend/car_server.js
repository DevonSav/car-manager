const express = require('express');
const helmet = require("helmet");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(helmet());

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
 * @param {int} carId
 * @returns If ID already in use returns true, otherwise returns false.
 */
function hasCarId(carArray, carId) {
    // Loop through all cars comparing the ID
    for (const carItem of carArray) {
        if (carItem.id == carId) {
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
 * @param {JSON} carJson
 */
function addCarDirect(carJson) {
    addCar(carJson.id, carJson.make, carJson.model, carJson.seats);
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
    const carJsonString = `{"id":${id},"make":"${make}","model": "${model}","seats":${seats}}`;

    // Parse to make sure formatting is correct
    const carJson = JSON.parse(carJsonString);
    cars.push(carJson);

    // Write to the file
    fs.writeFileSync('cars.json', JSON.stringify(cars, null, "\t"));
}

/**
 * Creates a new car from posted json data (in the request body).
 */
app.post('/api', (request, response) => {
    console.log('Post body: ' + JSON.stringify(request.body));	// FIXME: JSON posted from the body

    const cars = getCars();
    const postedJson = request.body;

    // ID conflict
    if (hasCarId(cars, postedJson.id)) {
        // Early return
        const errorMessage = `Error! Car already exists with ID ${postedJson.id}.`;
        response.send({errMsg: errorMessage});
        return;
    }

    // For auto ID
    if (postedJson.id == -1) {
        let validId = false;
        let newId = cars.length;	// last array position + 1

        while (!validId) {
            if (hasCarId(cars, newId)) {
                newId += 1;
            } else {
                addCar(newId, postedJson.make, postedJson.model, postedJson.seats);
                const responseMessage = `Success. Added car with auto ID ${newId}.`;
                response.send({msg: responseMessage});
                validId = true;
                return;
            }
        }
    }

    // ID was valid
    addCarDirect(postedJson);
    const responseMessage = `Success. Added car with ID ${postedJson.id}.`;
    response.send({msg: responseMessage});
});


/**
 * Removes the car with matching ID from the file.
 * Returns true if sucessful, otherwise returns false.
 * @param {int} id
 * @returns true if sucessful, otherwise returns false.
 */
function deleteCar(carId) {
    const cars = getCars();

    // Loop through all cars comparing the ID
    for (const carItem of cars) {
        if (carItem.id == carId) {
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
 * Takes json data that has an ID.
 */
app.delete('/api', (request, response) => {
    console.log('Delete param: ' + request.params.carID);

    const cars = getCars();
    const targetId = parseInt(request.body.id);

    // Missing ID
    if (!hasCarId(cars, targetId)) {
        const errorMessage = `Error! No car exists with ID ${targetId}.`;
        response.send({errMsg: errorMessage});
        return;
    }

    // ID was valid, remove car from file
    deleteCar(targetId);
    const responseMessage = `Success. Removed car with ID ${targetId}.`;
    response.send({msg: responseMessage});
});

/**
 * Updates an existing car in the file.
 * Returns true if sucessful, otherwise returns false.
 * @param {int} carId Target car to update.
 * @param {String} newModel The new model name.
 * @param {int} newSeats The new number of seats.
 * @returns true if sucessful, otherwise returns false.
 */
function updateCar(carId, newModel, newSeats) {
    const cars = getCars();

    // Loop through all cars comparing the ID
    for (const carItem of cars) {
        if (carItem.id == carId) {
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
    const targetId = parseInt(postedData.id);

    // Missing ID
    if (!hasCarId(cars, targetId)) {
        const errorMessage = `Error! No car exists with ID ${targetId}.`;
        response.send({errMsg: errorMessage});

        return;
    }

    const newModel = postedData.model;
    const newSeats = postedData.seats;

    // Check that any data was actually provided
    if (newModel == undefined && newSeats == undefined) {
        const errorMessage = `Error missing data! No updates specified.`;
        response.send({errMsg: errorMessage});

        return;
    }

    // ID was valid and at least one value was defined
    updateCar(targetId, newModel, newSeats);
    const responseMessage = `Success. Updated car with ID ${targetId}.`;
    response.send({msg: responseMessage});
});


app.listen(PORT, ()=>console.log('Listening engaged'));

/** REFERENCES
 * https://stackoverflow.com/questions/3515523/javascript-how-can-i-generate-formatted-easy-to-read-json-straight-from-an-obje
 * https://stackoverflow.com/questions/9830650/how-to-stop-a-javascript-for-loop
 * https://stackoverflow.com/questions/14901245/how-to-style-a-json-block-in-github-wiki
*/
