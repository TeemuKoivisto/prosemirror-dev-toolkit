# Testing with Cypress

The screen snapshots tests will most likely fail when run in headed mode locally. The first bug on this matter I encountered was that the headless version will always run in full-screen while you have to config the windowed version to use full-screen to match the screenshots.

Yet then there was the matter of browsers - Cypress comes with Electron as the default browser which is quite similar to Chrome but has for example different outline colors (yellow). Causing things to break. Okay, I did switch both headless and headed to use Chrome but then came the random CSS mismatches after which I thought forget it, this is way too much work.

Instead I let the windowed screen snapshots break and as they are the last lines of every test it doesn't interrupt other testing. Or at least you can work around this by commenting them out. Then, the only test run that matters is the headless execution with Electron which should be used as the source of truth.

Dunno if TestCafe is any better but I'm not especially impressed by Cypress after this point.