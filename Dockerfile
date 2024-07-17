### STAGE 1: Build ###
FROM httpd:2.4
COPY ./www /usr/local/apache2/htdocs/app-isp
COPY ./.htaccess /usr/local/apache2/htdocs/app-isp

# COPY ./httpd.conf /usr/local/apache2/conf/

# EXPOSE 6001
