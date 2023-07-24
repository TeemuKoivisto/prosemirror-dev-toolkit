# Testing with Cypress

The screen snapshots tests will most likely fail when run in headed mode locally (EDIT: apparently they've started working as I have upgraded my Cypress version). The first bug on this matter I encountered was that the headless version will always run in full-screen while you have to config the windowed version to use full-screen to match the screenshots.

Yet then there was the matter of browsers - Cypress comes with Electron as the default browser which is quite similar to Chrome but has for example different outline colors (yellow). Causing things to break. Okay, I did switch both headless and headed to use Chrome but then came the random CSS mismatches after which I thought forget it, this is way too much work.

Instead I let the windowed screen snapshots break and as they are the last lines of every test it doesn't interrupt other testing. Or at least you can work around this by commenting them out.

And all of this worked locally but immediately as I started using Cypress in a Github action it all came tumbling down. First, the Cypress tests would hang indefinitely after the first failure. Ok, a hack found on [StackOverflow](https://stackoverflow.com/questions/61661932/cypress-interrupt-all-tests-on-first-failure/69766882#69766882) fixed it. Then I looked into the screenshots and noticed that the CSS was different in CI as it was on my computer.

Switching Chrome to Electron didn't help. One error was that the scrollbars were visible in CI which was fixable with a flag to Chrome but some font-weight differences still occurred which I tried to fix no avail. Only solution I found was to decrease the accuracy of the screenshot snapshots which seem to capture still the biggest changes but omit the little font-size variations.

What a nightmare but I hope this will pay off in some degree. I tested TestCafe too and while its API and overall architecture seemed a little better it had no free-to-use GUI and failed on a simple h2 withText selector so I'm stuck with Cypress I guess.

If the right panel disappears when you make the window too small, you can resize it back by moving your cursor to the right edge (you should get the col-resize pointer). An interesting feature.. https://github.com/cypress-io/cypress/issues/2132

You can also try reinstalling everything if all else fails: `yarn cy cache clear && yarn install --force`

# Cypress v12

Cypress was updated to v12 in 07/2023 which kinda works except for random bugs in CI. As of now, the screenshot tests only work inside the GitHub action (probably due to how Chrome renders fonts differently in macOS vs Linux) and you should not expect them to pass locally. Also, there's some weird bug with the latest (12.17.2) Cypress as it throws at times: `RangeError: The value of "offset" is out of range`
