import Component from '@ember/component';
import layout from './template';
import { EKMixin, keyUp } from 'ember-keyboard';
import { on } from '@ember/object/evented';
import { task } from 'ember-concurrency';
import config from 'dummy/config/environment';
import { inject as service } from '@ember/service';

const projectName = config['ember-cli-addon-docs'].projectName;

export default Component.extend(EKMixin, {
  layout,
  store: service(),

  classNames: 'docs-ml-auto',

  query: null,

  didInsertElement() {
    this._super();

    this.set('keyboardActivated', true);
    this.get('fetchProject').perform();
  },

  // TODO: The searchbox doesn't work without the project being fetched.
  // We should move this logic (and everywhere else in the code that's fetching
  // the project) within a new addonDocs service that wires all that up together.
  // I think it's fine if our Docs-* components assume there is a single global
  // project.
  fetchProject: task(function*() {
    yield this.get('store').findRecord('project', projectName);
  }),

  focusSearch: on(keyUp('Slash'), function() {
    this.element.querySelector('input').focus();
  }),

  unfocusSearch: on(keyUp('Escape'), function() {
    this.get('on-input')(null);
  })
});
