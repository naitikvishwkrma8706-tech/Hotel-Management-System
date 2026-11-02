import requests

number = input("Enter phone number with country code: ")

api_key = "YOUR_API_KEY"

url = f"http://apilayer.net/api/validate?access_key={api_key}&number={number}"

response = requests.get(url)
data = response.json()

print("\n--- Phone Number Information ---")
print("Number:", data.get("international_format"))
print("Valid:", data.get("valid"))
print("Country:", data.get("country_name"))
print("Location / Circle:", data.get("location"))
print("Carrier:", data.get("carrier"))
print("Line Type:", data.get("line_type"))