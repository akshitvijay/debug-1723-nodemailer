# python 3.11
# pip install aiosmtpd passlib
# run python3 local_smtp_server.py
#
from aiosmtpd.controller import Controller
from aiosmtpd.smtp import AuthResult
from passlib.hash import bcrypt

USERNAME = 'user@mail-serv1.domain.com'
PASSWORD_HASH = bcrypt.hash('Al#$A@1')

class SimpleHandler:
    async def handle_DATA(self, server, session, envelope):
        print('Message from:', envelope.mail_from)
        print('Message for:', envelope.rcpt_tos)
        print('Message data:')
        print(envelope.content.decode('utf8', errors='replace'))
        print('End of message\n')
        return '250 Message accepted for delivery'

class Authenticator:
    async def __call__(self, server, session, envelope, mechanism, auth_data):
        if mechanism == 'LOGIN':
            username, password = auth_data.login.decode(), auth_data.password.decode()
            if username == USERNAME and bcrypt.verify(password, PASSWORD_HASH):
                return AuthResult(success=True)
        return AuthResult(success=False)

if __name__ == '__main__':
    handler = SimpleHandler()
    authenticator = Authenticator()
    controller = Controller(
        handler,
        hostname='localhost',
        port=1025,
        authenticator=authenticator,
        auth_require_tls=False  # No TLS for local testing
    )
    controller.start()
    print('SMTP server with AUTH running on localhost:1025')
    input('Press Enter to stop the server...\n')
    controller.stop()
