const React = require("react")

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <div key="1" id="fb-root"></div>,
    <script key="2" async defer crossOrigin="anonymous" src="https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v13.0&appId=1994883547264823&autoLogAppEvents=1" nonce="VMAKMs28"></script>
  ])
}