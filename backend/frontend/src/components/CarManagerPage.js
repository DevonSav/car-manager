import React from 'react';

export default class CarManagerPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			carList: []
		};
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
				<ul>
					{carList.map(car => (
							<li key={car.id}>
								{car.make} {car.model} {car.seats}
							</li>
						))
					}
				</ul>
			);
		}

		return (
			<div className="car-manager">
				<h2 id="main-heading">Car Manager</h2>
				<form>
					<table>
						<tr>
							<th>ID</th>
							<th>Make</th>
							<th>Model</th>
							<th>Seats</th>
						</tr>
						<tr>
							<td><input id='idInput' type="text" placeholder='ID'/></td>
							<td><input id='makeInput' type="text" placeholder='Make'/></td>
							<td><input id='modelInput' type="text" placeholder='Model'/></td>
							<td><input id='seatsInput' type="text" placeholder='Seats'/></td>
						</tr>
					</table>

					<input type="submit" value="Submit" className='submit-btn'/>
				</form>
				<br></br>
				{carDataList}
			</div>
		);
	}
}