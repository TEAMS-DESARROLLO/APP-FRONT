echo $PWD
# cp $PWD/target/*.jar /home/fuentes/target
cd /home/fuentes/mcsv-front
echo $PWD
docker build -t app-follow:1.0.1 .
