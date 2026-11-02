import os
import sys

# Launcher to maintain backwards compatibility with the Python CLI
if __name__ == "__main__":
    cli_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "legacy_cli")
    os.chdir(cli_dir)
    sys.path.insert(0, cli_dir)
    try:
        from main import main
        main()
    except Exception as e:
        print("Note: To run the Python CLI directly, make sure your MySQL database is active:")
        print(f"Error: {e}")
