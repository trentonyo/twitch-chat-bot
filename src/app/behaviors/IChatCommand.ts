export interface IChatCommand {
    command: string;

    execute(channel: any, tags: any, message: any): void;
}