import googlemaps
import csv
import json

with open('../../auth.json') as auth_data:
    authData = json.load(auth_data)

# Supply google map api key
gmaps = googlemaps.Client(key=authData["GoogleMapApiKey"])


data_list = []

# Filter only New South Wales, then making Geocoding API calls
with open("census2016_hihc_aus_lga_short_modified.csv", 'r') as f:
    data = csv.reader(f)
    # Cast data from object into list
    data_list = list(data)
    # At the first row, add two columns at index 0 and 1
    data_list[0].insert(0, "Lat")
    data_list[0].insert(1, "Lng")
    # From the 2nd to the last row, add values
    for row in data_list[1:]:
        try:
            if row[1] == 'New South Wales':
                # Geocoding the value of Area field into lat and lng
                geocode_result = gmaps.geocode(row[0])
                lat = geocode_result[0]['geometry']['location']['lat']
                lng = geocode_result[0]['geometry']['location']['lng']
                # Insert geocode results
                row.insert(0, lat)
                row.insert(1, lng)
            else:
                # Must handle else case to make sure the each column has corresponsing values
                row.insert(0, 0)                
                row.insert(0, 0)
        except:
            print("error")


# newLine='' to avoid default newline as \n
with open("filterNSW1.csv", 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data_list)
