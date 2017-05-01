'use babel';

import CustomFinderView from './custom-finder-view';
import { CompositeDisposable } from 'atom';

export default {

  customFinderView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.customFinderView = new CustomFinderView(state.customFinderViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'custom-finder:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.customFinderView.destroy();
  },

  serialize() {
    return {
      customFinderViewState: this.customFinderView.serialize()
    };
  },

  toggle() {
    this.customFinderView.toggle();
  }

};
