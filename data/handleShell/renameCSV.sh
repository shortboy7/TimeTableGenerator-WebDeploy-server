#!/bin/bash
DIRECTORY="./major"

for FILENAME in "$DIRECTORY"/*
do
	NAME="$(basename $FILENAME .CSV)"
	mv ${FILENAME} "$NAME.csv";
done
