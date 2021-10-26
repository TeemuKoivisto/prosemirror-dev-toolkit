import { Transaction } from 'prosemirror-state';
import { Plugin as Plug } from "prosemirror-state";
import { EditorView } from 'prosemirror-view';
type ButtonPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
interface DevToolsOpts {
    devToolsExpanded?: boolean;
    buttonPosition?: ButtonPosition;
}
type Plugin = Plug & {
    key: string;
};
declare global {
    interface Window {
        applyDevTools: typeof applyDevTools;
        editorView?: EditorView;
        _node?: any;
        _doc?: {
            [key: string]: any;
        };
        _tr?: Transaction;
        _plugin?: [Plugin, any];
    }
}
declare function applyDevTools(view: EditorView, opts?: DevToolsOpts): Promise<void>;
declare function removeDevTools(): void;
export { applyDevTools, removeDevTools };
