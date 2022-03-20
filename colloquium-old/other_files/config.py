from datetime import timedelta


class Config(object):
    DEBUG = False
    TESTING = False
    DATABASE_URI = 'postgresql://decidio:6N1L1#b1PvmM@localhost:12345/quest'
    JWT_SECRET_KEY = 'super-secret' # Change this for production
    JWT_EXPIRATION_DELTA = timedelta(seconds=3000000)
    GOOGLE_CLIENT_ID = "445765554074-uoa1cp56olesgmb1p3j6grf9ejhjvr31.apps.googleusercontent.com"
    CAS_SERVER = 'https://shib.idm.umd.edu/shibboleth-idp/profile/'
    CAS_LOGIN_ROUTE = '/cas/login'
    CAS_AFTER_LOGIN = 'cas_secure'
    HOSTNAME = 'localhost:5000'
    HTTP_PROTOCOL = 'http'

class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    DATABASE_URI = 'postgresql://runner:test_pass@localhost:5432/nice_marmot'
