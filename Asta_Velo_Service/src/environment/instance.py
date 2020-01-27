import os

"""
Defines the instance environments
"""

# Load the development "mode". Use "development" if not specified
env = os.environ.get("PYTHON_ENV", "development")

# Configuration for each environment
port = int(os.environ.get("PORT", 5000))
all_environments = {
    "development": {"port": port, "debug": True, "swagger-url": "/v1/api/swagger", "host": "localhost"},
    "production": {"port": port, "debug": False, "swagger-url": "/v1/api/swagger", "host": "0.0.0.0"}
}

# The config for the current environment
environment_config = all_environments[env]
