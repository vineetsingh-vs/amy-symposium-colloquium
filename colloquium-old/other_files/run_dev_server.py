import sys
from sqlalchemy import create_engine
from tests.test_data import create_test_data, delete_all_data
from backend.models.base import Base
from backend.decidio import app
from backend.db import session_scope
import csv
from backend.models.tags_schema import Tag

def create_system_data(): 
    tags_list=[]
    with open("tags.txt") as fd:
        tags_list = list(csv.reader(fd))
    with session_scope() as session:
        for tag in tags_list:
            result = session.query(Tag).filter(
                Tag.name==tag[0]).first()
            if result == None:
                session.add(Tag(name=tag[0]))

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test-data":
        delete_all_data()
        create_test_data()
        exit()
    elif len(sys.argv) > 1 and sys.argv[1] == "--reinstall-schema":
        conn = app.config["DATABASE_URI"]
        engine = create_engine(conn, echo=False)
        Base.metadata.reflect(engine)
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        exit()
    
    with app.app_context():
        create_system_data()

    app.run()
   
