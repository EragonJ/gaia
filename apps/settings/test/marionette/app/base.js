'use strict';
/**
 * Base app object to provide common methods to app objects
 * @constructor
 * @param {Marionette.Client} client for operations.
 */
function Base(client, origin, selectors) {
  this.client = client;
  this.origin = origin;
  this.selectors = selectors;
}

module.exports = Base;

Base.prototype = {

  /**
   * Launches settings app, switches to frame, and waits for it to be loaded.
   */
  launch: function() {
    this.client.apps.launch(this.origin);
    this.client.apps.switchToApp(this.origin);
    this.client.helper.waitForElement('body');
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  findElement: function(name) {
    return this.client.findElement(this.selectors[name]);
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  findElements: function(name) {
    return this.client.findElements(this.selectors[name]);
  },

  /**
   * @protected
   * @param {String} name of selector [its a key in Settings.Selectors].
   */
  waitForElement: function(name) {
    return this.client.helper.waitForElement(this.selectors[name]);
  },

  registerTransitionEnd: function(sel) {
    this.client.executeScript(function(sel) {
      var ele = window.wrappedJSObject.document.querySelector(sel);
      ele.dataset.transitionStatus = '';
      ele.addEventListener('transitionend', function onTransitionEnd() {
        ele.removeEventListener('transitionend', onTransitionEnd);
        ele.dataset.transitionStatus = 'end';
      });
    }, [sel]);
  },

  waitForTransitionEnd: function(sel) {
    this.client.waitFor(function() {
      var transitionStatus = this.client.executeScript(function(sel) {
        var ele = window.wrappedJSObject.document.querySelector(sel);
        var transitionStatus = ele.dataset.transitionStatus;

        if (transitionStatus === 'end') {
          ele.dataset.transitionStatus = '';
        }

        return transitionStatus;
      }, [sel]);
      return (transitionStatus === 'end');
    }.bind(this));
  },

  waitForPanelReady: function app_waitForPanelReady(sel) {
    this.registerTransitionEnd(sel);
    this.waitForTransitionEnd(sel);
  }
};
