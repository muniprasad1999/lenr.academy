#!/usr/bin/env python3
"""
Convert Parkhomov Excel data to JavaScript arrays
"""
import pandas as pd
import json

def extract_fusion_data(xl_file):
    """Extract fusion reactions from Fus_Fis sheet (left side)"""
    df = pd.read_excel(xl_file, 'Fus_Fis', skiprows=6)

    # Fusion columns are in the left half
    fusion_cols = df.iloc[:, 0:10]
    fusion_cols.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E', 'A', 'Z', 'MeV']

    # Remove rows with NaN in critical columns
    fusion_cols = fusion_cols.dropna(subset=['E1', 'E2', 'E', 'MeV'])

    # Convert to list of lists
    return fusion_cols.values.tolist()

def extract_fission_data(xl_file):
    """Extract fission reactions from Fus_Fis sheet (right side)"""
    df = pd.read_excel(xl_file, 'Fus_Fis', skiprows=6)

    # Fission columns are in the right half
    fission_cols = df.iloc[:, 12:22]
    fission_cols.columns = ['E', 'A', 'Z', 'E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'MeV']

    # Remove rows with NaN
    fission_cols = fission_cols.dropna(subset=['E', 'E1', 'E2', 'MeV'])

    return fission_cols.values.tolist()

def extract_twotwo_data(xl_file):
    """Extract two-to-two reactions from 2--->2 sheet"""
    df = pd.read_excel(xl_file, '2--->2', skiprows=7)

    # Select the relevant columns
    twotwo_cols = df.iloc[:, 0:13]
    twotwo_cols.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E3', 'A3', 'Z3', 'E4', 'A4', 'Z4', 'MeV']

    # Remove rows with NaN
    twotwo_cols = twotwo_cols.dropna(subset=['E1', 'E2', 'E3', 'E4', 'MeV'])

    return twotwo_cols.values.tolist()

def main():
    xl_file = 'docs/FusFis.xlsx'

    print("Reading Excel file...")
    xl = pd.ExcelFile(xl_file)

    print("Extracting fusion data...")
    fusion_data = extract_fusion_data(xl)
    print(f"  Found {len(fusion_data)} fusion reactions")

    print("Extracting fission data...")
    fission_data = extract_fission_data(xl)
    print(f"  Found {len(fission_data)} fission reactions")

    print("Extracting two-to-two data...")
    twotwo_data = extract_twotwo_data(xl)
    print(f"  Found {len(twotwo_data)} two-to-two reactions")

    # Write to JSON for now (easier to debug)
    output = {
        'fusion': fusion_data[:10],  # First 10 for testing
        'fission': fission_data[:10],
        'twotwo': twotwo_data[:10]
    }

    with open('src/data/parkhomov_sample.json', 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\nSample data written to src/data/parkhomov_sample.json")
    print(f"Total reactions: {len(fusion_data) + len(fission_data) + len(twotwo_data)}")

if __name__ == '__main__':
    main()
