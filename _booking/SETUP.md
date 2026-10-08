# Booking system setup (about 10 minutes)

The website's `/book/` page talks to a small Google Apps Script that runs in your Ashford Google account. It reads your calendar for free times, books the call with a Google Meet link, adds the lead to your Notion Sales Pipeline, emails a confirmation, and sends a reminder 24 hours before.

Do every step signed in as **ryan@ashfordintegrations.com**.

## 1. Create the script
1. Go to https://script.google.com and click **New project**.
2. Rename it (top left) to `Ashford booking`.
3. Delete the sample code, then paste in the whole of `Code.gs`.
4. Click **Save**.

## 2. Turn on the Calendar service
1. In the left sidebar, click **+** next to **Services**.
2. Choose **Google Calendar API**, then click **Add**.

## 3. Connect Notion
1. Go to https://www.notion.so/profile/integrations and click **New integration**.
2. Name it `Website bookings`, choose your **Ashford** workspace, type **Internal**, then save.
3. Copy the **Internal Integration Secret**.
4. Open your **Sales Pipeline** database in Notion. Click **•••**, then **Connections**, and add `Website bookings`.
5. Back in Apps Script, click the **gear** (Project Settings). Scroll to **Script Properties** and add two:

| Property | Value |
|---|---|
| `NOTION_TOKEN` | the secret you copied |
| `NOTION_DATABASE_ID` | `a2a440db2f654065aa43791952ad9141` |

## 4. Authorise and test
1. Go back to the **Editor**. In the function dropdown at the top, choose `installReminderTrigger`, then click **Run**.
2. Google asks for permission. Click **Advanced**, then **Go to Ashford booking**, then **Allow**. The warning appears because the script is your own and hasn't been published, so it's safe.
3. Choose `testNotion` and click **Run**. A row called "TEST, delete me" should appear in your Sales Pipeline. Delete it once you've seen it.

## 5. Deploy
1. Click **Deploy**, then **New deployment**.
2. Click the gear next to **Select type** and choose **Web app**.
3. Set **Execute as** to **Me**, and **Who has access** to **Anyone**.
4. Click **Deploy**, then copy the **Web app URL**. It ends in `/exec`.
5. Send that URL to Claude. It goes into `assets/booking.js`, and then the site goes live.

## Changing things later
The settings are at the top of `Code.gs` under `CONFIG`: working hours (09:00 to 17:00), working days (Monday to Friday), call length (30 minutes), buffer between meetings (15 minutes), minimum notice (12 hours), and how far ahead people can book (21 days).

After editing, click **Deploy**, then **Manage deployments**. Click the pencil, set **Version** to **New version**, then click **Deploy**. The URL stays the same.

## What happens on each booking
1. The event lands in your Google Calendar, so it shows in Notion Calendar. It has a Google Meet link and the visitor is invited.
2. A new row goes into Sales Pipeline:
   - **Stage** is set to Discovery and **Lead Source** to Website.
   - **Next Action Date** is set to the call time.
   - What the call is about, the contact details, team size, current systems and their answer go in **Notes** and the page body.
3. The visitor gets a confirmation email from you.
4. You get a "New booking" email.
5. The visitor gets a reminder email 24 hours before the call, unless you've cancelled the event.

## System Showcase saves (about 5 minutes, once)
The unlisted page `/p/showcase/` saves each build into the Notion **Showcase Builds** database through this same script. A save from the page creates a row; saving again from the same browser updates that row.

1. In Notion, open **Ashford CRM System**, then **Showcase Builds**. Click **•••**, then **Connections**, and add `Website bookings`.
2. In Apps Script, open **Project Settings**, then **Script Properties**, and add:

| Property | Value |
|---|---|
| `SHOWCASE_DATABASE_ID` | `969829951a4d4ee4a84b53bf8ac7621b` |

3. Back in the **Editor**, replace all of the code with the latest `Code.gs` from this folder and click **Save**.
4. Choose `testShowcase` and click **Run**. A row called "TEST, delete me" appears in Showcase Builds, and you get a "New showcase build" email. Delete the row.
5. Click **Deploy**, then **Manage deployments**. Click the pencil, set **Version** to **New version**, then click **Deploy**. The URL stays the same, so the booking page keeps working.

### What happens on each showcase save
- **Name** is the business. **Systems** lists every system switched on, **Included** the first two, **Extra systems** the rest.
- **Build total** and **Monthly** are worked out by the script (£1,650 for the Brain and two systems, £300 per extra system, £265 a month to run and maintain), never taken from the page.
- **Additional information**, **Contact** and **Email** come from the form at the bottom of the page. **Last saved** is the time of the latest save.
- A new row starts at **Status** New and links to its **Deal** in Sales Pipeline when exactly one deal title contains the business name. Saving again never changes Status or Deal.
- You get one email per new build. Updates do not email.
- Each row has an **Edit key**. Only the browser that created a build can update it; leave the key alone.
