#!/usr/bin/env python3
"""
Create SQLite database from CSV files
"""
import sqlite3
import csv

def create_tables(conn):
    """Create all necessary tables"""
    cursor = conn.cursor()

    # ElementsPlus table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ElementsPlus (
            Z INTEGER PRIMARY KEY,
            E TEXT NOT NULL,
            EName TEXT NOT NULL,
            Period INTEGER NOT NULL,
            [Group] INTEGER NOT NULL,
            AWeight REAL,
            ARadius INTEGER,
            MolarVolume REAL,
            Melting REAL,
            Boiling REAL,
            Negativity REAL,
            Affinity REAL,
            Valence INTEGER,
            MaxIonNum INTEGER,
            MaxIonization REAL,
            STPDensity REAL,
            ElectConduct REAL,
            ThermConduct REAL,
            SpecHeat REAL,
            MagType TEXT
        );
    ''')

    # NuclidesPlus table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS NuclidesPlus (
            id INTEGER PRIMARY KEY,
            Z INTEGER NOT NULL,
            A INTEGER NOT NULL,
            E TEXT NOT NULL,
            BE REAL NOT NULL,
            AMU REAL NOT NULL,
            nBorF TEXT NOT NULL,
            aBorF TEXT NOT NULL,
            LHL REAL
        );
    ''')

    # FusionAll table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS FusionAll (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            E1 TEXT NOT NULL,
            Z1 INTEGER NOT NULL,
            A1 INTEGER NOT NULL,
            E2 TEXT NOT NULL,
            Z2 INTEGER NOT NULL,
            A2 INTEGER NOT NULL,
            E TEXT NOT NULL,
            Z INTEGER NOT NULL,
            A INTEGER NOT NULL,
            MeV REAL NOT NULL,
            neutrino TEXT NOT NULL DEFAULT 'none',
            nBorF1 TEXT NOT NULL DEFAULT 'b',
            aBorF1 TEXT NOT NULL DEFAULT 'b',
            nBorF2 TEXT NOT NULL DEFAULT 'b',
            aBorF2 TEXT NOT NULL DEFAULT 'b',
            nBorF TEXT NOT NULL DEFAULT 'b',
            aBorF TEXT NOT NULL DEFAULT 'b',
            BEin REAL DEFAULT 0
        );
    ''')

    # FissionAll table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS FissionAll (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            E TEXT NOT NULL,
            Z INTEGER NOT NULL,
            A INTEGER NOT NULL,
            E1 TEXT NOT NULL,
            Z1 INTEGER NOT NULL,
            A1 INTEGER NOT NULL,
            E2 TEXT NOT NULL,
            Z2 INTEGER NOT NULL,
            A2 INTEGER NOT NULL,
            MeV REAL NOT NULL,
            neutrino TEXT NOT NULL DEFAULT 'none',
            nBorF TEXT NOT NULL DEFAULT 'b',
            aBorF TEXT NOT NULL DEFAULT 'b',
            nBorF1 TEXT NOT NULL DEFAULT 'b',
            aBorF1 TEXT NOT NULL DEFAULT 'b',
            nBorF2 TEXT NOT NULL DEFAULT 'b',
            aBorF2 TEXT NOT NULL DEFAULT 'b',
            BEin REAL DEFAULT 0
        );
    ''')

    # TwoToTwoAll table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS TwoToTwoAll (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            E1 TEXT NOT NULL,
            Z1 INTEGER NOT NULL,
            A1 INTEGER NOT NULL,
            E2 TEXT NOT NULL,
            Z2 INTEGER NOT NULL,
            A2 INTEGER NOT NULL,
            E3 TEXT NOT NULL,
            Z3 INTEGER NOT NULL,
            A3 INTEGER NOT NULL,
            E4 TEXT NOT NULL,
            Z4 INTEGER NOT NULL,
            A4 INTEGER NOT NULL,
            MeV REAL NOT NULL,
            neutrino TEXT NOT NULL DEFAULT 'none',
            nBorF1 TEXT NOT NULL DEFAULT 'b',
            aBorF1 TEXT NOT NULL DEFAULT 'b',
            nBorF2 TEXT NOT NULL DEFAULT 'b',
            aBorF2 TEXT NOT NULL DEFAULT 'b',
            nBorF3 TEXT NOT NULL DEFAULT 'b',
            aBorF3 TEXT NOT NULL DEFAULT 'b',
            nBorF4 TEXT NOT NULL DEFAULT 'b',
            aBorF4 TEXT NOT NULL DEFAULT 'b',
            BEin REAL DEFAULT 0
        );
    ''')

    # Create indexes for better query performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fusion_e1 ON FusionAll(E1);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fusion_e2 ON FusionAll(E2);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fusion_mev ON FusionAll(MeV);')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fission_e ON FissionAll(E);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_fission_mev ON FissionAll(MeV);')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_twotwo_e1 ON TwoToTwoAll(E1);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_twotwo_e2 ON TwoToTwoAll(E2);')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_twotwo_mev ON TwoToTwoAll(MeV);')

    conn.commit()

def load_fusion_data(conn):
    """Load fusion reactions from CSV"""
    cursor = conn.cursor()

    with open('src/data/fusion.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute('''
                INSERT INTO FusionAll (E1, Z1, A1, E2, Z2, A2, E, Z, A, MeV, neutrino, nBorF1, aBorF1, nBorF2, aBorF2, nBorF, aBorF, BEin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 0)
            ''', (
                row['E1'], int(float(row['Z1'])), int(float(row['A1'])),
                row['E2'], int(float(row['Z2'])), int(float(row['A2'])),
                row['E'], int(float(row['Z'])), int(float(row['A'])),
                float(row['MeV'])
            ))

    conn.commit()
    print(f"Loaded {cursor.lastrowid} fusion reactions")

def load_fission_data(conn):
    """Load fission reactions from CSV"""
    cursor = conn.cursor()

    with open('src/data/fission.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute('''
                INSERT INTO FissionAll (E, Z, A, E1, Z1, A1, E2, Z2, A2, MeV, neutrino, nBorF, aBorF, nBorF1, aBorF1, nBorF2, aBorF2, BEin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 0)
            ''', (
                row['E'], int(float(row['Z'])), int(float(row['A'])),
                row['E1'], int(float(row['Z1'])), int(float(row['A1'])),
                row['E2'], int(float(row['Z2'])), int(float(row['A2'])),
                float(row['MeV'])
            ))

    conn.commit()
    print(f"Loaded {cursor.lastrowid} fission reactions")

def load_twotwo_data(conn):
    """Load two-to-two reactions from CSV"""
    cursor = conn.cursor()

    with open('src/data/twotwo.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute('''
                INSERT INTO TwoToTwoAll (E1, Z1, A1, E2, Z2, A2, E3, Z3, A3, E4, Z4, A4, MeV, neutrino, nBorF1, aBorF1, nBorF2, aBorF2, nBorF3, aBorF3, nBorF4, aBorF4, BEin)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 0)
            ''', (
                row['E1'], int(float(row['Z1'])), int(float(row['A1'])),
                row['E2'], int(float(row['Z2'])), int(float(row['A2'])),
                row['E3'], int(float(row['Z3'])), int(float(row['A3'])),
                row['E4'], int(float(row['Z4'])), int(float(row['A4'])),
                float(row['MeV'])
            ))

    conn.commit()
    print(f"Loaded {cursor.lastrowid} two-to-two reactions")

def populate_elements(conn):
    """Populate ElementsPlus with element symbols from actual reaction data"""
    cursor = conn.cursor()

    # Get unique elements from all reaction tables
    cursor.execute('''
        SELECT DISTINCT E, Z FROM (
            SELECT E1 as E, Z1 as Z FROM FusionAll
            UNION SELECT E2, Z2 FROM FusionAll
            UNION SELECT E, Z FROM FusionAll
            UNION SELECT E, Z FROM FissionAll
            UNION SELECT E1, Z1 FROM FissionAll
            UNION SELECT E2, Z2 FROM FissionAll
            UNION SELECT E1, Z1 FROM TwoToTwoAll
            UNION SELECT E2, Z2 FROM TwoToTwoAll
            UNION SELECT E3, Z3 FROM TwoToTwoAll
            UNION SELECT E4, Z4 FROM TwoToTwoAll
        )
        ORDER BY Z
    ''')

    elements = cursor.fetchall()

    # Insert minimal element data (just symbol and Z)
    # The app only needs E and Z for the periodic table selector
    for e_symbol, z in elements:
        cursor.execute('''
            INSERT OR IGNORE INTO ElementsPlus
            (Z, E, EName, Period, [Group])
            VALUES (?, ?, ?, 1, 1)
        ''', (z, e_symbol, e_symbol))

    conn.commit()
    print(f"Loaded {len(elements)} elements from reaction data")

def main():
    print("Creating SQLite database...")

    # Create database file
    conn = sqlite3.connect('public/parkhomov.db')

    print("Creating tables...")
    create_tables(conn)

    print("Loading fusion data...")
    load_fusion_data(conn)

    print("Loading fission data...")
    load_fission_data(conn)

    print("Loading two-to-two data...")
    load_twotwo_data(conn)

    print("Extracting elements from reaction data...")
    populate_elements(conn)

    # Get counts
    cursor = conn.cursor()
    fusion_count = cursor.execute('SELECT COUNT(*) FROM FusionAll').fetchone()[0]
    fission_count = cursor.execute('SELECT COUNT(*) FROM FissionAll').fetchone()[0]
    twotwo_count = cursor.execute('SELECT COUNT(*) FROM TwoToTwoAll').fetchone()[0]

    print(f"\n=== Database Created ===")
    print(f"Fusion reactions: {fusion_count}")
    print(f"Fission reactions: {fission_count}")
    print(f"Two-to-two reactions: {twotwo_count}")
    print(f"Total: {fusion_count + fission_count + twotwo_count}")
    print(f"\nDatabase file: public/parkhomov.db")

    conn.close()

if __name__ == '__main__':
    main()
