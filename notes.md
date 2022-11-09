# miscellaneous notes:
For the QR class.
- we use .update() to lerp highlight and rotation of cube.
- on lerp we store ideal states of rotation and highlight of cube then lerp
- have fuctions like updateKeyPattern() and updateKeyHighlgiht() to change the ideal state of the cube. 

great source
https://www.qr-code-generator.com/qr-code-marketing/qr-codes-basics/#:~:text=Version%20information,are%20versions%201%20to%207.



just a note: we are using qr code version 3. 29x29 I think


--------------------------------------------------------
>>> creating the javascript engine.

>> prototype chain
> create goal states
> create .animateQR(keyArray:array) func that takes an array of 0s and 1s.
	get list of which cube to rotate. 
	rotate them just .rotateX(180deg)
> modify code to be center pivots.








-----------------------
# qr code tutorial
https://www.youtube.com/watch?v=yg6zjqfNsbM