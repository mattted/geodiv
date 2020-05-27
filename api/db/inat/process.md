# CSVKIT
Process the csv file with csvkit to trim the size as much as possible (eliminate unnecessary columns and rows)
* csvcut -n to get column names/numbers
* csvcut -c columns file.csv | csvgrep -c col_to_filter_by -r 'val' > new_file.csv
Generate an sql statement for the creation of a table with the csv file headers (need to include val rows so command can determine data type)
* head -n 20 new_file.csv | csvsql --no-constraints --tables table_to_create > table_creation.sql
Create table using sql statement created above (inside database in psql)
Use psql \COPY to import csv file
* COPY table_to_copy_to FROM 'csv_to_copy_from.csv' delimiter ',' csv header;
Records now in database table
