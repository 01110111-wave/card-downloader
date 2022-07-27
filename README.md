# card-downloader
## Description
this is card non-official illusion card downloader ,the downlaoder is writtten with DiscordJS.
## Instruction
1. cd to project path.
1. run npm or yarn or pnpm install.
2. then run "$node app.js &lt;discord login token> &lt;mode>" in cmd ,the mode you may select is rg(room girl) ,aihs2(ai shoujo and honey select2) ,koi(koikatu) 
    1. if you provide no discord login token or invalid one ,the program return error.
    2. if you provide no mode ,it run using rg as mode .
    3. guide to get discord login token https://www.npmjs.com/package/discord.js-selfbot-v13,
WARNING!!! keep the token safe do not let anyone see it.


## caution
The download does not work when the message you react contain no card or card it contain is not the standard size(252 x 352).
In that case, the logs of the message which contain its link and author are recorded is side file name "list.json".
In case of success, the logs are kept in file name "downloadlog.json".

contact me discord 01110111#2033 for more information
