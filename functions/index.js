//https://api.nimpool.io/user?address=NQ65 GS91 H8CS QFAN 1EVS UK3G X7PL L9N1 X4KC
//https://firebase.google.com/docs/functions/callable?hl=es-419
//https://blog.usejournal.com/build-a-serverless-full-stack-app-using-firebase-cloud-functions-81afe34a64fc

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp()

const database = admin.database().ref('shorted')

exports.getData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(404).json({
        message: 'Not allowed'
      })
    }

    const params = req.url.split("/");
    const ID = params[1];

    return database.child(ID).once('value', (snapshot) => {
      let data = {
        address: snapshot.val().address,
        shares: snapshot.val().shares
      }

      res.status(200).json(data)
    }, (error) => {
      res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      })
    })
  })
})