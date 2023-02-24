#!/bin/bash

# Define the input and output encodings
FROM_ENCODING="EUC-KR"
TO_ENCODING="UTF-8"

# Define the directory to convert files in
DIRECTORY="./major"

# Loop over all files in the directory
for FILENAME in "$DIRECTORY"/*
do
    # Check if the file is a regular file (not a directory or symlink)
    if [[ -f "$FILENAME" ]]; then
        # Convert the file's encoding using iconv
        iconv -f "$FROM_ENCODING" -t "$TO_ENCODING" "$FILENAME" > "${FILENAME}.utf8"
        # Rename the converted file to overwrite the original file
        mv "${FILENAME}.utf8" "$FILENAME"
    fi
done
