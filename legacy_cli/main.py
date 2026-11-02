from src.modules.guest import guest_menu
from src.modules.staff import staff_menu

# ====================
# MAIN APPLICATION
# ====================

def main():
    ans = "y"
    while ans.lower() == "y":
        print("\n" + "*"*45)
        print("*     HOTEL MANAGEMENT SYSTEM MAIN MENU     *")
        print("*"*45)
        print("1. Guest records \n2. Staff records \n3. Exit")
        try:
            x = int(input("Enter choice: "))
            if x == 1:
                guest_menu()
            elif x == 2:
                staff_menu()
            elif x == 3:
                print("Exiting...")
                break
            else:
                print("\t\tINVALID INPUT")
        except ValueError:
            print("Please enter a valid number (1, 2, or 3).")
            
        ans = input("Want to continue? (y/n): ")
            
if __name__ == "__main__":
    main()
