const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp()

const database = admin.database().ref('shorted')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.getItems = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if(req.method !== 'GET') {
      return res.status(404).json({
        message: 'Not allowed'
      })
    }

    let items = [];
    const params = req.url.split("/");
    const ID = params[2];
    console.log("params: "+ params[1])

    return database.child(ID).once('value', (snapshot) => {
      snapshot.forEach((item) => {
        items.push({
          id: item.key,
          items: item.val().item
        });
      });
      
      res.status(200).json(items)
    }, (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })
  })
})