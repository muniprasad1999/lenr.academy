#!/usr/bin/env python3
"""
Extract Parkhomov data from Excel - process in chunks
"""
import pandas as pd
import sys

def process_fusion_fission():
    """Process the Fus_Fis sheet (relatively small)"""
    print("Processing Fus_Fis sheet...")

    # Read the full sheet (should be manageable)
    df = pd.read_excel('docs/FusFis.xlsx', 'Fus_Fis', skiprows=6)

    print(f"Total rows: {len(df)}")

    # Fusion data (left columns)
    fusion_df = df.iloc[:, 0:10].copy()
    fusion_df.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E', 'A', 'Z', 'MeV']
    fusion_df = fusion_df.dropna(subset=['E1', 'MeV'])

    print(f"Fusion reactions: {len(fusion_df)}")

    # Fission data (right columns)
    fission_df = df.iloc[:, 12:22].copy()
    fission_df.columns = ['E', 'A', 'Z', 'E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'MeV']
    fission_df = fission_df.dropna(subset=['E', 'MeV'])

    print(f"Fission reactions: {len(fission_df)}")

    # Save to CSV for easier processing
    fusion_df.to_csv('src/data/fusion.csv', index=False)
    fission_df.to_csv('src/data/fission.csv', index=False)

    return len(fusion_df), len(fission_df)

def process_twotwo_sample():
    """Process just a sample of the 2--->2 sheet (it's huge - 481MB!)"""
    print("\nProcessing 2--->2 sheet (loading sample only)...")

    # Only load first 10000 rows to avoid timeout
    # Skip 8 rows to get past both header rows
    df = pd.read_excel('docs/FusFis.xlsx', '2--->2', skiprows=8, nrows=10000)

    # Select relevant columns
    twotwo_df = df.iloc[:, 0:13].copy()
    twotwo_df.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E3', 'A3', 'Z3', 'E4', 'A4', 'Z4', 'MeV']
    twotwo_df = twotwo_df.dropna(subset=['E1', 'MeV'])

    print(f"Two-to-two reactions (sample): {len(twotwo_df)}")

    # Save sample to CSV
    twotwo_df.to_csv('src/data/twotwo.csv', index=False)

    return len(twotwo_df)

def main():
    fusion_count, fission_count = process_fusion_fission()
    twotwo_count = process_twotwo_sample()

    print(f"\n=== Summary ===")
    print(f"Fusion: {fusion_count} reactions")
    print(f"Fission: {fission_count} reactions")
    print(f"TwoToTwo: {twotwo_count} reactions (sample only)")
    print(f"\nCSV files written to src/data/")

if __name__ == '__main__':
    main()
