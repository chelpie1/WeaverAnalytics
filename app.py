import flask
from flask import Flask, render_template, request, url_for, redirect
import os
import glob
import json
import base64
import ipdb 
import numpy as np
from PIL import Image

app = Flask(__name__ )
app.debug = True

imageDict = {}
for filename in os.listdir(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\FacialImages'):
	
	imageDict[filename] = [x for x in os.listdir(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\FacialImages\\' + filename ) if x[-3:] == 'pgm' ] 


@app.route("/", methods = ["GET","POST"])
def index():
								   
	return render_template('index.html' , images = imageDict)





@app.route("/imageAnalysis", methods = ["POST"])
def imageAnalysis():
	print(request.form['image'])
	
	image = request.form['image'].split(',')[1]
	image = base64.b64decode(image)

	with open(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\test.png', 'wb+') as f:
		f.write(image)
	
	img = Image.open(r'C:\Users\Ryan\Desktop\WeaverAnalytics\static\test.png').convert('RGBA')
	matrix = np.array(img)

	
	return '0' 
	


if __name__ == "__main__":
    app.run(port=5015)