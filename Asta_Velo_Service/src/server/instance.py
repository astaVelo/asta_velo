from flask import Flask
from flask_restplus import Api
from src.environment.instance import environment_config
from flask_cors import CORS


class Server(object):
    def __init__(self):
        """
        Initializes the flask api
        """
        self.app = Flask(__name__)
        CORS(self.app)
        self.api = Api(self.app,
                       version='1.0',
                       title='Asta-Velo API',
                       description='API to communicate with App and Database',
                       doc=environment_config["swagger-url"]
                       )

    def run(self):
        """
        Runs the flask api server
        :return:
        """
        self.app.run(
            host=environment_config["host"],
            debug=environment_config["debug"],
            port=environment_config["port"],
            threaded=True
        )


server = Server()
