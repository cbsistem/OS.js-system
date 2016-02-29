/*!
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2016, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
(function(Utils, VFS, API, DialogWindow) {

  /////////////////////////////////////////////////////////////////////////////
  // DIALOG
  /////////////////////////////////////////////////////////////////////////////

  function StatusDialog(args, callback) {
    args = Utils.argumentDefaults(args, {});
    args.scheme = OSjs.Extensions.SystemExtension.scheme;

    DialogWindow.apply(this, ['StatusDialog', {
      title: 'Status',
      icon: 'devices/network-wireless.png',
      width: 400,
      height: 300
    }, args, callback]);
  }

  StatusDialog.prototype = Object.create(DialogWindow.prototype);
  StatusDialog.constructor = DialogWindow;

  StatusDialog.prototype.init = function() {
    var root = DialogWindow.prototype.init.apply(this, arguments);
    var self = this;

    var networkStatus = this.scheme.find(this, 'Network');

    function refresh() {
      self._toggleLoading(true);

      API.call('ifconfig', {}, function(response) {
        self._toggleLoading(false);

        if ( response.result ) {
          if ( networkStatus ) {
            networkStatus.set('value', JSON.stringify(response.result, null, 4));
          }
        }
      }, function(err) {
        self._toggleLoading(false);
      });
    }

    this.scheme.find(this, 'ButtonClose').on('click', function(ev) {
      self._close();
    });

    this.scheme.find(this, 'ButtonRefresh').on('click', function(ev) {
      refresh();
    });

    refresh();

    return root;
  };

  /////////////////////////////////////////////////////////////////////////////
  // MODULE API
  /////////////////////////////////////////////////////////////////////////////

  var Status = {
    openDialog: function(cb) {
      cb = cb || function() {};

      return OSjs.API.createDialog(function(args, callback) {
        return new StatusDialog(args, callback);
      }, {}, cb);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // EXPORTS
  /////////////////////////////////////////////////////////////////////////////

  OSjs.Extensions.SystemExtension = OSjs.Extensions.SystemExtension || {};
  OSjs.Extensions.SystemExtension.Status = Status;

})(OSjs.Utils, OSjs.VFS, OSjs.API, OSjs.Core.DialogWindow);

