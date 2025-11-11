// Expired Screen Component for webOS 3.0-3.5
// Shows when demo has expired

import React from "react"
import StorageHelper from "./StorageHelper" // Declare StorageHelper
import { createElement } from "react" // Declare createElement

var ExpiredScreen = (() => {
  function ExpiredScreenConstructor(props) {
    React.Component.call(this, props)
    this.state = {
      mac: StorageHelper.getMacAddress(),
      securityCode: StorageHelper.getSecurityCode(),
    }
  }

  ExpiredScreenConstructor.prototype = Object.create(React.Component.prototype)
  ExpiredScreenConstructor.prototype.constructor = ExpiredScreenConstructor

  ExpiredScreenConstructor.prototype.render = function () {
    var mac = this.state.mac
    var securityCode = this.state.securityCode

    return createElement(
      "div",
      { className: "expired-screen" },
      createElement(
        "div",
        { className: "expired-container" },
        createElement("div", { className: "expired-icon" }, "⏰"),
        createElement("h1", { className: "expired-title" }, "Demo Period Expired"),
        createElement(
          "p",
          { className: "expired-message" },
          "Your 7-day demo period has ended. To continue using IPTV Player, please upload your custom playlist.",
        ),

        createElement(
          "div",
          { className: "expired-info" },
          createElement(
            "div",
            { className: "expired-info-item" },
            createElement("div", { className: "expired-label" }, "MAC Address"),
            createElement("div", { className: "expired-value" }, mac),
          ),
          createElement(
            "div",
            { className: "expired-info-item" },
            createElement("div", { className: "expired-label" }, "Security Code"),
            createElement("div", { className: "expired-value" }, securityCode),
          ),
        ),

        createElement(
          "div",
          { className: "expired-instructions" },
          createElement("h3", null, "How to activate:"),
          createElement(
            "ol",
            null,
            createElement("li", null, "Visit www.aryatv.live"),
            createElement("li", null, "Enter your MAC Address and Security Code shown above"),
            createElement("li", null, "Upload your M3U playlist URL"),
            createElement("li", null, "Restart the app"),
          ),
        ),

        createElement(
          "button",
          {
            className: "expired-button",
            onClick: () => {
              window.location.reload()
            },
          },
          "Reload App",
        ),
      ),
    )
  }

  return ExpiredScreenConstructor
})()
