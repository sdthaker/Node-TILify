import { generateHTMLForFile } from '../src/utils/htmlGenerator';
import fs from 'fs';

describe('generateHTMLForFile', () => {
  it('should validate file I/O operations', () => {
    const mockReadFileSync = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(() => {
        return ` first paragraph.

second paragraph.
should be same as 2.

third paragraph has a link to [Github](https://github.com/) in the middle of the paragraph!

fourth paragraph has a link in the end of the paragraph [Github](https://github.com/)

[Github](https://github.com/) fifth paragraph has a link to the beginning!

[Github](https://github.com/) sixth paragraph has lots of [Github](https://github.com/) links within itself [Github](https://github.com/)

[Github](https://github.com/)

There is horizontal line below this
---

---
There is horizontal line above this

---

There is horizontal line below this
---
There is horizontal line above this

This line has a link [Github](https://github.com/) plus an image ![Github](https://github.com/favicon.ico) in the same line

![minimalist-1](../src/static/minimalist-1.jpg) This line has an image at the beginning

This line has an image at the end ![minimalist-8](../src/static/minimalist-8.png)

This line has an image in the middle ![minimalist-6](../src/static/minimalist-6.avif) of the line

![minimalist-2](../src/static/minimalist-2.jpg) This line has lots of images ![minimalist-3](../src/static/minimalist-3.jpg) within itself ![minimalist-4](../src/static/minimalist-4.jpg) and more ![minimalist-5](../src/static/minimalist-5.jpg) and more ![minimalist-7](../src/static/minimalist-7.jpg)`;
      });
    const mockWriteFileSync = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});
    const mockExistsSync = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => true);

    generateHTMLForFile('examples/This is a Markdown Test Blog.md', 'til');

    expect(mockReadFileSync).toHaveBeenCalledWith(
      'examples/This is a Markdown Test Blog.md',
      'utf-8'
    );
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      'til/This is a Markdown Test Blog.html',
      expect.any(String)
    );
    expect(mockExistsSync).toHaveBeenCalledWith('til');

    mockReadFileSync.mockRestore();
  });
});
