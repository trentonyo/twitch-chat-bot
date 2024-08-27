# Twitch-Chat-Bot

A Chat Bot application for Twitch Channel Chats. 

Referenced in this [Medium Article](https://medium.com/codex/creating-a-twitch-chat-bot-ca368321b7f7).

## Pre-requisites

To run this application node.js and npm are required to be installed.

## Setup

In your **.env** configure general application settings: 
- twitch settings
- database settings

This application uses Twitch's [Oauth Authorization Code Flow](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow).
The application will do the process of fetching the OAuth token for you, but you still need to provide a few values like: channel, client_id, and client_secret.

> [!NOTE]
>
> This implementation differs from the original author in that the settings are added in a .env rather than a config.json. In addition, there is a helper
> script in this implementation that removes the need for generating an Authorization Code (the step where you copy a code from the address bar is not necessary here)

```
USERNAME=CHATBOT_USERNAME

CLIENT_ID=CLIENT_ID_FROM_MANAGE_APP
CLIENT_SECRET=CLIENT_SECRET_FROM_MANAGE_APP

# Include the port if there is one (e.g. https://yoursite.com:8001)
REDIRECT_URI=http://localhost
# Seperately include the port here, and use 80 otherwise (the above example would use 8001)
CATCH_PORT=80
```

## Run the application

To run the application, use the following command from the root of the project:

```shell
chmod +x ./scripts/start.sh
./scripts/start.sh
```
