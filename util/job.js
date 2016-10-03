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
      url: this.url || null,
      html: this.html || null,
      image: this.image || null
    });
  }

  deserialize(json) {
    const parsed = JSON.parse(json);

    this.url = parsed.url || null;
    this.html = parsed.html || null;
    this.image = parsed.image || null;
  }

  setImage(image) {
    this.image = image;
  }
}

module.exports = Job;
