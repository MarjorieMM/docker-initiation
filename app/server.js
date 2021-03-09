const express = require("express");
const path = require("path");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const app = express();

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use(bodyParser.json());

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.get("/get-profile", (req, res) => {
	let response = {};
	MongoClient.connect(
		"mongodb://admin:password@localhost:27017",
		(err, client) => {
			if (err) throw err;
			const db = client.db("account-users");
			const query = { userid: 1 };

			db.collection("users").findOne(query, (err, result) => {
				if (err) throw err;
				response = result;
				client.close();
				res.send(response ? response : {});
			});
		}
	);
});

app.post("/update-profile", (req, res) => {
	const userObj = req.body;
	const response = res;
	console.log("connecting to the db...");

	MongoClient.connect(
		"mongodb://admin:password@localhost:27017",
		(err, client) => {
			if (err) throw err;
			const db = client.db("account-users");
			userObj["userid"] = 1;
			const query = { userid: 1 };
			const newValues = { $set: userObj };

			console.log("succesfully connected to the account-users db");

			db.collection("users").updateOne(
				query,
				newValues,
				{ upsert: true },
				(err, res) => {
					if (err) throw err;
					console.log("succesfully updated the database");
					client.close();
					response.send(userObj);
				}
			);
		}
	);
});

app.get("/profile-picture", (req, res) => {
	const img = fs.readFileSync("profile-1.jpg");
	res.writeHead(200, { "content-type": "image/jpg" });
	res.end(img, "binary");
});

app.listen(3000, () => console.log("app listening on port 3000"));
