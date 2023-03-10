const express = require("express");
const fs = require("fs");

// {2042: [["A", "B"], ["NSW"]]}
// {"A" : [2042, "NSW"]}
const hashMap = {};
const mappingOfSuburbsAndPostCodes = {};

const helperPinCodeMapping = (data) => {
  data.forEach((ele) => {
    const splitPinCodeData = ele.split(",");

    if (!isNaN(splitPinCodeData[0])) {
      if (splitPinCodeData[0] in hashMap) {
        hashMap[splitPinCodeData[0]][0].push(splitPinCodeData[1]);
      } else {
        hashMap[splitPinCodeData[0]] = [
          [splitPinCodeData[1]],
          [splitPinCodeData[splitPinCodeData.length - 4]],
        ];
      }

      if (splitPinCodeData[1] in hashMap === false) {
        hashMap[splitPinCodeData[1]] = [
          splitPinCodeData[0],
          splitPinCodeData[splitPinCodeData.length - 4],
        ];
      }
    }
  });
};

const readPostCodeFile = () => {
  fs.readFile(
    "./backend-data/australian_post_codes.txt",
    "utf8",
    function (err, data) {
      if (err) console.error(err);
      const rawPinCode = data.split("\n");
      helperPinCodeMapping(rawPinCode);
    }
  );
};

const makeCleanAddress = (address) => {
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
      return addresses + "not found in the database";
    }
  }
};
const handleRawAddresses = (addresses) => {
  addresses.forEach((address) => {
    // remove any \" before and after the address;
    const cleanAddress = address.replace(/"/g, "");
    makeCleanAddress(cleanAddress);
  });
};

const readAddressFile = () => {
  fs.readFile(
    "./backend-data/sample_addresses.csv",
    "utf-8",
    function (err, data) {
      if (err) console.error(err);
      const rawAddress = data.split("\n");
      handleRawAddresses(rawAddress);
    }
  );
};

readPostCodeFile();
mappingOfSuburbsAndPostCodes = readPostCodeFile();

const app = express();

app.get("/loadAddress", (req, res) => {
  readAddressFile();
  res.send("hello");
});

app.listen("3000", () => console.log("listening on http://localhost:3000"));
