type AsyncAction = (any) => Promise;


export type Action = { type: string } | AsyncAction;
export type Dispatch = (a: Action) => Action;

export type State = {};
export type Listener = () => void;

type Unsubscribe = () => void;
type Subscribe = (l: Listener) => Unsubscribe;

export type Store = {
    dispatch: Dispatch,
    getState: () => State,
    subscribe: Subscribe
}
