import csv

data_list = []


# In census2016_hihc_aus_lga_short_modified.csv, add a column "LGA name" and its values.
# First add a column name in census2016_hihc_aus_lga_short_modified.csv,
# then use its LGA code to query ABS_C16_T13_LGA_06102018111230655.csv,
# which returns a matched LGA name if the LGA code is matched. 

with open("census2016_hihc_aus_lga_short_modified.csv", 'r') as f:
    data = csv.reader(f)
    # Cast data from object into list
    data_list = list(data)
    # At the first row, add a new column at index 0
    data_list[0].insert(0, "LGA Name")

    with open("ABS_C16_T13_LGA_06102018111230655.csv", 'r', encoding="utf-8") as f_lga_name:
        data_names = csv.reader(f_lga_name)
        data_names_list = list(data_names)
        # Working on rows from 2nd to the last rows
        for row_name in data_names_list[1:]:
            lga_code = row_name[10]  # 74550
            lga_name = row_name[11]  # Victoria Daly (R)

            for row in data_list[1:]:
                # Remove the word LGA to display only LGA code e.g. 89799
                row[0] = row[0].replace('LGA', '')
                code = row[0]
                # Find matched lga code from both csv files and add LGA name
                if code == lga_code:
                    row.insert(0, lga_name)
        

# newLine='' to avoid default newline as \n
with open("census2016_hihc_aus_lga_short_modified.csv", 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data_list)
