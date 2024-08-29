import { ChatBotConfig } from './../config/config.model';
import { TwitchTokenDetails } from './../models/twitchTokenDetails.models';
import { TwitchTokenResponseValidator } from './../utils/TwitchTokenResponseValidator';
import { MalformedTwitchRequestError, NoTwitchResponseError, TwitchResponseError } from '../models/error.model';
import { IChatCommand } from '../behaviors/IChatCommand';
import fs from 'fs';
import path from 'path';
import {IChatTrigger} from "../behaviors/IChatTrigger";
import { Pool } from 'pg';

export class TwitchChatBot {

    tmi = require('tmi.js');

    public twitchClient: any;
    private tokenDetails!: TwitchTokenDetails;
    private chatCommands: IChatCommand[] = [];
    private chatTriggers: IChatTrigger[] = [];

    private commandStrings: string[] = [];

    constructor(private config: ChatBotConfig, private dbPool: Pool) { }

    async launch() {
        this.tokenDetails = await this.fetchAccessToken();
        this.twitchClient = new this.tmi.Client(
            this.buildConnectionConfig(
                this.config.twitchChannel,
                this.config.twitchUser,
                this.tokenDetails.access_token)
        );
        this.setupBotBehavior();
        this.twitchClient.connect();
    }

    private async fetchAccessToken(): Promise<TwitchTokenDetails> {
        const axios = require('axios');
        console.log("Fetching Twitch OAuth Token");
        return axios({
            method: 'post',
            url: this.config.twitchTokenEndpoint,
            params: {
                client_id: this.config.twitchClientId,
                client_secret: this.config.twitchClientSecret,
                code: this.config.twitchAuthorizationCode,
                grant_type: 'authorization_code',
                redirect_uri: 'http://localhost'

            },
            responseType: 'json'
        }).then(async function (response: any) {
            // handle success
            return await TwitchTokenResponseValidator.parseResponse(response.data);
        }).catch(function (error: any) {
            console.log("Failed to get Twitch OAuth Token");
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new TwitchResponseError(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                throw new NoTwitchResponseError(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new MalformedTwitchRequestError(error.request);
            }
        })
    }

    refreshTokenIfNeeded() {
        //TODO if needed - twitch apparently only requires the token on login so it is good enough for now to just get a token on start-up.
    }

    private async loadBehaviors() {
        const behaviorsDir = path.resolve(__dirname, '../behaviors');
        const files = fs.readdirSync(behaviorsDir);

        for (const file of files) {
            if (!file.startsWith("IChat") && (file.endsWith('.ts') || file.endsWith('.js'))) {
                const chatBehavior = await import(path.join(behaviorsDir, file));
                const ChatClass = chatBehavior.default || Object.values(chatBehavior)[0];  // Check for default export first
                const chatInstance = new (ChatClass as any)(this.twitchClient);

                // Commands are invoked by "!commandName" messages
                if ('execute' in chatInstance &&
                    'command' in chatInstance
                ) {
                    if (this.commandStrings.includes(chatInstance.command)) {
                        throw Error(`Command collision: ${path.join(behaviorsDir, file)}: ${chatInstance.command}`)
                    } else {
                        this.chatCommands.push(chatInstance);
                        this.commandStrings.push(chatInstance.command);
                    }
                }
                // Triggers are invoked by matching a regex string
                else if ('execute' in chatInstance &&
                    'regex' in chatInstance) {
                    this.chatTriggers.push(chatInstance);
                }
            }
        }
    }

    private async setupBotBehavior() {
        await this.loadBehaviors();

        this.twitchClient.on('message', (channel: any, tags: any, message: string, self: any) => {
            if (message.toLowerCase().startsWith('!')) {
                for (const chatCommand of this.chatCommands) {
                    if (message.toLowerCase() === chatCommand.command) {
                        chatCommand.execute(channel, tags, message);
                        break;
                    }
                }
            } else if (!self) {
                for (const chatTrigger of this.chatTriggers) {
                    if (message.match(chatTrigger.regex)) {
                        chatTrigger.execute(channel, tags, message);
                        break;
                    }
                }
            }
        });
    }

    private buildConnectionConfig(channel: string, username: string, accessToken: string) {
        return {
            options: { debug: true },
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: `${username}`,
                password: `oauth:${accessToken}`
            },
            channels: [`${channel}`]
        };
    }
}


