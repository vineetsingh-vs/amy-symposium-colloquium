sudo apt update && sudo apt install -y python3-venv python3-pip
pip3 install -r requirements.txt
pip3 install pylint
code --install-extension ms-python.python


sudo apt install -y postgresql
sudo -u postgres psql -c "create database quest"
sudo -u postgres psql -c "create user decidio"
sudo -u postgres psql -c "alter role decidio with password '6N1L1#b1PvmM'"
sudo -u postgres psql -c "grant CONNECT ON database quest to decidio"
sudo -u postgres psql -c "grant ALL PRIVILEGES ON database quest to decidio"

curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs
cd frontend
npm install
npm run build
cd ..

python3 run_dev_server.py --reinstall-schema
python3 run_dev_server.py --test-data
