class Job {
  constructor(first, ...rest) {
    if (rest.length === 0) {
      this.deserialize(first);
    } else {
      this.url = first;
      this.html = rest[0];
    }
  }

  serialize() {
    return JSON.stringify({
      url: this.url,
      html: this.html
    });
  }

  deserialize(json) {
    const parsed = JSON.parse(json);

    this.url = parsed.url;
    this.html = parsed.html;
  }
}

module.exports = Job;
