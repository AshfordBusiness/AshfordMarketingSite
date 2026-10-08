# Website tracking

Internal log for www.ashfordintegrations.com. Kept off the public site by `_config.yml`.

How to use it:
- Every change that goes live gets a row in the change log, newest first.
- Anything left to do goes in Open items. When it's done, delete the row and note it in the change log.

## Open items

| # | Item | Added | Deadline | Action |
|---|---|---|---|---|
| 1 | Test booking on Mon 12 Oct 2026, 11:00 | 08 Oct 2026 | Before Sun 11 Oct 2026, 11:00 (its reminder email goes out then) | Delete the calendar event and its Sales Pipeline row |
| 2 | Any other test bookings | 08 Oct 2026 | None | Delete the calendar events and their Sales Pipeline rows |
| 3 | Test rows "test 02" and "test 3" in Showcase Builds | 08 Oct 2026 | None | Delete them in Notion |
| 4 | Calendar invite Accept and Decline replies go to Gmail | 08 Oct 2026 | None | Only fixable by running the script from a Google account under the business email |
| 5 | Booking slots only read the Gmail account's Google Calendar | 08 Oct 2026 | Before the first real booking | Confirm client meetings live in that calendar, not Outlook |

## How it runs

| Part | Detail |
|---|---|
| Hosting | GitHub Pages, deploys from `main` on every merge. Usually live within 10 minutes. |
| Domain | www.ashfordintegrations.com (`CNAME`) |
| Unlisted pages (`noindex`) | `p/showcase/`, `p/foresters-arms/`, `p/the-star/` |
| Kept off the site | `PRODUCT.md`, `DESIGN.md`, `WEBSITE-TRACKING.md` (listed in `_config.yml`), and the `_booking/` folder |
| Backend | Google Apps Script "Ashford booking". Source: `_booking/Code.gs`. Setup: `_booking/SETUP.md`. |
| Script runs as | ryandaley000@gmail.com (Execute as: Me). Its Google Calendar gives the free slots, and its Gmail sends the emails. |
| Web app URL | https://script.google.com/macros/s/AKfycbyeicZdCrR4PBV8_VxSCwYyTZTNfREkAKTfxNythU1-ZAxDdOJMmSNhFjY_ZcxCis2Vxw/exec (used by `assets/booking.js` and `p/showcase/index.html`) |
| Script properties | `NOTION_TOKEN`, `NOTION_DATABASE_ID` (Sales Pipeline), `SHOWCASE_DATABASE_ID` (Showcase Builds) |
| Notion integration | `Website bookings`, connected to Sales Pipeline and Showcase Builds |
| Owner emails | "New booking" and "New showcase build" go to ryan@ashfordintegrations.com |
| Visitor emails | Confirmation and 24-hour reminder are sent from the Gmail account, with Reply-To set to ryan@ashfordintegrations.com |

## Updating the Apps Script

1. Make the change in `_booking/Code.gs` in this repo first, so the repo and the live script stay identical.
2. In Apps Script: paste the change, then Cmd+S. Check there's no dot next to `Code.gs`.
3. Deploy, then Manage deployments, then the pencil, then Version: **New version**, then Deploy. The URL stays the same.
4. Never click **New deployment**. It makes a new URL, and the site would keep calling the old code.
5. To roll back: Manage deployments, the pencil, pick the previous version number, then Deploy.

## Gotchas

| Gotcha | Fix |
|---|---|
| Saving the showcase again from the same browser updates the same row and sends no email | Click **Start a new build** twice within 4 seconds before saving a new one |
| Cmd+F in Apps Script can miss text | Click inside the code first. Cmd+Option+F opens Find & Replace. |
| Deploying without saving ships the old code | Cmd+S first, then deploy |
| The Execute as setting can't be changed to another email | Leave it as **Me**. "User accessing" would make visitors sign in to Google. |

## Change log

Newest first. Before 25 Sep 2026 the site was changed by direct commits: see the git history.

