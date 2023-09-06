export function responseToJson(document) {
  const res = this;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(document));
}
