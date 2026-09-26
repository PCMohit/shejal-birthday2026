# Reply Form Setup

## 1. Open `config.js`

You will see:

```js
replyEndpoint: "https://formsubmit.co/YOUR_EMAIL@example.com"
```

Replace `YOUR_EMAIL@example.com` with the email address where you want Shejal's replies to arrive.

Example:

```js
replyEndpoint: "https://formsubmit.co/yourname@gmail.com"
```

## 2. Upload the whole folder to GitHub

Keep `config.js` in the same folder as `index.html`.

## 3. First form submission

FormSubmit says the first submission triggers an email asking you to confirm the target email address. Confirm it so future submissions can be delivered.

## 4. Privacy / limitations

The reply form sends the entered fields to the external form service. Tell the person using the form not to enter passwords, OTPs, financial data, or other sensitive information.

The website also uses a hidden iframe so the page does not navigate away during submission.
