import os, numbers, json #, requests
# from ics import Calendar
from dotenv import load_dotenv
# import concurrent.futures as cf
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()

months = {"january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6, "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12}
# form_spreadsheet_id = None # temp change to spirit co spreadsheet url
# spreadsheet_range = None # temp change to columns with name and if they went to event or not
hours_spreadsheet_id = os.getenv("HOURS_SPREADSHEET_ID")
hours_spreadsheet_range = json.loads(os.getenv("HOURS_SPREADSHEET_RANGE"))
parent_dir = ""

def url_to_id(url):
    try:
        return url.split("d/")[1].split("/edit")[0]
    except IndexError:
        try:
            return url.split("id=")[1]
        except:
            return url

def fetch_sheet_data(id, ranges, credentials):
    id = url_to_id(id)
    service = build("sheets", "v4", credentials=credentials)
    result = service.spreadsheets().values().batchGet(spreadsheetId=id, ranges=ranges).execute()
    filtered_values = []
    
    for single_range in result.get("valueRanges"):
        nested_table = []
        for value in single_range.get("values"):
            if value != []:
                nested_table.append(value)
        filtered_values.append(nested_table)

    return filtered_values

def fetch_docs_data(id, credentials):
    id = url_to_id(id)
    service = build("docs", "v1", credentials=credentials)
    try:
        document = service.documents().get(documentId=id).execute()
    except HttpError:
        print(f"error accessing {id}")
        return {"error": f"error accessing {id}"}
    body_content = document.get("body").get("content")
    hour_listings = {"title": document.get("title")}
    doc_tables = {}
    
    for item in body_content:
        if "table" in item:
            doc_tables.update({"table"+str(len(doc_tables)+1): list(item.get("table").get("tableRows"))})
    doc_tables.pop("table1") # removes first table (irrelevant info)
    
    for table in doc_tables:
        row = doc_tables.get(table)
        name_row, hours_row, start_row, end_row = "", "", "", ""
        for i in range(len(row[0].get("tableCells"))):
            col = row[0].get("tableCells")[i].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get("content").replace("\n", "").lower()
            if col == "name":
                name_row = i
            elif col == "hours":
                hours_row = i
            elif col == "sign in":
                start_row = i
            elif col == "sign out":
                end_row = i
        for i in range(1, len(row)):
            if start_row != "" and end_row != "":
                try:
                    start = row[i].get("tableCells")[start_row].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get("content").replace("\n", "").lower()
                    end = row[i].get("tableCells")[end_row].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get("content").replace("\n", "").lower()
                except: pass
            else:
                start, end = "", ""
            hours = row[i].get("tableCells")[hours_row].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get("content").replace("\n", "").lower()
            if hours == "":
                hours = row[i].get("tableCells")[hours_row].get("content")[0].get("paragraph").get("elements")[0].get("startIndex")
            name = row[i].get("tableCells")[name_row].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get("content").replace("\n", "").lower()
            if name != "" and start != "" and end != "":
                hour_listings.update({name: [hours, start, end]})

    # takes event sign up doc url, credentials
    # returns dictionary containing event name, and everyone who went and their hours
    # name: {hours or startIndex if hours cell is blank, start of shift, end of shift}

    return {"data": hour_listings} if len(hour_listings) > 1 else {"error": "empty event"}

# def get_events_in_month(month, year):
#     calendar = Calendar(requests.get("https://calendar.google.com/calendar/ical/f238f5782ab06893aa0d4337acaf0df89d57a28d245958c2db27742799ce3836%40group.calendar.google.com/public/basic.ics").text)
#     events = list(calendar.events)
#     urls = []

#     for event in events:
#         if int(str(event.begin).split("-")[1]) == month and int(str(event.begin).split("-")[0]) == year:
#             if len(event.extra) >= 3 and "document" in str(event.extra[2]):
#                 urls.append(str(event.extra[2]).split("document:")[1].split("&")[0])

#     print("calendar loaded")
#     return urls

# def check_spirit_co_form(credentials, month, year, info_dict):
#     month = month.lower()
#     form_responses = fetch_sheet_data(form_spreadsheet_id, spreadsheet_range, credentials)

#     urls = list(get_events_in_month(months.get(month), int(year)))
    
#     month_hour_listings = {}
#     didnt_go = []

#     with cf.ThreadPoolExecutor() as executor:
#         futures = [executor.submit(fetch_docs_data, url, credentials) for url in urls]
#     for future in futures:
#         if future.result() != None:
#             month_hour_listings.update(future.result())

