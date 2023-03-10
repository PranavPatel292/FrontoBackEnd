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

export const readAddressFile = () => {
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
