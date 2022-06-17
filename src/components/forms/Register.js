import React, { useContext } from "react";
import {
	Modal,
	Button,
	Form,
	Row,
	Col,
	InputGroup,
	FormControl,
	Feedback,
	ModalTitle,
} from "react-bootstrap/";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Login from "./Login";
import axios from "../../connection/axios";
import { UserContext } from "../../context/UserContext";
const REGISTER_URL = "/dispatcher/users/register";
const LOGIN_URL = "/dispatcher/users/login";

//todo you can go from login to register but not back, then there is infinite loop because
// it creates new components again and again instead of just reference
function Register(props) {
	const navigate = useNavigate();
	const buttonStyle = {
		color: "white",
	};

	const { user, setUser } = useContext(UserContext);

	const closeAndOpen = () => {
		props.onHide();
		props.onSwap();
	};

	const [passwordShown, setPasswordShown] = useState(false);
	const [loginModalShow, setLoginModalShow] = React.useState(false); //login

	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	//validation:
	const initialValues = { username: "", password: "" };
	const [formValues, setFormValues] = useState(initialValues);
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormErrors(validate(formValues));
		setIsSubmit(true);
	};
	const handleSend = async () => {
		try {
			let registered = true;
			const response = await axios
				.post(
					REGISTER_URL,
					{
						username: formValues.username,
						password: formValues.password,
					},
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				)
				.catch((e) => {
					if (!e?.response) {
						setFormErrors({ password: "No server response." });
					} else {
						registered = false;
						if (e.response?.status >= 400 && e.response?.status <= 500) {
							setFormErrors({ password: "Missing username or password." });
						}
					}
				});

			if (registered) {
				const login = await axios
					.post(
						LOGIN_URL,
						{ username: formValues.username, password: formValues.password },
						{
							headers: { "Content-Type": "application/json" },
							withCredentials: true,
						}
					)
					.catch((e) => {
						if (!e?.response) {
							setFormErrors({ password: "No server response." });
						} else {
							if (e.response?.status === 409) {
								setFormErrors({ password: "Wrong username or password." });
							}
						}
					});
				const u = await axios
					.get("dispatcher/users/current", {
						withCredentials: true,
					})
					.then((resp) => {
						setUser(resp.data);
						sessionStorage.setItem("user", JSON.stringify(resp.data));
						console.log("user logged in " + JSON.stringify(resp.data));
					})
					.catch((e) => {
						console.log("Somethings wrong");
					});
				props.onHide();
				props.onHide();
				navigate("/");
			}
		} catch (err) {}
	};

	useEffect(() => {
		//console.log(formErrors);
		if (Object.keys(formErrors).length === 0 && isSubmit) {
			handleSend();
			setIsSubmit(false);
			setFormValues({ username: "", password: "" });
		}
	}, [formErrors]);
	const validate = (values) => {
		const errors = {};
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/i;

		//username
		if (!values.username) {
			errors.username = "Username is required!";
		} else if (values.username.length < 3) {
			errors.username = "Username must be more than 3 characters";
		}
		//password
		if (!values.password) {
			errors.password = "Password is required";
		} else if (values.password.length < 8) {
			errors.password = "Password must be more than 7 characters";
		} else if (values.password.length > 20) {
			errors.password = "Password cannot exceed more than 20 characters";
		} else if (!passwordRegex.test(values.password)) {
			errors.password =
				"This is not a valid password format! Minimum 8 characters, atleast 1 uppercase letter, atleast 1 lowercase letter, atleast 1 number";
		}
		return errors;
	};

	return (
		<>
			<Modal
				{...props}
				size="xl"
				aria-labelledby="contained-modal-title-vcenter"
				id="myModal"
				className="modal"
			>
				<Modal.Header closeButton style={{ alignItems: "flex-start" }}>
					<Modal.Body className="headerText">
						{Object.keys(formErrors).length === 0 && isSubmit ? (
							<>{<div className="success">Signed in successfully</div>}</>
						) : (
							"Join now - It's Free and Easy!"
						)}
					</Modal.Body>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit} id="modal-details">
						<Form.Group as={Row} className="mb-3" controlId="formUsername">
							<Form.Label column sm="2">
								Username
							</Form.Label>
							<Col sm="9">
								<Form.Control
									type="text"
									placeholder="Username"
									name="username"
									value={formValues.username}
									onChange={handleChange}
								/>
								<p>{formErrors.username}</p>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3" controlId="formPassword">
							<Form.Label column sm="2">
								Password
							</Form.Label>

							<Col sm="9">
								<InputGroup className="mb-3">
									<Form.Control
										//aria-describedby="basic-addon2"
										type={passwordShown ? "text" : "password"}
										placeholder="Password"
										name="password"
										value={formValues.password}
										onChange={handleChange}
									/>
									<Button
										onClick={togglePassword}
										style={{
											background: "transparent",
											color: "black",
										}}
										variant="outline-dark"
										className="eye"
									>
										{passwordShown ? <FaEyeSlash /> : <FaEye />}
									</Button>
								</InputGroup>
								<p>{formErrors.password}</p>
							</Col>
						</Form.Group>

						<Row>
							<Col xs={2}></Col>
							<Col xs={9}>
								<div className="d-grid gap-2">
									<Button
										variant="primary"
										type="submit"
										className="btn btn-outline-dark btn-secondary"
										style={buttonStyle}
										size="lg"
										onClick={handleSubmit}
									>
										Register
									</Button>
								</div>
							</Col>
						</Row>

						<Row>
							<Col xs={2}></Col>
							<Col xs={9}>
								<div
									style={{
										display: "flex",
										textAlign: "left",
										justifyContent: "left",
										paddingTop: "15px",
									}}
								>
									Already a member?
									<a className="swapSign" onClick={closeAndOpen}>
										Login!
									</a>
								</div>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
			</Modal>

			{/*<Login
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
      ></Login> */}
		</>
	);
}

export default Register;
