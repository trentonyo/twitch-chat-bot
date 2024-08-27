export interface IBehavior {
    command: string;

    execute(channel: any, tags: any, message: any): void;
}