import type { EditorState, Transaction } from "prosemirror-state";
import { Plugin, PluginKey } from "prosemirror-state";

const key = new PluginKey("prosemirror-dev-toolkit-transaction-subscription");

class SubscriptionState {
  private trs: Transaction[] = [];

  constructor() {
    this.trs = [];
  }

  push(tr: Transaction) {
    this.trs.push(tr);
  }

  clear() {
    const trs = this.trs;
    this.trs = [];
    return trs;
  }
}

type SubscriptionPlugin = Plugin<SubscriptionState>

export function initSubscriptionPlugin(): [SubscriptionPlugin, SubscriptionState] {
  const pluginState = new SubscriptionState();

  const plugin = new Plugin<SubscriptionState>({
    key,
    filterTransaction: tr => {
      pluginState.push(tr);
      return true;
    }
  });

  return [plugin, pluginState]
}

export function isSubscriptionPlugin(plugin: Plugin): boolean {
  return plugin.spec.key === key;
}

/**
 * Directly remove the subscription plugin into the editor state.
 *
 * This is a hack since EditorState should be treated as immutable normally.
 */
export function removeSubscriptionPlugin(state: EditorState) {
  for (let i = 0; i < state.plugins.length; i++) {
    if (isSubscriptionPlugin(state.plugins[i])) {
      state.plugins.splice(i, 1);
    }
  }
}

/**
 * Directly insert the subscription plugin into the editor state.
 *
 * This is a hack since EditorState should be treated as immutable normally.
 */
export function insertSubscriptionPlugin(state: EditorState, plugin: SubscriptionPlugin) {
  removeSubscriptionPlugin(state);
  state.plugins.push(plugin);
}
