// https://stackoverflow.com/a/38191078
function isUUID(str: string) {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    str
  );
}

export default isUUID;
