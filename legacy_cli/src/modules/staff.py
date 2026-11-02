import pandas as pd
import matplotlib.pyplot as plt
from src.db.db import get_connection, get_engine

def show_all_staff():
    try:
        engine = get_engine()
        quer = "SELECT * FROM staff;"
        df = pd.read_sql(quer, engine)
        print(df)
    except Exception as e:
        print("Error:", e)

def add_staff():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        print("\nDepartments: \n1. cleaning \n2. food and beverages \n3. management")
        while True:
            try:
                sid = int(input("Enter ID: "))
                c1.execute(f"SELECT * FROM staff WHERE id={sid}")
                if c1.rowcount > 0:
                    print("ID already exists, enter a different ID.")
                else:
                    break
            except ValueError:
                print("ID must be an integer.")

        name = input("Enter Name: ")
        dept = input("Enter Department: ").lower()
        
        if dept == "cleaning":
            sal = 2000
        elif "food" in dept or "beverage" in dept:
            sal = 4000
            dept = "food and beverages"
        elif dept == "management" or dept == "managment":
            sal = 6000
        else:
            sal = int(input("Enter Salary manually: "))

        hiredate = input("Enter Hire Date (YYYY-MM-DD): ")
        
        quer = f"INSERT INTO staff VALUES ({sid}, '{name}', '{dept}', {sal}, '{hiredate}')"
        c1.execute(quer)
        d1.commit()
        print("Record Added")
        
        see = input("Want to see the added record? (y/n): ")
        if see.lower() == 'y':
            c1.execute(f"SELECT * FROM staff WHERE id={sid}")
            rec = c1.fetchone()
            print(f"ID={rec[0]}, Name={rec[1]}, Dept={rec[2]}, Sal={rec[3]}, HireDate={rec[4]}")
        
        d1.close()
    except Exception as e:
        print("Error:", e)

def search_staff():
    try:
        print("\n1. ID \n2. Name \n3. Dept \n4. Salary \n5. Hiredate")
        cho = int(input("Enter choice: "))
        pd.set_option('display.expand_frame_repr', False)
        
        if cho == 1:
            x = int(input("Enter ID: "))
            quer = f"SELECT * FROM staff WHERE id={x}"
        elif cho == 2:
            x = input("Enter Name: ")
            quer = f"SELECT * FROM staff WHERE name='{x}'"
        elif cho == 3:
            x = input("Enter Dept: ")
            quer = f"SELECT * FROM staff WHERE dept='{x}'"
        elif cho == 4:
            x = int(input("Enter Salary: "))
            quer = f"SELECT * FROM staff WHERE sal={x}"
        elif cho == 5:
            x = input("Enter Hire date: ")
            quer = f"SELECT * FROM staff WHERE hiredate='{x}'"
        else:
            print("Invalid input")
            return
            
        engine = get_engine()
        df = pd.read_sql(quer, engine)
        print(df)
    except Exception as e:
        print("Error:", e)

def delete_staff():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        x = int(input("Enter the ID to delete: "))
        quer = f"DELETE FROM staff WHERE id={x}"
        rowcount = c1.execute(quer)
        if rowcount > 0:
            d1.commit()
            print("Record Deleted")
        else:
            print("NO RECORD FOUND")
        d1.close()
    except Exception as e:
        print("Error:", e)

def graph_staff():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        
        c1.execute("SELECT count(*) FROM staff WHERE sal=2000;")
        x = c1.fetchone()
        lst_x = list(x) if x else [0]
        
        c1.execute("SELECT count(*) FROM staff WHERE sal=4000;")
        y = c1.fetchone()
        lst_y = list(y) if y else [0]
        
        c1.execute("SELECT count(*) FROM staff WHERE sal=6000;")
        z = c1.fetchone()
        lst_z = list(z) if z else [0]
        
        lsq = lst_x + lst_y + lst_z
        salaries = ["2000", "4000", "6000"]
        
        plt.bar(salaries, lsq)
        plt.xlabel("Salary")
        plt.ylabel("No. of Staff")
        plt.title("Staff Count by Salary Level")
        plt.show()
        d1.close()
    except Exception as e:
        print("Error:", e)

def update_staff():
    try:
        d1 = get_connection()
        c1 = d1.cursor()
        sid = int(input("Enter the ID to update: "))
        quer = f"SELECT * FROM staff WHERE id={sid}"
        c1.execute(quer)
        if c1.rowcount > 0:
            engine = get_engine()
            df = pd.read_sql(quer, engine)
            print(df)
            print("1. ID \n2. Name \n3. Department \n4. Hire Date")
            cr = int(input("Enter the no to update: "))
            if cr == 1:
                newid = int(input("Enter new ID: "))
                c1.execute(f"UPDATE staff SET id={newid} WHERE id={sid}")
            elif cr == 2:
                val = input("Enter new Name: ")
                c1.execute(f"UPDATE staff SET name='{val}' WHERE id={sid}")
            elif cr == 3:
                val = input("Enter new Department (cleaning/food and beverages/management): ").lower()
                sal = 0
                if val == "cleaning": 
                    sal = 2000
                elif "food" in val or "beverage" in val:
                    val = "food and beverages"
                    sal = 4000
                elif val == "management" or val == "managment":
                    sal = 6000
                else: 
                    sal = int(input("Enter custom salary: "))
                
                c1.execute(f"UPDATE staff SET dept='{val}', sal={sal} WHERE id={sid}")
            elif cr == 4:
                val = input("Enter new Hire Date (YYYY-MM-DD): ")
                c1.execute(f"UPDATE staff SET hiredate='{val}' WHERE id={sid}")
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

def staff_menu():
    ans = "y"
    while ans.lower() == "y":
        print("\nStaff Data Handling")
        print("1. Show all records")
        print("2. Add records")
        print("3. Search the records")
        print("4. Delete record")
        print("5. Graphical Representation")
        print("6. Update the records")
        print("7. Exit to Main Menu")
        try:
            choice = int(input("Enter choice: "))
            if choice == 1:
                show_all_staff()
            elif choice == 2:
                add_staff()
            elif choice == 3:
                search_staff()
            elif choice == 4:
                delete_staff()
            elif choice == 5:
                graph_staff()
            elif choice == 6:
                update_staff()
            elif choice == 7:
                break
            else:
                print("Invalid Input")
        except ValueError:
            print("Please enter a valid number.")
        ans = input("Want to continue with Staff records? (y/n): ")
