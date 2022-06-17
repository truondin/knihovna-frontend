import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "./Carousel.css";
import axios from "../../connection/axios";
import { Container, Row } from "react-bootstrap";
import { Carousel } from "./Carousel.tsx";

function HomePage() {
	const [books, setBooks] = useState();
	const getFavorites = () => {
		axios
			.get("/dispatcher/titles/favourite")
			.then((response) => {
				setBooks(response.data);
			})
			.catch((e) => {
				console.error("Server unavailable");
			});
	};

	const [carouselData, setCarouselData] = useState([
		{
			headerText: "Loading...",
			subText: null,
			image: "https://picsum.photos/420/640",
		},
	]);
	const setData = (books) => {
		setCarouselData([
			{
				subText: books[0].author.firstName + " " + books[0].author.lastName,
				headerText: books[0].titleName,
				image: "https://placekitten.com/420/640",
				isbn: books[0].isbn,
			},
			{
				subText: books[1].author.firstName + " " + books[1].author.lastName,
				headerText: books[1].titleName,
				image: "https://picsum.photos/420/640",
				isbn: books[1].isbn,
			},
			{
				subText: books[2].author.firstName + " " + books[2].author.lastName,
				headerText: books[2].titleName,
				image: "https://baconmockup.com/420/640",
				isbn: books[2].isbn,
			},
			{
				subText: books[3].author.firstName + " " + books[3].author.lastName,
				headerText: books[3].titleName,
				image: "https://www.placecage.com/420/640",
				isbn: books[3].isbn,
			},
			{
				subText: books[4].author.firstName + " " + books[4].author.lastName,
				headerText: books[4].titleName,
				image: "https://www.stevensegallery.com/420/640",
				isbn: books[4].isbn,
			},
		]);
	};
	useEffect(() => {
		getFavorites();
	}, []);
	useEffect(() => {
		//console.log(books);
		if (books !== undefined) setData(books);
	}, [books]);
	useEffect(() => {
		reload();
	}, [carouselData]);
	const reload = () => {
		return (
			<>
				<Container style={{ minHeight: "100vh" }}>
					<Row
						xs={3}
						style={{
							paddingTop: "10vh",
							width: "100%",
							textAlign: "center",
							justifyContent: "space-evenly",
						}}
					>
						<h1
							style={{
								width: "100%",
							}}
						>
							Nejoblíbenější knihy měsíce:
						</h1>
					</Row>
					<Row xs={9} style={{ display: "flex", alignItems: "flex-end" }}>
						<Carousel
							data={carouselData}
							autoPlay={true}
							rightItem={<FaArrowRight />}
							leftItem={<FaArrowLeft />}
							animationDuration={3000}
							headerTextType="black"
							subTextType="white"
							size="large"
							style={{ paddingTop: "20vh" }}
						/>
					</Row>
				</Container>
			</>
		);
	};
	return reload();
}

export default HomePage;
