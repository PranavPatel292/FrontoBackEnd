const express = require("express");
const readAddressFile = require("./readAddresses");
const readPostCodeFile = require("./readPostCode");
const app = express();
const fs = require("fs");

// {2042: [["A", "B"], ["NSW"]]}
// {"A" : [2042, "NSW"]}
let mappingOfSuburbsAndPostCodes = {};

app.get("/loadAddress", function (req, res) {
  // this will indicate that the request has been accepted but not yet completed.
  res.writeHead(202, { "Content-Type": "text/plain" });
  res.write("Data processing started...");

  readAddressFile(mappingOfSuburbsAndPostCodes)
    .then((data) => {
      const resultFileObj = fs.createWriteStream("./result.csv");
      data.forEach((element) => {
        if (element) resultFileObj.write(`${element}\n`);
      });
      resultFileObj.on("error", (err) => {
        res.statusCode = 500;
        res.end(err.message);
      });
      res.statusCode = 200;
      res.end("Data processed and saved successfully");
    })
    .catch((err) => {
      console.error(err);
      res.statusCode = 500;
      res.end("An error occurred while reading the data");
    });
});

readPostCodeFile(mappingOfSuburbsAndPostCodes).then((data) => {
  mappingOfSuburbsAndPostCodes = data;
  app.listen(3000, () => console.log("server started on port: 3000"));
});
