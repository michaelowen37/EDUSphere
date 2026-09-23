# Release checklist

One page, done by a person, before every commit that ships. The automated checks prove the app works; this proves it feels right.

## Machine first

1. `./check.sh` ends with `ALL CHECKS PASSED`.
2. `tools/sweep.sh` reports 0 overflow, 0 failed and 0 errors at both widths (about eight minutes; it opens every module and every page in a real browser).
3. `node tools/untaught.mjs` shows `Modules: 0 of ...`.

## Then a person, on a phone and on a laptop

4. Create an educator account with a new PIN and a device name. The tour starts on the laptop and stays away on the phone.
5. Add a student in each band (early years, elementary, middle, high). Rename one, add a picture to one, give one a PIN.
6. As an early-years student: open the first lesson, hear it read, tap through one round, color one page for a minute, play one game. Nothing should need reading.
7. As an older student: open a lesson, use Show me another way twice, open the Experiment link and the story, take one round to mastery, then Practice the missed ones once and read the result page.
8. As the educator: open the student's report, edit and save the weekly note, print it (or save as PDF) and read the printout as a parent would. Open the transcript and the standards map.
9. Open Who needs help, open one student from it, and mark one story as read from the Story Log.
10. Make a manual backup. Sign out and confirm the automatic backup file appeared. On a second device or a private window, restore from the file and confirm the PIN reset works with the recovery code.
11. Read the What's new pop-up as a new user would; every line should be true of this build.
12. On a day near one, confirm the remembrance card shows (September 11, Veterans Day, Memorial Day) and can be hidden for the year.

If anything in 4 to 12 feels wrong, it is a bug even when every check passes. Write it in docs/DECISIONS.md with the date and fix it before the commit.
