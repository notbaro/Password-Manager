const crypto = require("crypto");
const secret = "j0LLxprTxbeDt4aEAWN1DEtPFlduFb5v";

const encrypt = (password) => {
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv("aes-256-ctr", Buffer.from(secret), iv);

  const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    password: encrypted.toString("hex"),
  };
};

const decrypt = (encrypton) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-ctr",
    Buffer.from(secret),
    Buffer.from(encrypton.iv, "hex")
  );
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encrypton.password, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

module.exports = { encrypt, decrypt };
