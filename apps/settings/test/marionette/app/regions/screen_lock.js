/* global require, module */
'use strict';
var Base = require('../base');

/**
 * Abstraction around settings screenLock panel
 * @constructor
 * @param {Marionette.Client} client for operations.
 */
function ScreenLockPanel(client) {

  // Call the Base constructor to initiate base class.
  Base.call(this, client, null, ScreenLockPanel.Selectors);

}

module.exports = ScreenLockPanel;

ScreenLockPanel.Selectors = {
  'screenLockLabel': 'span[data-l10n-id="lockScreen"]',
  'passcodeLockLabel': 'span[data-l10n-id="passcode-lock"]',
  'passcodeInput': '#passcode-input',
  'passcodeIsNotMatchedLabel': 'div[data-l10n-id="passcode-doesnt-match"]',
  'passcodeIncorrectLabel': 'div[data-l10n-id="incorrect-passcode"]',
  'passcodeCreateButton': '#passcode-create',
  'passcodeEditButton': '#passcode-edit',
  'passcodeChangeButton': '#passcode-change',
  'passcodePanel': '#phoneLock-passcode'
};

ScreenLockPanel.prototype = {

  __proto__: Base.prototype,

  isScreenLockEnabled: function() {
    return this.client.settings.get('lockscreen.enabled');
  },

  isPasscodeLockEnabled: function() {
    return this.client.settings.get('lockscreen.passcode-lock.enabled');
  },

  isPasscodeNotMatched: function() {
    return this.findElement('passcodeIsNotMatchedLabel').displayed();
  },

  isPasscodeIncorrect: function() {
    return this.findElement('passcodeIncorrectLabel').displayed();
  },

  getPasscodeFromMozSettings: function() {
    return this.client.settings.get('lockscreen.passcode-lock.code');
  },

  enableScreenLock: function() {
    this.waitForElement('screenLockLabel').tap();
    this.client.waitFor(function() {
      return this.isScreenLockEnabled();
    }.bind(this));
  },

  setupScreenLock: function() {
    // we have to make sure screenLock is disabled by default
    if (!this.isScreenLockEnabled()) {
      return;
    }

    // if we have passcode by default, then there is a popup
    // when disabling screenLock, in this way, we have to 
    // type the correct code to disable passcodeLock at first
    if (this.isPasscodeLockEnabled()) {
      var code = this.getPasscodeFromMozSettings();
      this.togglePasscodeLock();
      this.typePasscode(code);
    }

    // then we can disable screenLock
    this.toggleScreenLock();
  },

  toggleScreenLock: function() {
    this.waitForElement('screenLockLabel').tap();
  },

  togglePasscodeLock: function() {
    this.waitForElement('passcodeLockLabel').tap();
  },

  _typePasscode: function(keys) {
    this.waitForElement('passcodeInput').sendKeys(keys);
  },

  typePasscode: function(key1, key2) {
    if (key1) {
      this._typePasscode(key1);
      if (key2) {
        this._typePasscode(key2);
      }
    }
  },

  tapCreatePasscode: function() {
    this.waitForElement('passcodeCreateButton').tap();
  },

  tapEditPasscode: function(keys) {
    this.waitForElement('passcodeEditButton').tap();
    this._typePasscode(keys);
  },

  tapChangePasscode: function() {
    this.waitForElement('passcodeChangeButton').tap();
  },

  waitForPasscodePanelReady: function() {
    this.waitForPanelReady(ScreenLockPanel.Selectors.passcodePanel);
  }
};
