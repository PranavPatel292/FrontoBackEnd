const fs = require("fs");

const hashMap = {};

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
  return hashMap;
};

export const readPostCodeFile = () => {
  fs.readFile(
    "./backend-data/australian_post_codes.txt",
    "utf8",
    function (err, data) {
      if (err) console.error(err);
      const rawPinCode = data.split("\n");
      return helperPinCodeMapping(rawPinCode);
    }
  );
};
