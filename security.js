var crypto = require('crypto');

module.exports = function verifyFacebookSignatureHeader(req, res, buf) {
  var signature = req.headers["x-hub-signature"];
  console.log(signature);
  if (!signature) {
    console.log("Signature absent in the request: %s", JSON.stringify(req));
  } else {
    // Get the facebook signature
	console.log(signature);
    var elements = signature.split('sha1=');
    var facebookSignature = elements[1];

    var expectedSignature = crypto.createHmac('sha1', process.env.FB_APP_SECRET)
      .update(buf)
      .digest('hex');

    if (facebookSignature !== expectedSignature) {
      throw new Error("Could not verify message was sent from Facebook.");
    }
  }
}
