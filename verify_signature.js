// verify_signature.js
// Usage: node verify_signature.js
const fs = require('fs');
const nacl = require('tweetnacl');

if (!fs.existsSync('union_covenant_signed.txt') || !fs.existsSync('sovereign_pub.hex')) {
  console.error("Required files missing: union_covenant_signed.txt and sovereign_pub.hex");
  process.exit(1);
}

const signed = fs.readFileSync('union_covenant_signed.txt', 'utf8');
const parts = signed.split('\nSignature (ed25519 hex): ');
if (parts.length < 2) {
  console.error("Signed covenant not in expected format (missing signature line).");
  process.exit(1);
}

const covenant = parts[0].trim();
const sigHex = parts[1].trim();
const pubHex = fs.readFileSync('sovereign_pub.hex', 'utf8').trim();

const sig = Buffer.from(sigHex, 'hex');
const pub = Buffer.from(pubHex, 'hex');

const valid = nacl.sign.detached.verify(Buffer.from(covenant, 'utf8'), sig, pub);
console.log("Signature valid?", valid);
if (!valid) process.exit(2);
