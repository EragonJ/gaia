/* global require, test, setup, marionette */
'use strict';
var Settings = require('../app/app'),
    assert = require('assert');

marionette('manipulate screenLock settings', function() {
  var client = marionette.client();
  var settingsApp;
  var screenLockPanel;

  setup(function() {
    settingsApp = new Settings(client);
    settingsApp.launch();
    // Navigate to the ScreenLock menu
    screenLockPanel = settingsApp.screenLockPanel;
    screenLockPanel.setupScreenLock();
  });

  test('lockscreen is enabled', function() {
    screenLockPanel.toggleScreenLock();
    assert.ok(screenLockPanel.isScreenLockEnabled());
  });

  test('passcode can\'t be enabled whn passcode is wrong', function() {
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode('1234', '5678');
    assert.ok(screenLockPanel.isPasscodeNotMatched());
  });

  test('passcode is enabled, then disabled successfully', function() {
    var rightCode = '1234';
    var wrongCode = '4567';
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(rightCode, rightCode);
    screenLockPanel.tapCreatePasscode();
    assert.ok(screenLockPanel.isPasscodeLockEnabled(),
      'passcode is enabled');
    assert.equal(screenLockPanel.getPasscodeFromMozSettings(), rightCode,
      'passcode is right');

    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(wrongCode);
    assert.ok(screenLockPanel.isPasscodeIncorrect(),
      'passcode is not correct');

    screenLockPanel.typePasscode(rightCode);
    assert.ok(!screenLockPanel.isPasscodeLockEnabled(),
      'passcode is disabled');
  });

  test('passcode is enabled, then get changed successfully', function() {
    var oldCode = '1234';
    var newCode = '4567';
    screenLockPanel.toggleScreenLock();
    screenLockPanel.togglePasscodeLock();
    screenLockPanel.typePasscode(oldCode, oldCode);
    screenLockPanel.tapCreatePasscode();
    assert.ok(screenLockPanel.isPasscodeLockEnabled(),
      'passcode is enabled');
    assert.equal(screenLockPanel.getPasscodeFromMozSettings(), oldCode,
      'passcode is right (with old code)');

    // there might be chances that we would make marionette run
    // too fast, so that we would mess up UI and can't find element
    // screenLockPanel.waitForPasscodePanelReady();

    screenLockPanel.tapEditPasscode(oldCode);
    screenLockPanel.typePasscode(newCode, newCode);
    screenLockPanel.tapChangePasscode();
    assert.equal(screenLockPanel.getPasscodeFromMozSettings(), newCode,
      'passcode is right (with new code)');
  });

  test('passcode is enabled, but we want to disable lockscreen directly',
    function() {
      var code = '1234';
      screenLockPanel.toggleScreenLock();
      screenLockPanel.togglePasscodeLock();
      screenLockPanel.typePasscode(code, code);
      screenLockPanel.tapCreatePasscode();

      screenLockPanel.toggleScreenLock();
      screenLockPanel.typePasscode(code);

      assert.ok(!screenLockPanel.isScreenLockEnabled());
  });
});
