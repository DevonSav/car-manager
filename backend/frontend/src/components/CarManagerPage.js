import React from 'react';



function postData(url = ``, data = {name: "Sue"}) {	// FIXME:
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

export default class CarManagerPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			carList: []
		};
		this.handleSubmit = this.handleSubmit.bind(this);
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

	handleSubmit(event) {
		console.log("Submitted word: " + this.state.word)

	}

	doSomething() {
		postData(`/api`, {answer: 42})	// FIXME:
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error))
	}




	render() {

		let carDataList = <h3>ERROR, Something went wrong.</h3>;
		const { error, isLoaded, carList} = this.state;

		if (error) {
			carDataList = (
				<div>
					Error: {error.message}
				</div>
			);
		} else if (!isLoaded) {
			carDataList = (
				<div>
					Loading...
				</div>
			);
		} else {
			carDataList = (
				//<WordDetails definition={definition} usage={examples.toString()}/>
				<>
					{carList.map(car => (
						<tr className='carDataRow'>
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
						<tr>
							<th>ID</th>
							<th>Make</th>
							<th>Model</th>
							<th>Seats</th>
						</tr>
						<tr>
							<td><input className='carDataInput' id='idInput' type="text" placeholder='ID'/></td>
							<td><input className='carDataInput' id='makeInput' type="text" placeholder='Make'/></td>
							<td><input className='carDataInput' id='modelInput' type="text" placeholder='Model'/></td>
							<td><input className='carDataInput' id='seatsInput' type="text" placeholder='Seats'/></td>
						</tr>
					</table>

					<input className='action-btn' onClick={this.handleSubmit}/>
				</form>
				<br></br>
				<table>
					<tr>
						<th className='tableHeader'>ID</th>
						<th className='tableHeader'>Make</th>
						<th className='tableHeader'>Model</th>
						<th className='tableHeader'>Seats</th>
					</tr>
					{carDataList}
				</table>
			</div>
		);
	}
}