//https://blog.usejournal.com/build-a-serverless-full-stack-app-using-firebase-cloud-functions-81afe34a64fc

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true
});
const fetch = require("node-fetch");

admin.initializeApp();

const database = admin.database().ref("shorted");

// Constants commonly used
const possible =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Get required Data to start mining
exports.getData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }
    const data = req.body;
    const ID = data.id;

    // Read from DB
    return database.child(ID).once(
      "value",
      snapshot => {
        // If no data found for ID send 404
        if (snapshot.val() == null) {
          res.status(404).json({
            message: `No ID found`
          });
          return;
        }
        
        let data = {
          address: snapshot.val().address,
          shares: snapshot.val().shares
        };

        // Send addres and shares as answer in JSON format
        res.status(200).json(data);
      },
      error => {
        res.status(error.code).json({
          message: `Something went wrong. ${error.message}`
        });
      }
    );
  });
});

// Ask the pool API if they have a miner with our ID mining for the address
exports.checkMinerID = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }

    // Too lazy to change the name
    const data1 = req.body;
    const ID = data1.id;
    const MinerID = data1.miner_id;

    return database.child(ID).once(
      "value",
      async snapshot => {
          // If no data found for ID send 404
          if (snapshot.val() == null) {
            res.status(404).json({
              message: `No ID found`
            });
            return;
          }

          const data = {
            address: snapshot.val().address.replace(/\s+/g, ""),
            shares: snapshot.val().shares,
            url: snapshot.val().url
          };

          let NimpoolInfo = await fetch(
            `https://api.nimpool.io/user?address=${data.address}`
          );
          NimpoolInfo = await NimpoolInfo.json();
          NimpoolInfo = NimpoolInfo.result;
          let found = NimpoolInfo.devices.find(element => {
            return element.device_id == MinerID;
          });
          if (found == null) {
            // Could happen if we make the request too fast
            res.status(404).json("No device with that ID found");
            return;
          }
          let sharesMined = found.shares;
          // The pool has told us how many shares our MinerID has mined
          // Now check if they are enough and send the url
          if (sharesMined >= data.shares) res.status(200).json(data.url);
          else res.status(200).json(false);
        },
        error => {
          res.status(error.code).json({
            message: `Something went wrong. ${error.message}`
          });
        }
    );
  });
});

// Gets a long URL, store it on the DB with the parameters given by the user and gives back the ID of the shorted URL
exports.shortURL = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }
    /*  Prototype

        url: data.url,
        address: data.address,
        shares: data.shares
    */
    const data = req.body;
    let customID = generateID(data);
    res.status(200).json(customID);
  });
});

function generateID(data) {
  let customID = "";

  for (let i = 0; i < 5; i++)
    customID += possible.charAt(Math.floor(Math.random() * possible.length));

  database.child(customID).once("value", function (result) {
    //Check if the ID is already on the DB
    if (result.val() == null) {
      // If it's not, store it
      database.child(customID).set({
        url: data.url,
        address: data.address,
        shares: data.shares
      });
    } else {
      console.info("Again");
      generateID(data);
    }
  });
  // And send it
  return customID;
}