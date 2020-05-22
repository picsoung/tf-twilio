Typeform to Twilio 
=================

This example was built to demo on stage at [HackUPC 19](https://hackupc.com).
The purpose is to make someone fill a typeform leaving their phone number and call them right away playing a song.
It relies on Typeform webhook and Twilio API.

Pre-requisites
=====
A Twilio account, create one [here](http://twilio.com)

A Typeform account, create one [here](https://www.typeform.com/?utm_source=glitch.com&utm_campaign=devrel_projects&utm_medium=referral&utm_content=tf-hackupc19)

A typeform you want to use to test with a phone number field

How to install
=====

1. Remix this project, [here](https://glitch.com/edit/#!/remix/tf-webtolead)
2. In `.env` place your Twilio Credentials and the secret you want up to sign Typeform webhook request
3. Deploy your function 
4. Go to your Typeform Admin Dashboard and select your lead generation form
5. Under `Connect` menu select `Webhook`
6. Paste following URL `YOUR FUNCION URL/hook`, turn the toggle on.
7. Click test, it should show a green check if everything is OK.

How does it work
=====

Typeform sends a webhook notification when a new response is submitted.

1. `POST` request sent to `/hook`
2. Extract the answers from payload
3. Extract the phone number and place a call using Twilio

Made by [Typeform](https://developer.typeform.com)
-------------------

\ ゜o゜)ノ
