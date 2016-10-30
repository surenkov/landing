export type Id = string;

// Block related types

export type Block = {
    id: Id,
    type: string,
    ordering: number
};

export type BlockState = {[id: Id]: Block};

export type BlockType = {
    type: string,
    name: string,
    template: Array<string>
};

export type TypeState = {[id: Id]: BlockType};


// Media related types

export type Media = {
    id: Id,
    mime_type: {},
    file_url: string
};

export type MediaState = {[id: Id]: Media};


// Notification related types

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
    type: NotificationType,
    title?: string,
    message?: string
};

export type NotificationSpec = {
    id: number,
    type: NotificationType,
    notify: Notification
};

export type NotificationState = Array<NotificationSpec>;


// User credentials

export type Credentials = {
    email: string,
    password: string
};

export type User = {
    id: string,
    role: 'admin' | 'manager',
    name: string,
    email: string
};

export type UserState = {[id: Id]: User};
