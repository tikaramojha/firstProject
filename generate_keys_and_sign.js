// generate_keys_and_sign.js
// Usage: node generate_keys_and_sign.js union_covenant.txt
// Outputs: sovereign_pub.hex, sovereign_priv.hex, union_covenant_signed.txt
const fs = require('fs');
const nacl = require('tweetnacl');
const crypto = require('crypto');

if (process.argv.length < 3) {
  console.error("Usage: node generate_keys_and_sign.js union_covenant.txt");
  process.exit(1);
}

const covenantPath = process.argv[2];
if (!fs.existsSync(covenantPath)) {
  console.error("File not found:", covenantPath);
  process.exit(1);
}

// generate ed25519 keypair
const keypair = nacl.sign.keyPair();
const pubHex = Buffer.from(keypair.publicKey).toString('hex');
const privHex = Buffer.from(keypair.secretKey).toString('hex');

fs.writeFileSync('sovereign_pub.hex', pubHex, { encoding: 'utf8', flag: 'w' });
fs.writeFileSync('sovereign_priv.hex', privHex, { encoding: 'utf8', flag: 'w' });

console.log("Generated keys:");
console.log(" - sovereign_pub.hex  (public key, safe to publish)");
console.log(" - sovereign_priv.hex (private key, KEEP THIS SECRET!)");

const covenant = fs.readFileSync(covenantPath, 'utf8').trim();
const sig = nacl.sign.detached(Buffer.from(covenant, 'utf8'), keypair.secretKey);
const sigHex = Buffer.from(sig).toString('hex');

const signed = covenant + "\n\nSignature (ed25519 hex): " + sigHex + "\n";
fs.writeFileSync('union_covenant_signed.txt', signed, { encoding: 'utf8', flag: 'w' });
console.log("Created union_covenant_signed.txt (covenant with signature appended).");

// print covenant SHA256
const covenantHash = crypto.createHash('sha256').update(covenant).digest('hex');
console.log("Covenant SHA256 (unsigned covenant):", covenantHash);

// print signature hash (optional)
const signedHash = crypto.createHash('sha256').update(signed).digest('hex');
console.log("Signed covenant SHA256:", signedHash);
