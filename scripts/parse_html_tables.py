#!/usr/bin/env python3
"""
Parse HTML tables from crawl/*.html files and export to CSV

Tables:
- Fusion, FusionAll (separate tables, not merged!)
- Fission, FissionAll (separate tables)
- TwoToTwo, TwoToTwoAll (separate tables, multi-file for each)
- Nuclides, NuclidesPlus (separate tables)
- ElementProperties, ElementPropertiesPlus (separate tables)
- AtomicRadii, RadioNuclides
"""

from bs4 import BeautifulSoup
import csv
import glob
from pathlib import Path

def parse_html_table(html_file):
    """Parse a single HTML file and extract table data"""
    with open(html_file, 'r', encoding='iso-8859-1') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Find the results table
    table = soup.find('table', class_='results')
    if not table:
        print(f"  No table found in {html_file}")
        return None, None

    rows = table.find_all('tr')
    if not rows:
        return None, None

    # Extract header from first row
    header_row = rows[0]
    headers = [th.get_text(strip=True) for th in header_row.find_all('td')]

    # Extract data rows
    data_rows = []
    for row in rows[1:]:  # Skip header
        cells = row.find_all('td')
        if cells:
            data_rows.append([cell.get_text(strip=True) for cell in cells])

    return headers, data_rows

def parse_multi_file_table(pattern):
    """Parse multiple HTML files for a table and combine rows"""
    files = sorted(glob.glob(pattern))
    if not files:
        print(f"  No files found for pattern: {pattern}")
        return None, None

    print(f"  Found {len(files)} files matching pattern")
    all_headers = None
    all_rows = []

    for html_file in files:
        print(f"    Parsing {Path(html_file).name}...")
        headers, rows = parse_html_table(html_file)

        if headers is None:
            continue

        if all_headers is None:
            all_headers = headers
        elif all_headers != headers:
            print(f"    WARNING: Headers mismatch in {html_file}")
            print(f"      Expected: {all_headers}")
            print(f"      Got: {headers}")

        if rows:
            all_rows.extend(rows)
            print(f"      Added {len(rows)} rows")

    return all_headers, all_rows

def write_csv(output_file, headers, rows):
    """Write data to CSV file"""
    Path('src/data').mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(rows)

    print(f"  Wrote {len(rows)} rows to {output_file}")

def main():
    print("Parsing HTML tables from crawl/*.html\n")

    # Single-file tables
    tables = [
        ('crawl/fusion_table.html', 'src/data/fusion.csv', 'Fusion'),
        ('crawl/fusion_all_table.html', 'src/data/fusion_all.csv', 'FusionAll'),
        ('crawl/fission_table.html', 'src/data/fission.csv', 'Fission'),
        ('crawl/fission_all_table.html', 'src/data/fission_all.csv', 'FissionAll'),
        ('crawl/nuclides_table.html', 'src/data/nuclides.csv', 'Nuclides'),
        ('crawl/nuclides_plus_table.html', 'src/data/nuclides_plus.csv', 'NuclidesPlus'),
        ('crawl/element_properties_table.html', 'src/data/element_properties.csv', 'ElementProperties'),
        ('crawl/element_properties_plus_table.html', 'src/data/element_properties_plus.csv', 'ElementPropertiesPlus'),
        ('crawl/atomic_radii_table.html', 'src/data/atomic_radii.csv', 'AtomicRadii'),
        ('crawl/radionuclides_table.html', 'src/data/radionuclides.csv', 'RadioNuclides'),
    ]

    for html_file, csv_file, name in tables:
        print(f"Processing {name}...")
        headers, rows = parse_html_table(html_file)
        if headers and rows:
            write_csv(csv_file, headers, rows)
        print()

    # Multi-file tables
    print("Processing TwoToTwo (multi-file)...")
    headers, rows = parse_multi_file_table('crawl/two_to_two_table_*.html')
    if headers and rows:
        write_csv('src/data/twotwo.csv', headers, rows)
    print()

    print("Processing TwoToTwoAll (multi-file)...")
    headers, rows = parse_multi_file_table('crawl/two_to_two_all_table_*.html')
    if headers and rows:
        write_csv('src/data/twotwo_all.csv', headers, rows)
    print()

    print("=== CSV Export Complete ===")

if __name__ == '__main__':
    main()
