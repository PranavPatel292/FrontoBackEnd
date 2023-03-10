const fs = require("fs");

const makeCleanAddress = (address, hashMap) => {
  const splitAddress = address.split(" ");
  let suburb = "",
    postcode = "",
    state = "";

  const pinCode = splitAddress[splitAddress.length - 1];
  if (!isNaN(pinCode)) {
    if (pinCode in hashMap) {
      postcode = pinCode;
      const possibleSuburbs = hashMap[pinCode][0];
      state = hashMap[pinCode][1][0];
      const lowerCase = possibleSuburbs.map((sub) => {
        return sub.toLowerCase();
      });
      lowerCase.forEach((possibleSub) => {
        if (address.toLowerCase().includes(possibleSub)) {
          suburb =
            suburb.length < possibleSuburbs.length ? possibleSub : suburb;
          return suburb;
        }
      });

      if (suburb === "") return;
      const street_address = address.toLowerCase().split(suburb)[0].trim(" ");

      const array = [
        street_address.toUpperCase(),
        suburb.toUpperCase(),
        state.toUpperCase(),
        postcode,
      ];
      return (finalString = array.join(", "));
    } else {
      return address + "not found in the database";
    }
  }
};

const handleRawAddresses = (addresses, hashMap) => {
  const result = [];
  addresses.forEach((address) => {
    // remove any \" before and after the address;
    if (address.length > 0) {
      const cleanAddress = address.replace(/"/g, "");
      result.push(makeCleanAddress(cleanAddress, hashMap));
    }
  });
  return result;
};

const readAddressFile = (hashMap) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./backend-data/sample_addresses.csv",
      "utf-8",
      function (err, data) {
        if (err) reject(err);
        const rawAddress = data.split("\n");
        resolve(handleRawAddresses(rawAddress, hashMap));
      }
    );
  });
};

module.exports = readAddressFile;
