#!/bin/bash

# Install MongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt update && apt upgrade
apt install -y mongodb-org

# Install global dev deps
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt install -y python3 python3-pip python3-dev nginx nodejs
npm install -g bower gulp-cli

#Update user prems
adduser landing www-data

# Create venv
pip3 install virtualenv
virtualenv env
source env/bin/activate

# Install app deps
pip3 install gunicorn
pip3 install -r requirements.txt
chown -R landing:landing ../

# Update server configs
cp conf/gunicorn.service /etc/systemd/system/
cp conf/landing.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/landing.conf /etc/nginx/sites-enabled/landing
rm /etc/nginx/sites-enabled/default

# Start server
systemctl start gunicorn
systemctl enable gunicorn

systemctl start nginx
systemctl enable nginx

systemctl unmask mongodb
systemctl start mongodb
systemctl enable mongodb
