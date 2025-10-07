#!/usr/bin/env python3
"""
Convert Parkhomov Excel data to SQL INSERT statements
"""
import pandas as pd
import sys

def clean_value(val):
    """Clean and format a value for SQL"""
    if pd.isna(val):
        return 'NULL'
    if isinstance(val, str):
        # Escape single quotes
        return f"'{val.replace(chr(39), chr(39)+chr(39))}'"
    if isinstance(val, (int, float)):
        return str(val)
    return f"'{str(val)}'"

def extract_fusion_data(xl_file):
    """Extract fusion reactions from Fus_Fis sheet (left side)"""
    df = pd.read_excel(xl_file, 'Fus_Fis', skiprows=6)

    # Fusion columns are in the left half (columns 0-10)
    fusion_cols = df.iloc[:, 0:10]
    fusion_cols.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E', 'A', 'Z', 'MeV']

    # Remove rows with NaN in critical columns
    fusion_cols = fusion_cols.dropna(subset=['E1', 'E2', 'E', 'MeV'])

    return fusion_cols

def extract_fission_data(xl_file):
    """Extract fission reactions from Fus_Fis sheet (right side)"""
    df = pd.read_excel(xl_file, 'Fus_Fis', skiprows=6)

    # Fission columns are in the right half (columns 12-21)
    fission_cols = df.iloc[:, 12:22]
    fission_cols.columns = ['E', 'A', 'Z', 'E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'MeV']

    # Remove rows with NaN in critical columns
    fission_cols = fission_cols.dropna(subset=['E', 'E1', 'E2', 'MeV'])

    return fission_cols

def extract_twotwo_data(xl_file):
    """Extract two-to-two reactions from 2--->2 sheet"""
    df = pd.read_excel(xl_file, '2--->2', skiprows=7)

    # Select the relevant columns
    twotwo_cols = df.iloc[:, 0:13]
    twotwo_cols.columns = ['E1', 'A1', 'Z1', 'E2', 'A2', 'Z2', 'E3', 'A3', 'Z3', 'E4', 'A4', 'Z4', 'MeV']

    # Remove rows with NaN in critical columns
    twotwo_cols = twotwo_cols.dropna(subset=['E1', 'E2', 'E3', 'E4', 'MeV'])

    return twotwo_cols

def generate_fusion_sql(df):
    """Generate SQL INSERT statements for fusion reactions"""
    inserts = []
    for idx, row in df.iterrows():
        values = f"({clean_value(row['E1'])}, {clean_value(row['Z1'])}, {clean_value(row['A1'])}, " \
                 f"{clean_value(row['E2'])}, {clean_value(row['Z2'])}, {clean_value(row['A2'])}, " \
                 f"{clean_value(row['E'])}, {clean_value(row['Z'])}, {clean_value(row['A'])}, " \
                 f"{clean_value(row['MeV'])}, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 0)"
        inserts.append(values)

    sql = "-- Fusion Reactions\n"
    sql += "INSERT INTO FusionAll (E1, Z1, A1, E2, Z2, A2, E, Z, A, MeV, neutrino, nBorF1, aBorF1, nBorF2, aBorF2, nBorF, aBorF, BEin) VALUES\n"
    sql += ",\n".join(inserts) + ";\n\n"
    return sql

def generate_fission_sql(df):
    """Generate SQL INSERT statements for fission reactions"""
    inserts = []
    for idx, row in df.iterrows():
        values = f"({clean_value(row['E'])}, {clean_value(row['Z'])}, {clean_value(row['A'])}, " \
                 f"{clean_value(row['E1'])}, {clean_value(row['Z1'])}, {clean_value(row['A1'])}, " \
                 f"{clean_value(row['E2'])}, {clean_value(row['Z2'])}, {clean_value(row['A2'])}, " \
                 f"{clean_value(row['MeV'])}, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 0)"
        inserts.append(values)

    sql = "-- Fission Reactions\n"
    sql += "INSERT INTO FissionAll (E, Z, A, E1, Z1, A1, E2, Z2, A2, MeV, neutrino, nBorF, aBorF, nBorF1, aBorF1, nBorF2, aBorF2, BEin) VALUES\n"
    sql += ",\n".join(inserts) + ";\n\n"
    return sql

def generate_twotwo_sql(df):
    """Generate SQL INSERT statements for two-to-two reactions"""
    inserts = []
    for idx, row in df.iterrows():
        values = f"({clean_value(row['E1'])}, {clean_value(row['Z1'])}, {clean_value(row['A1'])}, " \
                 f"{clean_value(row['E2'])}, {clean_value(row['Z2'])}, {clean_value(row['A2'])}, " \
                 f"{clean_value(row['E3'])}, {clean_value(row['Z3'])}, {clean_value(row['A3'])}, " \
                 f"{clean_value(row['E4'])}, {clean_value(row['Z4'])}, {clean_value(row['A4'])}, " \
                 f"{clean_value(row['MeV'])}, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 0)"
        inserts.append(values)

    sql = "-- Two-To-Two Reactions\n"
    sql += "INSERT INTO TwoToTwoAll (E1, Z1, A1, E2, Z2, A2, E3, Z3, A3, E4, Z4, A4, MeV, neutrino, nBorF1, aBorF1, nBorF2, aBorF2, nBorF3, aBorF3, nBorF4, aBorF4, BEin) VALUES\n"
    sql += ",\n".join(inserts) + ";\n\n"
    return sql

def main():
    xl_file = 'docs/FusFis.xlsx'

    print("Reading Excel file...")
    xl = pd.ExcelFile(xl_file)

    print("Extracting fusion data...")
    fusion_df = extract_fusion_data(xl)
    print(f"  Found {len(fusion_df)} fusion reactions")

    print("Extracting fission data...")
    fission_df = extract_fission_data(xl)
    print(f"  Found {len(fission_df)} fission reactions")

    print("Extracting two-to-two data...")
    twotwo_df = extract_twotwo_data(xl)
    print(f"  Found {len(twotwo_df)} two-to-two reactions")

    print("\nGenerating SQL...")
    fusion_sql = generate_fusion_sql(fusion_df)
    fission_sql = generate_fission_sql(fission_df)
    twotwo_sql = generate_twotwo_sql(twotwo_df)

    # Write to file
    output_file = 'src/data/parkhomov_data.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("-- Parkhomov Nuclear Reaction Data\n")
        f.write("-- Generated from FusFis.xlsx\n\n")
        f.write(fusion_sql)
        f.write(fission_sql)
        f.write(twotwo_sql)

    print(f"\nSQL written to {output_file}")
    print(f"Total reactions: {len(fusion_df) + len(fission_df) + len(twotwo_df)}")

if __name__ == '__main__':
    main()
