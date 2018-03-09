#!/bin/bash


export DOCKERHUB_USER=mesosphere
export DOCKERHUB_REPO=dcosappstudio
export VERSION=1.11.rc4-1.4.1-0.0.1
export BASEIMAGE=node694
export APP_DIR=/opt/app


cd LoadGenerator
docker build -t $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-loadgenerator-v$VERSION .
docker push $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-loadgenerator-v$VERSION 
cd ..

cd UI
docker build -t $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-ui-v$VERSION .
docker push $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-ui-v$VERSION 
cd ..

