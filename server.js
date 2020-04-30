// server.js
// where your node app starts

const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const axios = require('axios')
const crypto = require('crypto')

const client = require('twilio')();

app.use(express.static('public'));

// Where we will receive Typeform Webhook request
app.post('/hook', bodyParser.raw({ type: 'application/json' }), function(request, response) {
  const signature = request.headers['typeform-signature']
  const isValid = verifySignature(signature, request.body.toString())

  // Check that is coming from Typeform and that the payload is signed properly
  if (!isValid) {
    throw new Error('Webhook signature is not valid, someone is faking this!');  
  }
  response.sendStatus(200) //return as quickly as possible that everything is OK to Typeform
  
  let { form_response } = JSON.parse(request.body)
  let { answers } = form_response

  let phone_number = answers.find((a) => a.type === 'phone_number') //find the answer of type phone_number
  // console.log(client)
  client.calls.create({
       url: `${process.env.APP_URL}/twilio/voice`,
       to: phone_number.phone_number,
       from: process.env.TWILIO_PHONE_NUMBER
     })
    .then(call => console.log('call created', call.sid, phone_number.phone_number))
    .catch(err => console.log('err', err));

});

// What will happen when we initiate the call
app.post('/twilio/voice', bodyParser.raw({ type: 'application/json' }), function(request, response) {
  // Set the url of the song we are going to play
  let songUrl = 'https://cdn.glitch.com/aaf3ab7a-c8df-4657-85ca-c422a7bb6e57%2Frickroll%20(online-audio-converter.com).mp3?v=1575257570918'

  const VoiceResponse = require('twilio').twiml.VoiceResponse;
  
  const twimlResponse = new VoiceResponse();
  twimlResponse.play({}, songUrl);

  // console.log(twimlResponse.toString());

  // Set the response type as XML.
  response.header("Content-Type", "text/xml");

  // Send the TwiML as the response.
  response.send(twimlResponse.toString());
})

const webhookSecret = process.env.TYPEFORM_WEBHOOK_SECRET

const verifySignature = function(receivedSignature, payload){
  const hash = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('base64')
  return receivedSignature === `sha256=${hash}`
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
