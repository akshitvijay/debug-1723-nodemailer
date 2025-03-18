# DEBUG for [nodemailer issue #1723](https://github.com/nodemailer/nodemailer/issues/1723)

I debugged this [issue](https://github.com/nodemailer/nodemailer/issues/1723). Nodemailer uses the `parse` method from  `url` module.

According to urls's documentation:

> **url.parse()** uses a lenient, non-standard algorithm for parsing URL strings. It is prone to security issues such as hostname spoofing and incorrect handling of usernames and passwords. **Do not use with untrusted input.** CVEs are not issued for `url.parse()` vulnerabilities. **Use the WHATWG URL API instead.**

This lenient parsing is causing the confusion.

The native Node.js WHATWG URL API throws an error with a url like:

```
smtp://user@mail-serv1.domain.com:Al#$A@1@some.server.com:1025
```

and fails to parse correctly even for simpler strings like:

```
https://A#%3535:some$$Pass@example.com
```

The correct approach is to use URI-encoded usernames and passwords, like this:

```javascript
const username = encodeURIComponent('user@mail-serv1.domain.com');
const password = encodeURIComponent('Al#$A@');
const SMTP_URL = `smtp://${username}:${password}@some.server.com:1025`;
```

This produces a percent-encoded URL that looks like:

```
smtp://user%40mail-serv1.domain.com:Al%23%24A%40@some.server.com:1025
```

This encoding works correctly with Nodemailer on my local environment.

## How to Test Locally

To run this repository and test, use:

- Python 3.11
- Node v20

Install the necessary dependencies:

```bash
npm install nodemailer url
pip install aiosmtpd passlib
```

Then run the local SMTP server and the test script:

```bash
python3 local_smtp_server.py
node test.js
```
