echo $PWD
# cp $PWD/target/*.jar /home/fuentes/target
cd /home/fuentes/folder-app-isp
echo $PWD
docker build -t app-isp:1.0.1 .
