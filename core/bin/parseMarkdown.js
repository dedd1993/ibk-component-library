const headerRegExp = /---[\r\n]([\s\S]*)[\r\n]---/;
const titleRegExp = /# (.*)[\r\n]/;
const descriptionRegExp = /<p class="description">(.*)<\/p>[\r\n]/;
const headerKeyValueRegExp = /(.*): (.*)/g;
const emptyRegExp = /^\s*$/;

const getHeaders = (markdown) => {
  let header = markdown.match(headerRegExp);

  if (!header) {
    return {
      components: [],
    };
  }

  header = header[1];

  let regexMatches;
  const headers = {};

  // eslint-disable-next-line no-cond-assign
  while ((regexMatches = headerKeyValueRegExp.exec(header)) !== null) {
    headers[regexMatches[1]] = regexMatches[2];
  }

  if (headers.components) {
    headers.components = headers.components
      .split(',')
      .map(x => x.trim())
      .sort();
  } else {
    headers.components = [];
  }

  return headers;
}

const demoRegexp = /^"demo": "(.*)"/;

const getContents = (markdown) => {
  return markdown
    .replace(headerRegExp, '') // Remove header information
    .split(/^{{("demo":[^}]*)}}$/gm) // Split markdown into an array, separating demos
    // .filter(content => !emptyRegExp.test(content)); // Remove empty lines
}

const getTitle = (markdown) => {
  const matches = markdown.match(titleRegExp);

  if (!matches || !matches[1]) {
    throw new Error('Missing title in the page');
  }

  return matches[1];
}

const getDescription = (markdown) => {
  const matches = markdown.match(descriptionRegExp);

  if (!matches || !matches[1]) {
    throw new Error('Missing description in the page');
  }

  return matches[1];
}

module.exports = {
  getHeaders,
  demoRegexp,
  getContents,
  getTitle
}
