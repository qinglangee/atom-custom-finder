'use babel';

import CustomFinder from '../lib/custom-finder';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('CustomFinder', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('custom-finder');
  });

  describe('when the custom-finder:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.custom-finder')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'custom-finder:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.custom-finder')).toExist();

        let customFinderElement = workspaceElement.querySelector('.custom-finder');
        expect(customFinderElement).toExist();

        let customFinderPanel = atom.workspace.panelForItem(customFinderElement);
        expect(customFinderPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'custom-finder:toggle');
        expect(customFinderPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.custom-finder')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'custom-finder:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let customFinderElement = workspaceElement.querySelector('.custom-finder');
        expect(customFinderElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'custom-finder:toggle');
        expect(customFinderElement).not.toBeVisible();
      });
    });
  });
});