| Date | PR | Change | Notes |
|---|---|---|---|
| 08 Oct 2026 | [#46](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/46) | Booking script: visitor replies go to ryan@ashfordintegrations.com | Same edit made in the live Apps Script and redeployed |
| 08 Oct 2026 | [#45](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/45) | Booking script: send owner notifications to ryan@ashfordintegrations.com | Same edit made in the live Apps Script and redeployed. Tested: the "test 3" build emailed the business inbox. |
| 08 Oct 2026 | [#44](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/44) | Add the System Showcase as an unlisted page that saves builds to Notion | Apps Script updated and redeployed, `SHOWCASE_DATABASE_ID` added, Showcase Builds connected to `Website bookings`. Book a Call checked: slots still load. |
| 29 Sep 2026 | [#43](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/43) | Homepage AI operations system card: ops dashboard mock-up to match the rest of the site | |
| 29 Sep 2026 | [#42](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/42) | CRM pipeline mock-up: match the kanban style used elsewhere | |
| 29 Sep 2026 | [#41](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/41) | Case study dashboard pipeline: blurred kanban to match homepage | |
| 29 Sep 2026 | [#40](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/40) | Homepage pipeline: kanban with illustrative deals and values | |
| 28 Sep 2026 | [#39](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/39) | Rebuild homepage hero card in the style of the case study mock-ups | |
| 28 Sep 2026 | [#38](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/38) | New research mock-up: market trends, competitor insights, client outreach | |
| 28 Sep 2026 | [#37](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/37) | Reword research build as personalised research visualisation | |
| 28 Sep 2026 | [#36](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/36) | Reword operations dashboard description | |
| 28 Sep 2026 | [#35](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/35) | Restore 2.5× the reactions stat | |
| 28 Sep 2026 | [#34](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/34) | Correct reactions stat to 150% more reactions | |
| 28 Sep 2026 | [#33](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/33) | Show reactions stat as 250% more reactions | |
| 28 Sep 2026 | [#32](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/32) | Give pipeline bars uneven heights instead of a staircase | |
| 28 Sep 2026 | [#31](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/31) | Dashboard mock-up: shorter task list, full-width pipeline chart | |
| 28 Sep 2026 | [#30](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/30) | Swap expanding clients for a sales pipeline chart on the dashboard mock-up | |
| 28 Sep 2026 | [#29](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/29) | Move research build to the end of What we built | |
| 28 Sep 2026 | [#28](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/28) | Use Discovery, Lead, Contacted, Proposed, Won, Lost pipeline stages | |
| 28 Sep 2026 | [#27](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/27) | Remove emojis from case study mock-ups, rename pipeline to Sales Pipeline | |
| 28 Sep 2026 | [#26](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/26) | Rebuild content engine section around campaigns and approval | |
| 28 Sep 2026 | [#25](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/25) | Show ticked checkboxes as a tick instead of a green fill | |
| 28 Sep 2026 | [#24](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/24) | Colour priority chips: High red, Medium yellow, Low grey | |
| 28 Sep 2026 | [#23](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/23) | Remove redaction note from case study | |
| 28 Sep 2026 | [#22](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/22) | Stop publishing PRODUCT.md and DESIGN.md on the site | |
| 28 Sep 2026 | [#21](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/21) | Make Coach Logic case study vaguer about internal process | |
| 27 Sep 2026 | [#20](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/20) | Remove 'Content exposed the gap underneath' section from case study | |
| 27 Sep 2026 | [#19](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/19) | Remove Before and after section from case study | |
| 27 Sep 2026 | [#18](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/18) | Remove How we built it section from case study | |
| 27 Sep 2026 | [#17](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/17) | Remove Tools used section from case study | |
| 27 Sep 2026 | [#16](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/16) | Scroll reveal 25% faster | |
| 27 Sep 2026 | [#15](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/15) | Stronger scroll reveal and cache-busted assets | |
| 27 Sep 2026 | [#14](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/14) | Subtle scroll reveal on homepage and case study | |
| 27 Sep 2026 | [#13](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/13) | Booking: call topic dropdown, training button opens booking | |
| 27 Sep 2026 | [#12](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/12) | Booking page intro wording | |
| 27 Sep 2026 | [#11](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/11) | Booking system and new contact email | |
| 27 Sep 2026 | [#10](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/10) | Hero: new headline, remove Working with line | |
| 27 Sep 2026 | [#9](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/9) | Builds intro: overpaying-for-software story and fixed build cost | |
| 27 Sep 2026 | [#8](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/8) | Remove Notion mentions from site copy | |
| 27 Sep 2026 | [#7](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/7) | Nav: Case Study link goes to the case study page | |
| 27 Sep 2026 | [#6](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/6) | Add Google Search Console verification file | |
| 27 Sep 2026 | [#5](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/5) | Green castle favicon and logo markup for Google | |
| 25 Sep 2026 | [#4](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/4) | Case study: new intro and why-it-matters line | |
| 25 Sep 2026 | [#3](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/3) | Reword Business AI brain | |
| 25 Sep 2026 | [#2](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/2) | Homepage clean-up: meeting note taker, drop LinkedIn source line | |
| 25 Sep 2026 | [#1](https://github.com/AshfordBusiness/AshfordMarketingSite/pull/1) | Redesign site and add Coach Logic case study | |
