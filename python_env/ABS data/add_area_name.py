import csv
import re

data_list = []


# In census2016_hihc_aus_lga_short_modified.csv, add a column "Area" and its values.
# Area is LGAName + StateName in order to query with Geocoder
with open("census2016_hihc_aus_lga_short_modified.csv", 'r') as f:
    data = csv.reader(f)
    # Cast data from object into list
    data_list = list(data)
    # At the first row, add a new column at index 0
    data_list[0].insert(0, "Area")
    # From the 2nd row to the last row
    for row in data_list[1:]:
        LGAName = re.sub(r" \(\w+\)", "", row[1]).replace("(Tas.)", "").replace("(Vic.)", "")
        StateName = row[0]
        area = LGAName + ", " + StateName
        row.insert(0, area)


# newLine='' to avoid default newline as \n
with open("census2016_hihc_aus_lga_short_modified.csv", 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data_list)
