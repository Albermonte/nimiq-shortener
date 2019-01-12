//https://api.nimpool.io/user?address=NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC
//https://firebase.google.com/docs/functions/callable?hl=es-419
//https://blog.usejournal.com/build-a-serverless-full-stack-app-using-firebase-cloud-functions-81afe34a64fc
// Send data through fetch and get it without params
//https://stackoverflow.com/questions/48924462/firebase-cloud-function-looping-over-and-over-with-fetch

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true
});
const fetch = require("node-fetch");

admin.initializeApp();

const database = admin.database().ref("shorted");

// Constants commonly used
const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// https://us-central1-shortnim-eba7a.cloudfunctions.net/getData/f0QQB/deviceID
// Maybe generate my own deviceID and not use the Nimiq one because it's the same for the same PC
exports.getData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }
    const data = JSON.parse(request.body);
    const ID = data.id;

    return database.child(ID).once(
      "value",
      snapshot => {
        let data = {
          address: snapshot.val().address,
          shares: snapshot.val().shares
        };

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

exports.checkMinerID = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "GET") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }

    const data = JSON.parse(request.body);
    const ID = data.id;
    const MinerID = data.miner_id;

    return database.child(ID).once(
      "value",
      async snapshot => {
          let data = {
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
            res.status(404).json("No device with that ID found");
            return;
          }
          let sharesMined = found.shares;
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

exports.shortURL = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== "PUT") {
      return res.status(404).json({
        message: "Not allowed"
      });
    }

    /*  
        url: data.url,
        address: data.address,
        shares: data.shares
    */

    const data = JSON.parse(request.body);

    generateID = () => {
      let customID = "";
    
      for (let i = 0; i < 5; i++)
        customID += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
    
      database.child(customID).once("value", function (result) {
        if (result.val() == null) {
          submitID(customID);
        } else {
          console.info("Again");
          generateID();
        }
      });
    }

    submitID = (customID) => {
      database.child(customID).set({
        url: data.url,
        address: data.address,
        shares: data.shares
      });
    }
    res.status(200).json(false);
    return;
  });
});
