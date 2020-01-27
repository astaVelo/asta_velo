import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


class MailServer:

    def __init__(self, sender, password, host, port):
        self.sender = sender
        self.password = password
        self.host = host
        self.port = port
        try:
            self.server = smtplib.SMTP(self.host, self.port)
            self.server.starttls()
            self.server.login(self.sender, self.password)
        except Exception as e:
            print('Unable to connect to mailserver!')

    def destruct(self):
        self.server.close()

    def send_mail(self, recipient, subject, message):
        """
        Will send an email to the recipient
        :param recipient:
        :param subject:
        :param message:
        :param attachment:
        :return:
        """
        msg = MIMEMultipart()
        msg['From'] = self.sender
        msg['To'] = recipient
        msg['Subject'] = subject

        text = MIMEText(message, "plain")
        msg.attach(text)

        self.server.sendmail(self.sender, recipient, msg.as_string())


def create_mailserver():
    mail_server = MailServer(os.environ.get('MAIL_SENDER', 'asta_velo_test@web.de'),
                             os.environ.get('MAIL_PASSWORD', '42astavelo42'),
                             os.environ.get('MAIL_HOST', 'smtp.web.de'),
                             os.environ.get('MAIL_PORT', '587'))
    return mail_server
