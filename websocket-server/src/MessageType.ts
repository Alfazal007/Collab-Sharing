export interface Message {
    type: string;
    email?: string;
    to?: string;
    message?: string;
}

export const CONNECTTOSOCKET = "CONNECT";
export const CHAT = "CHAT";
