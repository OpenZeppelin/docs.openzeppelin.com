'use strict';

module.exports = (components, componentName, otherPageVersions) => {
  const component = components.find(
      (candidate) => candidate.name === component.name
    ),
    pageVersions = [];
  component.versions.forEach((componentVersion) => {
    const pageVersion = otherPageVersions.find(
      (candidate) => candidate.string === componentVersion.string
    );
    pageVersions.push(
      pageVersion
        ? pageVersion
        : Object.assign({ missing: true }, componentVersion)
    );
  });

  return pageVersions;
};
