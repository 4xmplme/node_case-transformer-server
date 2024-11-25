const http = require('http');
const { convertToCase } = require('./convertToCase');

function createServer() {
  return http.createServer((req, res) => {
    const [path, queryString] = req.url.split('?');
    const errors = [];

    const textToConvert = path.slice(1);

    if (!textToConvert) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    const searchParams = new URLSearchParams(queryString);
    const toCase = searchParams.get('toCase');

    if (!toCase) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    const validCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    if (toCase && !validCases.includes(toCase)) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ errors }));
    }

    const { originalCase, convertedText } = convertToCase(
      textToConvert,
      toCase,
    );

    const responseBody = {
      originalCase,
      targetCase: toCase,
      originalText: textToConvert,
      convertedText,
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(responseBody));
  });
}

module.exports = { createServer };
