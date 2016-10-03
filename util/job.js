class Job {
  constructor(first, ...rest) {
    if (rest.length === 0) {
      this.deserialize(first);
    } else {
      this.url = first;
      this.html = rest[0];
      this.id = rest[1];
    }
  }

  serialize() {
    return JSON.stringify({
      url: this.url || null,
      html: this.html || null,
      image: this.image || null,
      id: this.id || null
    });
  }

  deserialize(json) {
    const parsed = JSON.parse(json);

    this.url = parsed.url || null;
    this.html = parsed.html || null;
    this.image = parsed.image || null;
    this.id = parsed.id || 0;
  }

  setImage(image) {
    this.image = image;
  }
}

module.exports = Job;
