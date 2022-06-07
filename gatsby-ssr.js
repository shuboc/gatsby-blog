const React = require("react")

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <div  key="1" id="fb-root"></div>,
    <script key="2" async defer crossOrigin="anonymous" src="https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v14.0&appId=1994883547264823&autoLogAppEvents=1" nonce="HfMN3ySV"></script>,
    <script key="3" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8326531217396814" crossOrigin="anonymous"></script>,
  ])
}