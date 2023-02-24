#!/bin/bash

# set the directory containing CSV files
csv_dir="./major"

# set the new column names
old_names=("교과과정" "학수강좌번호" "교과목명" "교원명" "요일/시간" "강의실" "학점")
new_names=("Curriculum" "CourseId" "Name" "Professor" "LectureTime" "LectureRoom" "Credit")

# loop through all CSV files in the directory

for ((i=0; i<${#new_names[@]}; i++)); do
	for file in ${csv_dir}/*
		do
		if [[ -f "$file" ]]; then
		# replace the column names in the header line
			sed "1 s_${old_names[i]}_${new_names[i]}_" "$file" > "$file.tmp"
		# overwrite the original file with the temporary file
			mv "$file.tmp" "$file"
		fi
	done
done

