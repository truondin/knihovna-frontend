import React, { useEffect, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import axios from "../../connection/axios";
import PaginatedUsers from "./PaginatedUsers";

function Users() {
	const [users, setUsers] = useState(undefined);
	const [origUsers, setOrigUsers] = useState(undefined);
	const loadUsers = () => {
		axios
			.get("/dispatcher/users", {
				withCredentials: true,
			})
			.then((response) => {
				setUsers(response.data);
				setOrigUsers(response.data);
			});
	};
	const findUser = (input) => {
		console.log("input: " + input);
		let result = [];
		origUsers?.map((user) => {
			if (user.username.includes(input)) {
				result.push(user);
			}
		});
		setUsers(result);
		console.log(result);
	};
	useEffect(() => {
		loadUsers();
		console.log(users);
	}, []);

	const reload = () => {
		return users !== undefined ? (
			<>
				<Container style={{ paddingTop: "10vh" }}>
					<Row
						xs={3}
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "5vh",
						}}
					>
						<h2>Vyhledávání:</h2>
						<input
							id="search"
							type="search"
							onChange={(input) => {
								findUser(input.target.value);
							}}
						/>
					</Row>
					<Row xs={9}>
						<PaginatedUsers users={users} itemsPerPage={30} />
					</Row>
				</Container>
			</>
		) : (
			"Chyba připojení"
		);
	};
	useEffect(() => {
		reload();
	}, [users]);
	return reload();
}

export default Users;
