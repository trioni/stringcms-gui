export class KeyboardUtil {
  static shouldBail(element) {
    // stop for input, select, and textarea
    const bailForElements = [
      'INPUT',
      'SELECT',
      'TEXTAREA'
    ];
    return bailForElements.includes(element.tagName) || element.isContentEditable;
  }
}

export default {};