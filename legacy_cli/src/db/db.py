import pymysql
from sqlalchemy import create_engine

def get_connection():
    return pymysql.connect(host="localhost", user="root", passwd="", database="hotel")

def get_engine():
    return create_engine("mysql+pymysql://root:@localhost/hotel")
