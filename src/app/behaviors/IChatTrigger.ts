export interface IChatTrigger {
    regex: RegExp;

    execute(channel: any, tags: any, message: any): void;
}