#!/bin/bash


export DOCKERHUB_USER=mesosphere
export DOCKERHUB_REPO=dcosappstudio
export VERSION=1.11.rc4-1.4.0-0.0.1
export BASEIMAGE=node694
export APP_DIR=/opt/app


cd Oyster
docker build -t $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-oysterload-v$VERSION .
docker push $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-oysterload-v$VERSION 
cd ..

cd UI
docker build -t $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-ui-v$VERSION .
docker push $DOCKERHUB_USER/$DOCKERHUB_REPO:dcosappstudio-smartcity-ui-v$VERSION 
cd ..
