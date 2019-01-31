from csv2json import convert, load_csv, save_json

with open('filterNSW.csv') as r, open('filterNSW.json', 'w') as w:
    convert(r, w)