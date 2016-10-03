class Job {
  constructor(first, last) {
    if (last !== undefined) {
      this.id = last;
    }

    this.deserialize(first);
  }

  serialize() {
    return JSON.stringify(this);
  }

  deserialize(json) {
    const parsed = JSON.parse(json);

    Object.keys(parsed).forEach((key) => {
      this[key] = parsed[key];
    });
  }

  setImage(image) {
    this.image = image;
  }
}

module.exports = Job;
