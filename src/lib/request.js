export function bodyToJson() {
  const req = this;
  return new Promise((resolve, reject) => {
    let body = [];
    req
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
        const json = JSON.parse(body);
        resolve(json);
      });
  });
}
