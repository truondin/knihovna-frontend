import React, { useContext, useState } from "react";
import { Container, DropdownButton, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Login from "../forms/Login";
import axios from "../../connection/axios";
import "./Menu.css";
import Register from "../forms/Register";
import { Dropdown } from "bootstrap";
function Menu() {
	const [loginModalShow, setLoginModalShow] = useState(false); //login
	const [registerModalShow, setRegisterModalShow] = useState(false); //register
	const { user, setUser } = useContext(UserContext);
	const navigate = useNavigate();
	return (
		<>
			<Navbar
				bg="dark"
				variant="dark"
				style={{
					height: "8vh",
					position: "fixed",
					width: "100vw",
					zIndex: "10",
				}}
			>
				<Container
					style={{ marginLeft: "2vh", marginRight: "2vh", maxWidth: "100%" }}
				>
					<Navbar.Brand onClick={() => navigate("/")}>
						Městská knihova
					</Navbar.Brand>
					<Nav className="me-auto">
						<Nav.Link
							onClick={() => {
								navigate("/");
							}}
						>
							Domů
						</Nav.Link>
						<Nav.Link onClick={() => navigate("/books")}>Tituly</Nav.Link>
						{user?.userType === "LIBRARIAN" ? (
							<>
								<Nav.Link onClick={() => navigate("/userlist")}>
									Uživatelé
								</Nav.Link>
								<Nav.Link onClick={() => navigate("/books/new")}>
									Přidat titul
								</Nav.Link>
								<Nav.Link onClick={() => navigate("/authors/new")}>
									Přidat autora
								</Nav.Link>
								<Nav.Link onClick={() => navigate("/genres/new")}>
									Přidat žánr
								</Nav.Link>
								<Nav.Link onClick={() => navigate("/authors/delete")}>
									Odstranit Autora
								</Nav.Link>
								<Nav.Link onClick={() => navigate("/genres/delete")}>
									Odstranit Žánr
								</Nav.Link>
							</>
						) : (
							""
						)}
					</Nav>
					<Login
						show={loginModalShow}
						onHide={() => setLoginModalShow(false)}
						onSwap={() => {
							setRegisterModalShow(true);
						}}
					/>
					<Register
						show={registerModalShow}
						onHide={() => {
							setRegisterModalShow(false);
						}}
						onSwap={() => {
							setLoginModalShow(true);
						}}
					/>

					{user.username ? (
						<Nav className="tvojemama" style={{ marginLeft: "auto" }}>
							<Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
							<Nav.Link
								icon="user"
								onClick={() => {
									sessionStorage.clear();
									setUser(null);
									axios
										.get("dispatcher/users/logout", { withCredentials: true })
										.then(setUser(React.createContext(null)));
								}}
							>
								Logout
							</Nav.Link>
						</Nav>
					) : (
						<Nav className="tvojemama" style={{ marginLeft: "auto" }}>
							<Nav.Link onClick={() => setLoginModalShow(true)}>Login</Nav.Link>
							<Nav.Link onClick={() => setRegisterModalShow(true)}>
								Register
							</Nav.Link>
						</Nav>
					)}
				</Container>
			</Navbar>
		</>
	);
}

export default Menu;
