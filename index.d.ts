import { EditorView } from 'prosemirror-view';
type ButtonPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
interface DevToolsOpts {
    devToolsExpanded?: boolean;
    buttonPosition?: ButtonPosition;
}
declare function applyDevTools(view: EditorView, opts?: DevToolsOpts): void;
declare function removeDevTools(): void;
export { applyDevTools, removeDevTools };
