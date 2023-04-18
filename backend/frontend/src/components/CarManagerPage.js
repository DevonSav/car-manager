import React from 'react';

/**
 * Send a POST at the provided url using the json data as the body.
 * @param {*} url Target page.
 * @param {*} data The JSON data.
 */
function dataPost(url = ``, data = {make: "ERROR"}) {
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	})
	.then(response => response.json()); // parses response to JSON
}

/**
 * Send a PUT at the provided url using the json data as the body.
 * @param {*} url Target page.
 * @param {*} data The JSON data.
 */
function dataPut(url = ``, data = {make: "ERROR"}) {
	return fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json()); // parses response to JSON
}

/**
 * Send a DELETE at the provided url using the json data as the body.
 * @param {*} url Target page.
 * @param {*} data The JSON data.
 */
function dataDelete(url = ``, data = {make: "ERROR"}) {
	return fetch(url, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json()); // parses response to JSON
}

/**
 * Displays input fields for adding, updating and deleting cars.
 * Also displays a list of all current cars.
 */
export default class CarManagerPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			carList: [],
			idInput: "error",
			makeInput: "error",
			modelInput: "error",
			seatsInput: "error"
		};
		this.handleChange = this.handleChange.bind(this);
		this.addCar = this.addCar.bind(this);
		this.updateCar = this.updateCar.bind(this);
		this.deleteCar = this.deleteCar.bind(this);
		this.refreshCarList = this.refreshCarList.bind(this);
	}

	/**
	 * Fetches the car data using the api and updates the state variables accordingly.
	 */
	refreshCarList() {
		fetch("/api")
			.then(res => res.json())
			.then((result) => {
					this.setState({
						isLoaded: true,
						carList: result.sort((a, b) => a.id - b.id)
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
	}

	/**
	 * Runs automatically.
	 */
	componentDidMount() {
		this.refreshCarList();
	}

	/**
	 * Gets the input value and sets the corresponding state variable.
	 */
	handleChange(event) {
		const value = event.target.value;
		const inputElementId = event.target.id;
		this.setState({
			[inputElementId]: value
		});
	}

	/**
	 * Attempts to add a car by sending a POST command.
	 * @returns If an error occurs returns 'false'.
	 */
	addCar(event) {
		event.preventDefault(); // prevent page refresh

		const id = this.state.idInput;
		const make = this.state.makeInput;
		const model = this.state.modelInput;
		const seats = this.state.seatsInput;

		if (id == "error" || make == "error" || model == "error" || seats == "error") {
			console.log("Failed to add car. At least one invalid input!");
			alert("Failed to add car. At least one invalid input!")
			return false;
		}

		const newCarData = {
			"id": id,
			"make": make,
			"model": model,
			"seats": seats
		}

		dataPost(`/api`, newCarData)
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))

		// Update the displayed list
		this.refreshCarList();
	}

	/**
	 * Attempts to update a car by sending a PUT command.
	 * @returns If an error occurs returns 'false'.
	 */
	updateCar(event) {
		event.preventDefault(); // prevent page refresh

		const id = this.state.idInput;
		const make = this.state.makeInput;
		const model = this.state.modelInput;
		const seats = this.state.seatsInput;

		if (id == "error" || make == "error" || model == "error" || seats == "error") {
			console.log("Failed to update car. At least one invalid input!");
			alert("Failed to update car. At least one invalid input!");
			return false;
		}

		const newCarData = {
			"id": id,
			"make": make,
			"model": model,
			"seats": seats
		}

		dataPut(`/api`, newCarData)
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))

		// Update the displayed list
		this.refreshCarList();
	}

	/**
	 * Attempts to delete a car by sending a DELETE command.
	 * @returns If an error occurs returns 'false'.
	 */
	deleteCar(event) {
		event.preventDefault(); // prevent page refresh

		const id = this.state.idInput;

		if (id == "error") {
			console.log("Failed to add car. Invalid ID input!");
			alert("Failed to delete car. Invalid ID input!")
			return false;
		}

		const carData = {
			"id": id
		}

		dataDelete(`/api`, carData)
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))

		// Update the displayed list
		this.refreshCarList();
	}

	render() {
		let carDataList = <h3>ERROR, Something went wrong.</h3>;
		const { error, isLoaded, carList} = this.state;

		if (error) {
			carDataList = (<tr><td>Error: {error.message}</td></tr>);
		} else if (!isLoaded) {
			carDataList = (<tr><td>Loading...</td></tr>);
		} else {
			carDataList = (
				//<WordDetails definition={definition} usage={examples.toString()}/>
				<>
					{carList.map(car => (
						<tr key={car.id} className='carDataRow'>
							<td className='carTableData'>{car.id}</td>
							<td className='carTableData'>{car.make}</td>
							<td className='carTableData'>{car.model}</td>
							<td className='carTableData'>{car.seats}</td>
						</tr>
						))
					}
				</>
			);
		}

		return (
			<div className="car-manager">
				<h2 id="main-heading">Car Manager</h2>
				<form>
					<table className='inputTable'>
						<thead>
							<tr>
								<th>ID</th>
								<th>Make</th>
								<th>Model</th>
								<th>Seats</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><input className='carDataInput' id='idInput' type="text" placeholder='ID' onChange={e => this.handleChange(e)}/></td>
								<td><input className='carDataInput' id='makeInput' type="text" placeholder='Make' onChange={e => this.handleChange(e)}/></td>
								<td><input className='carDataInput' id='modelInput' type="text" placeholder='Model'	onChange={e => this.handleChange(e)}/></td>
								<td><input className='carDataInput' id='seatsInput' type="text" placeholder='Seats'	onChange={e => this.handleChange(e)}/></td>
							</tr>
						</tbody>
					</table>

					<button id='add-car-btn' className='action-btn' onClick={this.addCar}>Add Car</button>
					<button id='update-car-btn' className='action-btn' onClick={this.updateCar}>Update Car</button>
					<button id='delete-car-btn' className='action-btn' onClick={this.deleteCar} title='WARNING: No confirmation, activates instantly!'>Delete Car</button>
				</form>

				<br></br>
				<button id='refresh-btn' className='action-btn' onClick={this.refreshCarList}>Refresh List</button>
				<table>
					<thead>
						<tr>
							<th className='tableHeader'>ID</th>
							<th className='tableHeader'>Make</th>
							<th className='tableHeader'>Model</th>
							<th className='tableHeader'>Seats</th>
						</tr>
					</thead>
					<tbody>
						{carDataList}
					</tbody>
				</table>
			</div>
		);
	}
}

/** REFERENCES
 * Comment from gaiazov: https://stackoverflow.com/questions/48492577/how-to-sort-json-data-in-reactjs
 */