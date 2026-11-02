import pandas as pd
import matplotlib.pyplot as plt
from src.db.db import get_connection, get_engine

def show_all_guests():
    try:
        engine = get_engine()
        quer = "SELECT * FROM guest;"
        df = pd.read_sql(quer, engine)
        print(df)
    except Exception as e:
        print("Error connecting to database:", e)

def add_guest():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        while True:
            try:
                gid = int(input("Enter ID: "))
                c1.execute(f"SELECT * FROM guest WHERE id={gid}")
                if c1.rowcount > 0:
                    print("ID already exists, enter a different ID.")
                else:
                    break
            except ValueError:
                print("ID must be an integer.")

        name = input("Enter Name: ")
        source = input("Enter Source of Booking: ")
        room_no = int(input("Enter Room no: "))
        date = input("Enter Date (YYYY-MM-DD): ")
        type_of_room = input("Enter Type of Room: ")
        
        quer = f"INSERT INTO guest VALUES ({gid}, '{name}', '{source}', {room_no}, '{date}', '{type_of_room}')"
        c1.execute(quer)
        d1.commit()
        print("Record Added")
        d1.close()
    except Exception as e:
        print("Error:", e)

def search_guest():
    try:
        d1 = get_connection()
        print("\n1. ID \n2. Name \n3. Source of Booking \n4. Room no \n5. Date \n6. Type of Room")
        cho = int(input("Enter choice: "))
        pd.set_option('display.expand_frame_repr', False)
        
        if cho == 1:
            x = int(input("Enter ID: "))
            quer = f"SELECT * FROM guest WHERE id={x}"
        elif cho == 2:
            x = input("Enter Name: ")
            quer = f"SELECT * FROM guest WHERE name='{x}'"
        elif cho == 3:
            x = input("Enter Source of Booking: ")
            quer = f"SELECT * FROM guest WHERE source='{x}'"
        elif cho == 4:
            x = int(input("Enter Room no: "))
            quer = f"SELECT * FROM guest WHERE room_no={x}"
        elif cho == 5:
            x = input("Enter Date: ")
            quer = f"SELECT * FROM guest WHERE date='{x}'"
        elif cho == 6:
            x = input("Enter Type of Room: ")
            quer = f"SELECT * FROM guest WHERE type_of_room='{x}'"
        else:
            print("Invalid input")
            return
            
        engine = get_engine()
        df = pd.read_sql(quer, engine)
        print(df)
    except Exception as e:
        print("Error:", e)

def delete_guest():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        x = int(input("Enter the ID to delete: "))
        quer = f"DELETE FROM guest WHERE id={x}"
        rowcount = c1.execute(quer)
        if rowcount > 0:
            d1.commit()
            print("Record Deleted")
        else:
            print("NO RECORD FOUND")
        d1.close()
    except Exception as e:
        print("Error:", e)

def graph_guest():
    try:
        print("\n1. Rooms booked \n2. Source of Booking")
        choice = int(input("Enter choice: "))
        if choice == 1:
            quer = "SELECT room_no, COUNT(*) as count FROM guest GROUP BY room_no;"
            engine = get_engine()
            df = pd.read_sql(quer, engine)
            plt.bar(df['room_no'].astype(str), df['count'])
            plt.xlabel("Room No")
            plt.ylabel("Number of Bookings")
            plt.title("Rooms Booked")
            plt.show()
        elif choice == 2:
            quer = "SELECT source, COUNT(*) as count FROM guest GROUP BY source;"
            engine = get_engine()
            df = pd.read_sql(quer, engine)
            plt.bar(df['source'], df['count'])
            plt.xlabel("Source of Booking")
            plt.ylabel("Number of Bookings")
            plt.title("Bookings by Source")
            plt.show()
    except Exception as e:
        print("Error:", e)

def update_guest():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        gid = int(input("Enter the ID to update: "))
        quer = f"SELECT * FROM guest WHERE id={gid}"
        c1.execute(quer)
        if c1.rowcount > 0:
            engine = get_engine()
            df = pd.read_sql(quer, engine)
            print(df)
            print("1. Name \n2. Source of booking \n3. Date \n4. Type of Room")
            cr = int(input("Enter the no to update: "))
            if cr == 1:
                val = input("Enter new Name: ")
                c1.execute(f"UPDATE guest SET name='{val}' WHERE id={gid}")
            elif cr == 2:
                val = input("Enter new Source: ")
                c1.execute(f"UPDATE guest SET source='{val}' WHERE id={gid}")
            elif cr == 3:
                val = input("Enter new Date (YYYY-MM-DD): ")
                c1.execute(f"UPDATE guest SET date='{val}' WHERE id={gid}")
            elif cr == 4:
                val = input("Enter new Type of Room: ")
                c1.execute(f"UPDATE guest SET type_of_room='{val}' WHERE id={gid}")
            else:
                print("Invalid selection")
                return
            
            d1.commit()
            print("RECORD UPDATED")
        else:
            print("ID not found.")
        d1.close()
    except Exception as e:
        print("Error:", e)

def guest_menu():
    ans = "y"
    while ans.lower() == "y":
        print("\nGuest Data Handling")
        print("1. Show all the records")
        print("2. Add record of guest")
        print("3. Search records")
        print("4. Delete records")
        print("5. Graphical Representation")
        print("6. Update the records")
        print("7. Exit to Main Menu")
        try:
            choice = int(input("Enter choice: "))
            if choice == 1:
                show_all_guests()
            elif choice == 2:
                add_guest()
            elif choice == 3:
                search_guest()
            elif choice == 4:
                delete_guest()
            elif choice == 5:
                graph_guest()
            elif choice == 6:
                update_guest()
            elif choice == 7:
                break
            else:
                print("Invalid Input")
        except ValueError:
            print("Please enter a valid number.")
        ans = input("Want to continue with Guest records? (y/n): ")
