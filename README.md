# OWQueueBot
A simple Discord bot that allows users to easily see who in the server they can queue with in Overwatch's Competitive mode. I wrote it to practice working with JS and to get used to working with databases. It makes use of Node.js, discord.js, MongoDB for data related purposes and various other Node libraries. It works by scraping the playoverwatch website for SR statistics.

The basic structure of the bot was inspired by [this](https://anidiots.guide/) guide.

It currently only works with Battle.net (PC) accounts, but I might look into supporting console accounts in the near future.

The bot's prefix is `o!`.

### Commands
- `o!init` to log your initial info into the database. You will need to do this once per server, as the bot checks guild ID's in order to return relevant results.
- `o!update` to update your info and SR.
- `o!queue` to show everybody you can queue with, or `o!queue [battletag]` for a faster check of compatibility between you and one other player in the database.
- `o!remove` to remove yourself from the database. Note that if you initialized yourself under multiple guilds, this will remove all instances of your userid.
- `o!help` to get a full listing of commands in server, or `o!help [command]` to get more information on any one command.

### Todo
- Allow `o!queue` to take up to five arguments representing battletags, returning permutations of who can queue together.
- Turn `update` into an event that is run every time a queue check is performed.
- Console support. This may become more or less tricky if crossplay is eventually supported.

This is subject to change, let me know if you have any other suggestions.
