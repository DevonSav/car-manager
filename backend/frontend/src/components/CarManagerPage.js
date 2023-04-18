import React from 'react';


function postData(url = ``, data = {make: "ERROR"}) {	// FIXME:
	// Default options are marked with *
	return fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	})
	.then(response => response.json()); // parses response to JSON
}

function putData(url = ``, data = {make: "ERROR"}) {	// FIXME:
	// Default options are marked with *
	return fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	})
	.then(response => response.json()); // parses response to JSON
}

export default class CarManagerPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			carList: [],
			wasInputError: false,
			idInput: "error",
			makeInput: "error",
			modelInput: "error",
			seatsInput: "error"
		};
		this.handleChange = this.handleChange.bind(this);
		this.addCar = this.addCar.bind(this);
		this.updateCar = this.updateCar.bind(this);
		this.refreshCarList = this.refreshCarList.bind(this);
	}

	componentDidMount() {
		fetch("/api")
			.then(res => res.json())
			.then((result) => {
					this.setState({
						isLoaded: true,
						carList: result
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

	refreshCarList() {
		fetch("/api")
			.then(res => res.json())
			.then((result) => {
					this.setState({
						isLoaded: true,
						carList: result
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
	 * Attempts to add a car by posting to the api.
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

		postData(`/api`, newCarData)	// FIXME:
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))
	}

	/**
	 * Attempts to update a car by running a put command on the api.
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

		putData(`/api`, newCarData)	// FIXME:
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))
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
				<form>	{/*onSubmit={this.updateStoredFormInput}		onSubmit={}*/}
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

					{/*<input type='submit' value="Post" className='action-btn' onClick={this.handlePosting}/>*/}
					{/*<input type='submit' value="Confirm" className='action-btn'/>*/}
					<button className='action-btn' onClick={this.addCar}>Add Car</button>
					<button className='action-btn' onClick={this.updateCar}>Update Car</button>
				</form>

				<br></br>
				<button className='action-btn' onClick={this.refreshCarList}>Refresh List</button>
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