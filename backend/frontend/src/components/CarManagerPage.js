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

	handleChange(event) {
		const value = event.target.value;
		const inputElementId = event.target.id;
		this.setState({
			[inputElementId]: value
		});

		console.log("set state: " + inputElementId + " to " + value);
		//console.log(this.state.makeInput);
	}

	addCar(event) {
		event.preventDefault(); // prevent page refresh

		const id = this.state.idInput;
		const make = this.state.makeInput;
		const model = this.state.modelInput;
		const seats = this.state.seatsInput;

		if (id == "error" || make == "error" || model == "error" || seats == "error") {
			console.log("Failed to add car. At least one invalid input!");
			alert("Failed to add car. At least one invalid input!")
			return;
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

	updateCar(event) {
		event.preventDefault(); // prevent page refresh

		const id = this.state.idInput;
		const make = this.state.makeInput;
		const model = this.state.modelInput;
		const seats = this.state.seatsInput;

		if (id == "error" || make == "error" || model == "error" || seats == "error") {
			console.log("Failed to update car. At least one invalid input!");
			alert("Failed to update car. At least one invalid input!");
			return;
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


	/*updateStoredFormInput(event) {
		event.preventDefault(); // prevent page refresh

		const id = event.target.idInput.value;
		const make = event.target.makeInput.value;
		const model = event.target.modelInput.value;
		const seats = event.target.seatsInput.value;

		this.setState({
			idInput: id,
			makeInput: make,
			modelInput: model,
			seatsInput: seats
		});

		console.log("updated stored form data: ")
		console.log({id, make, model, seats})
	}
	*/


	/*handlePosting(event) {
		event.preventDefault(); // prevent page refresh

		console.log("handlePosting")
		console.log(event.target.idInput.value)
		console.log(event.target.makeInput.value)
		console.log(event.target.modelInput.value)
		console.log(event.target.seatsInput.value)

		const postingData = {
			"id": event.target.idInput.value,
			"make": event.target.makeInput.value,
			"model": event.target.modelInput.value,
			"seats": event.target.seatsInput.value
		}

		postData(`/api`, postingData)	// FIXME:
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))
	}
	*/


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