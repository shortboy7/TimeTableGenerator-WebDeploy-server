#!/bin/bash

# Define the input and output encodings
FROM_ENCODING="EUC-KR"
TO_ENCODING="UTF-8"

# Define the directory to convert files in
FILENAME="202301.csv"

# convert
if [[ -f "$FILENAME" ]]; then
    # Convert the file's encoding using iconv
    iconv -f "$FROM_ENCODING" -t "$TO_ENCODING" "$FILENAME" > "${FILENAME}.utf8"
    # Rename the converted file to overwrite the original file
    mv "${FILENAME}.utf8" "$FILENAME"
fi