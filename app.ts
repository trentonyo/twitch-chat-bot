import { ChatBotConfig } from './src/app/config/config.model';
import { ConfigValidator } from './src/app/config/config-validator';
import { TwitchChatBot } from './src/app/chatBot/chatbot';
import {connectToDatabase, pool} from './src/app/database/dbConnection';

ConfigValidator.readConfig('./config.json')
    .then((config: ChatBotConfig) => {
        return connectToDatabase()
            .then(() => config);
    })
    .then((config: ChatBotConfig) => {
        new TwitchChatBot(config, pool).launch();
    })
    .catch(err => {
        console.error('Error initializing application:', err);
    });