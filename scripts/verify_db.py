#!/usr/bin/env python3
"""
Verify database integrity after rebuild
"""
import sqlite3

DB_PATH = 'public/parkhomov.db'

def verify_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("=== Database Integrity Verification ===\n")

    # Check 1: Verify all element symbols in reaction tables exist in ElementPropertiesPlus
    print("1. Checking element symbols in FusionAll...")
    cursor.execute("""
        SELECT DISTINCT E FROM (
            SELECT E1 as E FROM FusionAll
            UNION SELECT E2 FROM FusionAll
            UNION SELECT E FROM FusionAll
        )
        WHERE E NOT IN (SELECT E FROM ElementPropertiesPlus)
        ORDER BY E
    """)
    invalid_elements = cursor.fetchall()
    if invalid_elements:
        print(f"   ⚠️  Found {len(invalid_elements)} invalid elements:")
        for row in invalid_elements:
            print(f"      - {row[0]}")
    else:
        print("   ✅ All elements valid")

    # Check 2: Verify neutrino column in "All" tables
    print(f"\n2. Checking neutrino values in FusionAll:")
    cursor.execute("SELECT neutrino, COUNT(*) FROM FusionAll GROUP BY neutrino ORDER BY neutrino")
    for row in cursor.fetchall():
        print(f"   {row[0]}: {row[1]:,} rows")

    # Check 3: Verify NuclidesPlus includes H, D, T
    print(f"\n3. Checking isotopes in NuclidesPlus:")
    for isotope in ['H', 'D', 'T']:
        cursor.execute("SELECT COUNT(*) FROM NuclidesPlus WHERE E = ?", (isotope,))
        count = cursor.fetchone()[0]
        if count > 0:
            print(f"   ✅ {isotope}: {count} entries")
        else:
            print(f"   ⚠️  {isotope}: not found")

    # Check 4: Verify ElementsPlus view
    print(f"\n4. Checking ElementsPlus view:")
    cursor.execute("SELECT COUNT(*) FROM ElementsPlus")
    count = cursor.fetchone()[0]
    print(f"   ElementsPlus: {count} elements")
    if count == 94:
        print("   ✅ Correct number of elements")
    else:
        print(f"   ⚠️  Expected 94 elements")

    # Check 5: Sample some fusion reactions
    print(f"\n5. Sample fusion reactions (FusionAll):")
    cursor.execute("""
        SELECT E1, A1, E2, A2, E, A, MeV, neutrino
        FROM FusionAll
        LIMIT 5
    """)
    for row in cursor.fetchall():
        print(f"   {row[0]}{row[1]} + {row[2]}{row[3]} → {row[4]}{row[5]} ({row[6]:.3f} MeV, neutrino={row[7]})")

    # Check 6: Verify no Cyrillic characters
    print(f"\n6. Checking for Cyrillic characters in FusionAll:")
    cursor.execute("""
        SELECT COUNT(*) FROM FusionAll
        WHERE E1 IN ('Н', 'Не') OR E2 IN ('Н', 'Не') OR E IN ('Н', 'Не')
    """)
    cyrillic_count = cursor.fetchone()[0]
    if cyrillic_count == 0:
        print("   ✅ No Cyrillic characters found")
    else:
        print(f"   ⚠️  Found {cyrillic_count} rows with Cyrillic characters")

    # Check 7: Verify no asterisks in element symbols
    print(f"\n7. Checking for asterisks in element symbols:")
    cursor.execute("""
        SELECT COUNT(*) FROM FusionAll
        WHERE E1 LIKE '%*%' OR E2 LIKE '%*%' OR E LIKE '%*%'
    """)
    asterisk_count = cursor.fetchone()[0]
    if asterisk_count == 0:
        print("   ✅ No asterisks found")
    else:
        print(f"   ⚠️  Found {asterisk_count} rows with asterisks")

    conn.close()
    print("\n✅ Verification complete!")

if __name__ == '__main__':
    verify_database()
