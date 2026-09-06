# FlagFun

A no-build static site for exploring country and territory flags, taking a multiple-choice quiz, and discovering a weekly flag. It is designed for GitHub Pages.

## Features
- Visitor-local date and time in the header
- Light/dark theme preference stored in the browser
- Searchable flag collection with 300+ country and territory entries supplied by FlagCDN
- Multiple-choice quiz with persistent local score and streak
- Deterministic Flag of the Week that changes at local midnight every Sunday

## Development

Open `index.html` directly or serve the directory with any static-file server. No build step or secrets are needed.

Flag images and the country/territory list are fetched from [FlagCDN](https://flagcdn.com/). A small built-in fallback keeps the core experience usable if that service is unavailable.