#     for person in list(form_responses[0]):
#         if person[0].lower() not in month_hour_listings:
#             didnt_go.append(person[0])

#     print(f"the following people that filled out the spirit co form did not attend an event in {month}, {year}")
#     print(didnt_go)

def automate_event(credentials, event_url, hours_multiplier):
    event_url = url_to_id(event_url)
    event_hours = fetch_docs_data(event_url, credentials)
    hours_multiplier = float(hours_multiplier)
    if event_hours.get("error"):
        return {"error": event_hours.get("error")}
    event_hours = event_hours.get("data")
    event_title = event_hours.get("title")
    event_hours.pop("title")
    return_data = ""
    #check if event has hours filled out on the google doc

    if not event_hours: # if empty event end program
        # print("empty event")
        return {"error": "empty event"}
    elif isinstance(event_hours.get(list(event_hours)[0])[0], numbers.Number): # if first name doesnt have hours filled out it assumes that hours arent filled out for whole doc
        service = build("docs", "v1", credentials=credentials)
        updates = []
        correction = 0

        for name in event_hours:
            start = [int(x) for x in event_hours.get(name)[1].split(":")]
            end = [int(x) for x in event_hours.get(name)[2].split(":")]
            if start[0] > end[0]:
                start[0] -= 12
            hours = str(round((((end[0]*60 + end[1]) - (start[0]*60 + start[1]))/60) * hours_multiplier, 2))
            updates.append({"insertText": {"location": {"index": event_hours.get(name)[0] + correction}, "text": hours}})
            event_hours.get(name)[0] = hours
            correction += len(hours)

        result = service.documents().batchUpdate(documentId=event_url, body={"requests": updates}).execute()
        # print("\nhours filled out on event attendance doc\n")
        return_data += "hours filled out on event attendace doc"
        hours_multiplier = 1
    else:
        return_data += "event sign up sheet is already filled out, "

    # automating hours and filling out the hours spreadsheet

    event_names = fetch_sheet_data(hours_spreadsheet_id, ["Master Sheet!K1:ZZ1"], credentials)[0][0]
    if event_title in event_names:
        # print(f"{event_title} is already in spreadsheet")
        return {"error": f"{event_title} is already in spreadsheet"}
    empty_event_number = event_names.index("")+11
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    column = ""

    if empty_event_number > len(alphabet):
        if empty_event_number%len(alphabet) == 0:
            column = alphabet[empty_event_number//len(alphabet)-2]
        else:
            column = alphabet[empty_event_number//len(alphabet)-1]
    column += alphabet[empty_event_number%len(alphabet)-1]

    data = [{"range": f"Master Sheet!{column}1:{column}1", "values": [[event_title]]}]
    not_done = {}
    all_rows = fetch_sheet_data(hours_spreadsheet_id, hours_spreadsheet_range[0], credentials)[0]

    for name in event_hours:
        try:
            first, last = name.split(" ")
            row = all_rows.index([", ".join([last.capitalize(), first.capitalize()])])+2
            data.append({"range": f"Master Sheet!{column}{row}:{column}{row}", "values": [[float(event_hours.get(name)[0]) * hours_multiplier]]})
        except ValueError:
            not_done.update({name: float(event_hours.get(name)[0]) * hours_multiplier})
    
    service = build("sheets", "v4", credentials=credentials)
    result = service.spreadsheets().values().batchUpdate(spreadsheetId=hours_spreadsheet_id, body={"valueInputOption": "USER_ENTERED", "data": data}).execute()
    
    updated_hours, not_updated_hours = [], []
    # print("updated hours for the following people: ")
    for name in event_hours:
        if not name in not_done:
            # print(f"    {name}: {event_hours.get(name)[0]} hours")
            updated_hours.append([name, float(event_hours.get(name)[0]) * hours_multiplier])
    # print("\nthe following people's hours could not get updated: ")
    for name in not_done:
        # print(f"    {name}: {not_done.get(name)[0]} hours")
        not_updated_hours.append([name, float(not_done.get(name)) * hours_multiplier])

    return {"data": return_data, "updated": updated_hours, "not_updated": not_updated_hours, "event_title": event_title, "people_attended": len(updated_hours)+len(not_updated_hours)}

    # takes url of sign up sheet of event to automate, credentials, and info dict
    # info dict contains: 
    # note for tmr: log into key club acc on pc and test